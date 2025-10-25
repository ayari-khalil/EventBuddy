import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function run() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent("Dis bonjour en français.");
    const response = await result.response;
    const text = response.text();
    console.log("✅ Réponse:", text);
  } catch (err) {
    console.error("❌ Erreur:", err);
  }
}

run();