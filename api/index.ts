import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import crypto from 'crypto';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

interface PostVersions {
  story: string;
  tech: string;
  punchy: string;
}

app.get('/api/health', (req, res) => {
  const hasGemini = getApiKeys('GEMINI_API_KEY').length > 0;
  const hasGroq = getApiKeys('GROQ_API_KEY').length > 0;
  const hasOpenRouter = getApiKeys('OPENROUTER_API_KEY').length > 0;
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(), 
    providers: { hasGemini, hasGroq, hasOpenRouter } 
  });
});

// Server-Side Sliding Cache (1 Hour TTL)
const cache = new Map<string, { versions: PostVersions; modelUsed: string; timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 60; // 1 hour cache

// Request Spacing: Keep at least 3 seconds between outgoing calls to avoid rate limits
let lastGeminiRequestTime = 0;
const MIN_REQUEST_SPACING = 3000;

function getApiKeys(envVarName: string): string[] {
  const rawVal = process.env[envVarName] || '';
  return rawVal.split(',')
    .map(k => k.trim())
    .filter(k => k.length > 0);
}

function getCacheKey(projectName: string, notes: string, win: string, styleMode: string): string {
  const data = `${projectName.trim()}:${notes.trim()}:${win.trim()}:${(styleMode || 'default').trim()}`;
  return crypto.createHash('md5').update(data).digest('hex');
}

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const STYLE_MODES_PROMPT: Record<string, string> = {
  default: "Balanced authentic LinkedIn style. Human, reflective, engaging, natural.",
  professional: "More polished and structured. Less emotional. More credibility-focused. Still human and not robotic.",
  founder_story: "More storytelling-focused. Emphasize journey, pressure, lessons, vision, and building experience.",
  funny_humorous: "Use light developer humor, relatable coding jokes, and playful observations. Do NOT overdo memes or cringe internet humor. Keep it intelligent and natural.",
  casual_developer: "Sound like a real developer casually sharing an experience online. Relaxed wording. Less polished. More authentic and conversational.",
  technical: "Focus more on architecture, workflows, AI systems, engineering challenges, scaling, integrations, and implementation details.",
  inspirational: "More emotionally uplifting and motivational while still remaining grounded and believable.",
  minimal: "Short, clean, direct writing. Minimal fluff. Simple wording.",
  viral_linkedin: "Use stronger hooks, curiosity, pacing, and readability optimization. Still avoid cringe engagement bait."
};

function getSystemInstruction(styleMode: string): string {
  const modeKey = (styleMode || 'default').toLowerCase().replace(/\s+/g, '_');
  const modeDescription = STYLE_MODES_PROMPT[modeKey] || STYLE_MODES_PROMPT.default;

  return `You are an expert LinkedIn ghostwriter specializing in authentic founder, developer, and startup storytelling.
Your job is to generate highly human, emotionally authentic, and engaging LinkedIn posts based on the user's real experience.

# CORE WRITING RULES
The post MUST:
* feel naturally written by a real human
* avoid robotic AI wording
* avoid generic corporate language
* avoid sounding like a press release
* avoid exaggerated motivational writing
* avoid overly cinematic or poetic phrasing
* sound emotionally real and grounded

The writing should prioritize:
authenticity > storytelling > emotional relatability > technical explanation.

# STRUCTURE GUIDELINES
1. Start with a strong hook.
2. Introduce the challenge/problem naturally.
3. Include specific details from the experience.
4. Mention struggles, debugging, pressure, learning, or emotions realistically.
5. Explain the project without sounding like marketing copy.
6. End with reflection, insight, gratitude, or excitement for the future.
7. Use natural line breaks for readability.
8. Vary sentence lengths naturally.

# IMPORTANT STYLE RESTRICTIONS
DO NOT use phrases like:
* “The caffeine flowed.”
* “Chasing ghosts in the codebase.”
* “Against all odds.”
* “The ideas flew.”
* “Breathing life into.”
* “Journey taught us.”
* “We refused to give up.”

Avoid sounding like:
* motivational speeches
* startup commercials
* cinematic storytelling
* AI-generated LinkedIn posts

Instead:
* sound grounded
* sound technically authentic
* sound like a real developer/founder
* use specific and believable details

GOOD:
“We spent hours debugging agent communication because one workflow kept breaking.”

BAD:
“We were battling chaos deep into the night.”

# SELECTED WRITING STYLE MODE: ${styleMode.toUpperCase()}
You MUST strictly adapt the tone, humor level, structure, pacing, and vocabulary according to this selected style:
"${modeDescription}"

# FINAL OUTPUT REQUIREMENTS
You MUST respond with a JSON object containing exactly three keys: 'story', 'tech', and 'punchy'. Do not wrap the JSON output in markdown blocks.
Each version ('story', 'tech', 'punchy') must:
* adhere strictly to the selected style mode (${styleMode.toUpperCase()})
* feel platform-native to LinkedIn, personal, believable, and emotionally authentic

1. **The Story Version ('story')**:
   - Focus: A narrative-driven post focusing on the journey, struggle, and human aspect under the ${styleMode.toUpperCase()} style.
   - Hook: Strong hook adapted to the style.
   - Include 3 organic hashtags at the bottom.

2. **The Tech Version ('tech')**:
   - Focus: Engineering-focused post highlighting specific stack choices and systems hurdles tailored to the ${styleMode.toUpperCase()} style.
   - Hook: Technical or analytical hook.
   - Include 3 organic hashtags at the bottom.

3. **The Punchy Version ('punchy')**:
   - Focus: Short, high-impact version with fast pacing customized for the ${styleMode.toUpperCase()} style.
   - Hook: Crisp and direct hook.
   - Include 3 organic hashtags at the bottom.`;
}

function formatGithubPrompt(githubInfo: any): string {
  if (!githubInfo) return '';
  let prompt = `\nGitHub Context:`;
  if (githubInfo.repoMeta) {
    const { description, language, topics, stars } = githubInfo.repoMeta;
    if (description) prompt += `\n- Description: ${description}`;
    if (language) prompt += `\n- Primary Language: ${language}`;
    if (topics && topics.length > 0) prompt += `\n- Topics: ${topics.slice(0, 10).join(', ')}`;
    if (stars > 0) prompt += `\n- Stars: ${stars}`;
  }
  if (githubInfo.techStack) prompt += `\n- Core Dependencies: ${githubInfo.techStack}`;
  if (githubInfo.structure) prompt += `\n- Folder Structure: ${githubInfo.structure}`;
  return prompt;
}

async function getGithubInfo(url: string) {
  if (!url) return null;
  try {
    const cleanUrl = url.trim().replace(/\/$/, '').replace(/\.git$/, '');
    const match = cleanUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
    if (!match) return null;
    const [_, owner, repo] = match;
    
    const headers: Record<string, string> = { 'User-Agent': 'Narrate-App' };
    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
    }

    // 1. Fetch Repository Metadata (Description, Lang, Stars, Topics)
    const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers });
    let repoMeta: any = null;
    if (repoRes.ok) {
      const repoData = await repoRes.json();
      repoMeta = {
        description: repoData.description || '',
        language: repoData.language || '',
        topics: repoData.topics || [],
        stars: repoData.stargazers_count || 0,
        forks: repoData.forks_count || 0
      };
    }

    // 2. Fetch package.json and extract key production dependencies (limiting to 15, ignoring common dev tooling)
    const pkgRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/package.json`, { headers });
    let techStack = '';
    if (pkgRes.ok) {
      const data = await pkgRes.json();
      const content = Buffer.from(data.content, 'base64').toString();
      try {
        const pkg = JSON.parse(content);
        // Only focus on core dependencies (not devDependencies which contain linter, test, build tools)
        const deps = pkg.dependencies ? Object.keys(pkg.dependencies) : [];
        const ignoredDeps = ['dotenv', 'cors', 'helmet', 'nodemon', 'cookie-parser'];
        const cleanDeps = deps.filter(d => !ignoredDeps.includes(d));
        techStack = cleanDeps.slice(0, 15).join(', ');
      } catch (e) {
        console.warn('Failed to parse package.json dependencies:', e);
      }
    }

    // 3. Fetch Directory Structure (directories only to keep it clean and token-efficient)
    const treeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/`, { headers });
    let structure = '';
    if (treeRes.ok) {
      const files = await treeRes.json();
      if (Array.isArray(files)) {
        // filter for key directories and exclude hidden directories or dotfiles
        const dirs = files
          .filter((f: any) => f.type === 'dir' && !f.name.startsWith('.'))
          .map((f: any) => f.name);
        structure = dirs.join(', ');
      }
    }

    return { repoMeta, techStack, structure };
  } catch (error) {
    console.error('Error fetching GitHub info:', error);
    return null;
  }
}

// ----------------------------------------------------
// Provider Integrations
// ----------------------------------------------------

async function generateWithGemini(
  projectName: string,
  notes: string,
  win: string,
  githubInfo: any,
  styleMode: string
): Promise<{ versions: PostVersions; modelUsed: string }> {
  const keys = getApiKeys('GEMINI_API_KEY');
  if (keys.length === 0) throw new Error('No Gemini API keys configured');

  const models = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-1.5-pro'];
  let lastError: any = null;

  for (const key of keys) {
    const genAI = new GoogleGenerativeAI(key);
    for (const modelName of models) {
      try {
        console.log(`[Gemini] Attempting with model: ${modelName} using key: ..${key.slice(-4)}`);
        
        // Rate Spacing Throttling
        const now = Date.now();
        const timeSinceLastRequest = now - lastGeminiRequestTime;
        if (timeSinceLastRequest < MIN_REQUEST_SPACING) {
          const delay = MIN_REQUEST_SPACING - timeSinceLastRequest;
          await sleep(delay);
        }
        lastGeminiRequestTime = Date.now();

        const model = genAI.getGenerativeModel({ 
          model: modelName,
          generationConfig: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: 'object',
              properties: {
                story: { type: 'string', description: 'LinkedIn post - The Story version.' },
                tech: { type: 'string', description: 'LinkedIn post - The Tech version.' },
                punchy: { type: 'string', description: 'LinkedIn post - The Punchy version.' }
              },
              required: ['story', 'tech', 'punchy']
            } as any
          },
          systemInstruction: getSystemInstruction(styleMode)
        });

        let prompt = `Project: ${projectName}\nNotes: ${notes}\nWin: ${win}${formatGithubPrompt(githubInfo)}`;

        const result = await model.generateContent(prompt);
        if (!result.response) throw new Error('Empty response from Gemini');
        const text = result.response.text();
        const versions = JSON.parse(text);
        return { versions, modelUsed: `Gemini (${modelName})` };
      } catch (error: any) {
        lastError = error;
        const msg = error.message || '';
        console.warn(`[Gemini] Error with model ${modelName}:`, msg);
        if (msg.includes('429') || msg.includes('503') || msg.includes('404') || error.status === 429 || error.status === 503 || error.status === 404) {
          await sleep(1500);
          continue;
        }
        break; // Key-specific issue, switch to next key
      }
    }
  }
  throw lastError || new Error('Gemini failed on all keys/models');
}

async function generateWithGroq(
  projectName: string,
  notes: string,
  win: string,
  githubInfo: any,
  styleMode: string
): Promise<{ versions: PostVersions; modelUsed: string }> {
  const keys = getApiKeys('GROQ_API_KEY');
  if (keys.length === 0) throw new Error('No Groq API keys configured');

  const models = ['llama-3.3-70b-versatile', 'mixtral-8x7b-32768'];
  let lastError: any = null;

  for (const key of keys) {
    for (const modelName of models) {
      try {
        console.log(`[Groq] Attempting with model: ${modelName} using key: ..${key.slice(-4)}`);
        
        let prompt = `Project: ${projectName}\nNotes: ${notes}\nWin: ${win}${formatGithubPrompt(githubInfo)}`;

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${key}`
          },
          body: JSON.stringify({
            model: modelName,
            response_format: { type: 'json_object' },
            messages: [
              {
                role: 'system',
                content: getSystemInstruction(styleMode)
              },
              {
                role: 'user',
                content: prompt
              }
            ],
            temperature: 0.7
          })
        });

        if (!response.ok) {
          const errText = await response.text();
          throw new Error(`Groq API returned status ${response.status}: ${errText}`);
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;
        if (!content) throw new Error('Empty response from Groq');

        const versions = JSON.parse(content);
        if (!versions.story || !versions.tech || !versions.punchy) {
          throw new Error('Groq response JSON missing required fields');
        }

        return { versions, modelUsed: `Groq (${modelName})` };
      } catch (error: any) {
        lastError = error;
        console.warn(`[Groq] Error with model ${modelName}:`, error.message);
        await sleep(1500);
      }
    }
  }
  throw lastError || new Error('Groq failed on all keys/models');
}

async function generateWithOpenRouter(
  projectName: string,
  notes: string,
  win: string,
  githubInfo: any,
  styleMode: string
): Promise<{ versions: PostVersions; modelUsed: string }> {
  const keys = getApiKeys('OPENROUTER_API_KEY');
  if (keys.length === 0) throw new Error('No OpenRouter API keys configured');

  const models = ['google/gemini-2.5-flash', 'meta-llama/llama-3.3-70b-instruct', 'google/gemini-1.5-flash'];
  let lastError: any = null;

  for (const key of keys) {
    for (const modelName of models) {
      try {
        console.log(`[OpenRouter] Attempting with model: ${modelName} using key: ..${key.slice(-4)}`);

        let prompt = `Project: ${projectName}\nNotes: ${notes}\nWin: ${win}${formatGithubPrompt(githubInfo)}`;

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${key}`,
            'HTTP-Referer': 'https://yogeswar.xyz',
            'X-Title': 'Narrate App'
          },
          body: JSON.stringify({
            model: modelName,
            response_format: { type: 'json_object' },
            messages: [
              {
                role: 'system',
                content: getSystemInstruction(styleMode)
              },
              {
                role: 'user',
                content: prompt
              }
            ],
            temperature: 0.7
          })
        });

        if (!response.ok) {
          const errText = await response.text();
          throw new Error(`OpenRouter API returned status ${response.status}: ${errText}`);
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;
        if (!content) throw new Error('Empty response from OpenRouter');

        const versions = JSON.parse(content);
        if (!versions.story || !versions.tech || !versions.punchy) {
          throw new Error('OpenRouter response JSON missing required fields');
        }

        return { versions, modelUsed: `OpenRouter (${modelName})` };
      } catch (error: any) {
        lastError = error;
        console.warn(`[OpenRouter] Error with model ${modelName}:`, error.message);
        await sleep(1500);
      }
    }
  }
  throw lastError || new Error('OpenRouter failed on all keys/models');
}

// ----------------------------------------------------
// Generate Endpoint with Cascade Failover
// ----------------------------------------------------

app.post('/api/generate', async (req, res) => {
  try {
    const { projectName, githubUrl, notes, win, password, styleMode = 'default' } = req.body;

    const adminPassword = (process.env.ADMIN_PASSWORD || '').toString().trim();
    const providedPassword = (password || '').toString().trim();
    
    if (providedPassword !== adminPassword) {
      console.warn(`[Auth] Password mismatch. Provided: "${providedPassword}", Expected: "${adminPassword}"`);
      return res.status(401).json({ error: 'Unauthorized: Invalid password' });
    }

    if (!projectName || !notes || !win) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // 1. Check Server-Side Cache
    const cacheKey = getCacheKey(projectName, notes, win, styleMode);
    const cachedItem = cache.get(cacheKey);
    if (cachedItem && (Date.now() - cachedItem.timestamp < CACHE_TTL)) {
      console.log('[Cache] Cache hit! Returning cached versions instantly.');
      return res.json({ versions: cachedItem.versions, modelUsed: `${cachedItem.modelUsed} (cached)` });
    }

    const githubInfo = await getGithubInfo(githubUrl);
    console.log('GitHub Info fetched:', !!githubInfo);
    
    let result: { versions: PostVersions; modelUsed: string } | null = null;
    let lastError: any = null;

    // 2. Cascade Route 1: Gemini
    try {
      result = await generateWithGemini(projectName, notes, win, githubInfo, styleMode);
    } catch (e: any) {
      console.warn('[Cascade Failover] Gemini failed, cascading to Groq. Error:', e.message || e);
      lastError = e;
    }

    // 3. Cascade Route 2: Groq
    if (!result) {
      try {
        result = await generateWithGroq(projectName, notes, win, githubInfo, styleMode);
      } catch (e: any) {
        console.warn('[Cascade Failover] Groq failed, cascading to OpenRouter. Error:', e.message || e);
        lastError = e;
      }
    }

    // 4. Cascade Route 3: OpenRouter
    if (!result) {
      try {
        result = await generateWithOpenRouter(projectName, notes, win, githubInfo, styleMode);
      } catch (e: any) {
        console.error('[Cascade Failover] OpenRouter failed. Error:', e.message || e);
        lastError = e;
      }
    }

    if (result) {
      // Write to Cache
      cache.set(cacheKey, { versions: result.versions, modelUsed: result.modelUsed, timestamp: Date.now() });
      return res.json({ versions: result.versions, modelUsed: result.modelUsed });
    }

    const finalErrorMessage = lastError?.message || 'All AI providers failed to generate content';
    console.error('Final failure across all providers:', finalErrorMessage);
    return res.status(500).json({ error: finalErrorMessage });
  } catch (error: any) {
    console.error('CRITICAL SERVER ERROR:', error);
    res.status(500).json({ error: `Critical Server Error: ${error.message || 'Unknown'}` });
  }
});

export default app;

if (!process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}
