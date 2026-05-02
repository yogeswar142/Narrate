import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI((process.env.GEMINI_API_KEY || '').trim());

async function runTest() {
  const projectName = "Cordia";
  const notes = `Discord bots handle millions of interactions, but developers often don't know
  which features are popular, where their users are located, or if their bot is
  lagging on specific shards. 
My vision for Cordia was to create a "Zero-Config" analytics and management
  plane—a platform where a developer can drop in a single line of code and
  instantly get a professional-grade dashboard that handles telemetry, uptime,
  team collaboration, and community growth.`;
  const win = `built the "infrastructure" that helps other developers turn their hobby bots into professional, data-driven businesses.`;
  const githubUrl = "https://github.com/yogeswar142/cordialane";

  console.log("--- Testing Narrate Generation with Gemini 2.0 Flash-Lite ---");
  
  const model = genAI.getGenerativeModel({ 
    model: 'gemini-2.0-flash-lite',
    systemInstruction: "Transform these technical notes into 3 LinkedIn post versions: \n- 'The Story' (Relatable struggle/learning)\n- 'The Tech' (Stack/Complexity/Performance)\n- 'The Punchy' (Short, 3-line hook). \nUse developer terminology, scannable formatting (short lines), and 3 relevant hashtags. No generic corporate fluff."
  });

  const prompt = `Project: ${projectName}\nNotes: ${notes}\nWin: ${win}\nGitHub: ${githubUrl}`;

  try {
    const result = await model.generateContent(prompt);
    console.log("\n--- RESULT ---");
    console.log(result.response.text());
  } catch (error) {
    console.error("Test failed:", error);
  }
}

runTest();
