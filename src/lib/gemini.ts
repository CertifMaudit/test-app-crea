import type { GeneratedCreative, GenerationParams } from "@/types";
import { buildPrompt } from "./prompts";

const API_BASE = "https://generativelanguage.googleapis.com";

// Try models in order of preference
const MODELS = [
  "gemini-2.0-flash-preview-image-generation",
  "gemini-2.0-flash-exp-image-generation",
  "gemini-2.0-flash-exp",
];

interface GeminiResponse {
  candidates?: {
    content: {
      parts: {
        text?: string;
        inlineData?: { mimeType: string; data: string };
      }[];
    };
  }[];
  error?: { message: string; code: number };
}

async function callGeminiAPI(
  apiKey: string,
  model: string,
  imageBase64: string,
  imageMimeType: string,
  prompt: string
): Promise<GeminiResponse> {
  const url = `${API_BASE}/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              inlineData: {
                mimeType: imageMimeType,
                data: imageBase64,
              },
            },
            { text: prompt },
          ],
        },
      ],
      generationConfig: {
        responseModalities: ["IMAGE", "TEXT"],
      },
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const msg = errorData?.error?.message || `HTTP ${response.status}`;
    throw new Error(msg);
  }

  return response.json();
}

async function findWorkingModel(apiKey: string): Promise<string> {
  for (const model of MODELS) {
    const checkUrl = `${API_BASE}/v1beta/models/${model}?key=${apiKey}`;
    try {
      const res = await fetch(checkUrl);
      if (res.ok) return model;
    } catch {
      continue;
    }
  }
  throw new Error(
    `Aucun modèle de génération d'images disponible. Modèles testés : ${MODELS.join(", ")}. Vérifiez que votre clé API a accès à la génération d'images Gemini.`
  );
}

export async function generateCreatives(
  params: GenerationParams
): Promise<{ creatives: GeneratedCreative[]; errors: string[] }> {
  const apiKey = process.env.GOOGLE_AI_API_KEY;
  if (!apiKey) {
    throw new Error("GOOGLE_AI_API_KEY is not configured");
  }

  // Find a model that actually exists
  const model = await findWorkingModel(apiKey);
  console.log(`Using model: ${model}`);

  const creatives: GeneratedCreative[] = [];
  const errors: string[] = [];

  for (let i = 0; i < params.numberOfCreatives; i++) {
    const prompt = buildPrompt(
      params.aspectRatio,
      params.visualStyle,
      params.userInstructions,
      params.negativePrompt,
      i
    );

    try {
      const data = await callGeminiAPI(
        apiKey,
        model,
        params.imageBase64,
        params.imageMimeType,
        prompt
      );

      if (data.error) {
        errors.push(`Variante ${i + 1}: ${data.error.message}`);
        continue;
      }

      const candidates = data.candidates;
      if (!candidates || candidates.length === 0) {
        errors.push(`Variante ${i + 1}: Pas de réponse de l'API`);
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
        errors.push(`Variante ${i + 1}: L'API n'a pas retourné d'image`);
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erreur inconnue";
      errors.push(`Variante ${i + 1}: ${message}`);
    }

    // Delay between requests to respect rate limits
    if (i < params.numberOfCreatives - 1) {
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }
  }

  return { creatives, errors };
}
