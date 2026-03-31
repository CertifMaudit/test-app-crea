import { GoogleGenerativeAI } from "@google/generative-ai";
import type { GeneratedCreative, GenerationParams } from "@/types";
import { buildPrompt } from "./prompts";

const MODEL_NAME = "gemini-2.0-flash-exp";

export async function generateCreatives(
  params: GenerationParams
): Promise<{ creatives: GeneratedCreative[]; errors: string[] }> {
  const apiKey = process.env.GOOGLE_AI_API_KEY;
  if (!apiKey) {
    throw new Error("GOOGLE_AI_API_KEY is not configured");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: MODEL_NAME,
    generationConfig: {
      // @ts-expect-error — responseModalities is supported by the API but not yet in SDK types
      responseModalities: ["image", "text"],
    },
  });

  const creatives: GeneratedCreative[] = [];
  const errors: string[] = [];

  // Generate each creative sequentially to avoid rate limiting
  for (let i = 0; i < params.numberOfCreatives; i++) {
    const prompt = buildPrompt(
      params.aspectRatio,
      params.visualStyle,
      params.userInstructions,
      params.negativePrompt,
      i
    );

    try {
      const result = await model.generateContent([
        {
          inlineData: {
            mimeType: params.imageMimeType,
            data: params.imageBase64,
          },
        },
        { text: prompt },
      ]);

      const response = result.response;
      const candidates = response.candidates;

      if (!candidates || candidates.length === 0) {
        errors.push(`Variante ${i + 1}: No response from API`);
        continue;
      }

      let foundImage = false;
      for (const part of candidates[0].content.parts) {
        if (part.inlineData) {
          creatives.push({
            id: `creative-${Date.now()}-${i}`,
            imageBase64: part.inlineData.data,
            mimeType: part.inlineData.mimeType || "image/png",
            prompt,
            variant: i + 1,
          });
          foundImage = true;
          break;
        }
      }

      if (!foundImage) {
        errors.push(`Variante ${i + 1}: API did not return an image`);
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown error";
      errors.push(`Variante ${i + 1}: ${message}`);
    }

    // Small delay between requests to respect rate limits
    if (i < params.numberOfCreatives - 1) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  return { creatives, errors };
}
