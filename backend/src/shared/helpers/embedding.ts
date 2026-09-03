import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

const taskType = "RETRIEVAL_DOCUMENT";

export async function generateEmbedding(text: string): Promise<number[] | null> {
    try {
        const response = await ai.models.embedContent({
            model: "gemini-embedding-001",
            contents: text,
            config: {
                outputDimensionality: 768,
                taskType,
            },
        });
        return response.embeddings?.[0]?.values ?? null;
    } catch (err) {
        console.error("Embedding generation failed:", err);
        return null;
    }
}