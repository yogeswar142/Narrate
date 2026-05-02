import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI((process.env.GEMINI_API_KEY || '').trim());

async function listModels() {
  try {
    const models = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${(process.env.GEMINI_API_KEY || '').trim()}`);
    const data = await models.json();
    console.log("--- Available Models ---");
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("List failed:", error);
  }
}

listModels();
