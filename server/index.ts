import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

app.post('/api/generate', async (req, res) => {
  const { projectName, notes, win } = req.body;

  if (!projectName || !notes || !win) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const model = genAI.getGenerativeModel({ 
    model: 'gemini-2.0-flash',
    systemInstruction: "Transform these technical notes into 3 LinkedIn post versions: \n- 'The Story' (Relatable struggle/learning)\n- 'The Tech' (Stack/Complexity/Performance)\n- 'The Punchy' (Short, 3-line hook). \nUse developer terminology, scannable formatting (short lines), and 3 relevant hashtags. No generic corporate fluff."
  });

  const prompt = `
Project: ${projectName}
Technical Notes: ${notes}
Key Win: ${win}
`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    // Simple parsing to extract the 3 versions
    // Expecting the AI to follow the system instruction format
    const versions = parseAIResponse(text);
    
    res.json({ versions });
  } catch (error) {
    console.error('Error generating content:', error);
    res.status(500).json({ error: 'Failed to generate content' });
  }
});

function parseAIResponse(text: string) {
  // This is a naive parser, could be improved with better prompting for JSON output
  const storyMatch = text.match(/'The Story'([\s\S]*?)(?='The Tech'|'The Punchy'|$)/i);
  const techMatch = text.match(/'The Tech'([\s\S]*?)(?='The Story'|'The Punchy'|$)/i);
  const punchyMatch = text.match(/'The Punchy'([\s\S]*?)(?='The Story'|'The Tech'|$)/i);

  return {
    story: storyMatch?.[1]?.trim() || '',
    tech: techMatch?.[1]?.trim() || '',
    punchy: punchyMatch?.[1]?.trim() || ''
  };
}

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
