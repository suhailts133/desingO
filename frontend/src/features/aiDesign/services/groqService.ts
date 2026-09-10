import axios from "axios";
import { SPACE_TYPE_AI, DESIGN_STYLE_AI } from "../../common/baseData";
import type { StructuredDesignPrompt } from "../aiDesignInterface";

const GROQ_MODEL = "openai/gpt-oss-120b";

const groqClient = axios.create({
  baseURL: "https://api.groq.com/openai/v1",
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
    "Content-Type": "application/json",
  },
});

interface GroqChatCompletionResponse {
  choices: Array<{ message: { content: string } }>;
}

function buildSystemPrompt(spaceTypes: string[], designStyles: string[]): string {
  return `You are a prompt engineer for an interior design image generator.
Given a customer's free-text request, do three things:

1. Pick the single closest "space type" from this exact list: [${spaceTypes.join(", ")}].
   If nothing is mentioned or nothing is close, default to "${spaceTypes[0]}".
2. Pick the single closest "design style" from this exact list: [${designStyles.join(", ")}].
   If nothing is mentioned or nothing is close, default to "${designStyles[0]}".
3. Write a vivid, detailed image-generation prompt (2-4 sentences) describing that space
   in that style — materials, color palette, lighting, key furniture/fixtures.

Respond with ONLY a JSON object, no markdown fencing, no commentary:
{
  "structuredPrompt": string,
  "matchedSpaceType": string,
  "matchedDesignStyle": string
}`;
}

export async function structurePromptWithGroq(userPrompt: string): Promise<StructuredDesignPrompt> {
  const response = await groqClient.post<GroqChatCompletionResponse>("/chat/completions", {
    model: GROQ_MODEL,
    response_format: { type: "json_object" },
    temperature: 0.4,
    messages: [
      { role: "system", content: buildSystemPrompt(SPACE_TYPE_AI, DESIGN_STYLE_AI) },
      { role: "user", content: userPrompt },
    ],
  });

  const rawContent = response.data.choices[0]?.message.content;
  if (!rawContent) {
    throw new Error("Groq returned an empty response");
  }

  const parsed = JSON.parse(rawContent) as StructuredDesignPrompt;
  if (!parsed.structuredPrompt || !parsed.matchedSpaceType || !parsed.matchedDesignStyle) {
    throw new Error("Groq response was missing required fields");
  }
  console.log(parsed)
  return parsed;
}