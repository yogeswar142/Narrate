import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), env: !!process.env.GEMINI_API_KEY });
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

async function getGithubInfo(url: string) {
  if (!url) return null;
  try {
    const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
    if (!match) return null;
    const [_, owner, repo] = match;
    
    const pkgRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/package.json`, {
      headers: { 'User-Agent': 'Narrate-App' }
    });
    let techStack = '';
    if (pkgRes.ok) {
      const data = await pkgRes.json();
      const content = Buffer.from(data.content, 'base64').toString();
      const pkg = JSON.parse(content);
      const deps = { ...pkg.dependencies, ...pkg.devDependencies };
      techStack = Object.keys(deps).join(', ');
    }

    const treeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/`, {
      headers: { 'User-Agent': 'Narrate-App' }
    });
    let structure = '';
    if (treeRes.ok) {
      const files = await treeRes.json();
      structure = files.map((f: any) => f.name).join(', ');
    }

    return { techStack, structure };
  } catch (error) {
    console.error('Error fetching GitHub info:', error);
    return null;
  }
}

app.post('/api/generate', async (req, res) => {
  try {
    const { projectName, githubUrl, notes, win, password } = req.body;

    if (password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Unauthorized: Invalid password' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'Server configuration error: Missing AI API Key' });
    }

    if (!projectName || !notes || !win) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const githubInfo = await getGithubInfo(githubUrl);
    
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash',
      systemInstruction: "Transform these technical notes into 3 LinkedIn post versions: \n- 'The Story' (Relatable struggle/learning)\n- 'The Tech' (Stack/Complexity/Performance)\n- 'The Punchy' (Short, 3-line hook). \nUse developer terminology, scannable formatting (short lines), and 3 relevant hashtags. No generic corporate fluff. Incorporate technical context from the provided GitHub info if available."
    });

    let prompt = `
Project: ${projectName}
Technical Notes: ${notes}
Key Win: ${win}
`;

    if (githubInfo) {
      prompt += `
GitHub Tech Stack: ${githubInfo.techStack}
Project Structure: ${githubInfo.structure}
`;
    }

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const versions = parseAIResponse(text);
    res.json({ versions });
  } catch (error: any) {
    console.error('Error generating content:', error);
    res.status(500).json({ error: error.message || 'Failed to generate content' });
  }
});

function parseAIResponse(text: string) {
  const storyMatch = text.match(/'The Story'([\s\S]*?)(?='The Tech'|'The Punchy'|$)/i);
  const techMatch = text.match(/'The Tech'([\s\S]*?)(?='The Story'|'The Punchy'|$)/i);
  const punchyMatch = text.match(/'The Punchy'([\s\S]*?)(?='The Story'|'The Tech'|$)/i);

  return {
    story: storyMatch?.[1]?.trim() || '',
    tech: techMatch?.[1]?.trim() || '',
    punchy: punchyMatch?.[1]?.trim() || ''
  };
}

export default app;

if (!process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}
