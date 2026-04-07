import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
});

export async function generateTattooCoachReply(message: string) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("Missing GEMINI_API_KEY");
  }

  const prompt = `
You are InkPlan AI Tattoo Coach.

You help tattoo artists practice safely and improve their skills.
Be clear, practical, supportive, and concise.
Focus on tattoo fundamentals, fake skin practice, machine control, linework, shading, packing, stretch, posture, and workflow.
Do not give dangerous medical advice.
Do not encourage tattooing real skin for beginners.

User message:
${message}
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: prompt,
  });

  return response.text || "No response returned.";
}