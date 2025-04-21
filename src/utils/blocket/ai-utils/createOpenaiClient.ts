import OpenAI from "openai";
import 'dotenv/config'


export const createOpenaiClient = () => {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY_BLOCKET });
  return openai;
}