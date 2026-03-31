import { NextRequest, NextResponse } from "next/server";
import { generateCreatives } from "@/lib/gemini";
import type { GenerationParams, AspectRatio, VisualStyle } from "@/types";

const MAX_IMAGE_SIZE = 20 * 1024 * 1024; // 20MB
const VALID_MIME_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
];
const VALID_RATIOS: AspectRatio[] = ["1:1", "3:4", "4:3", "9:16", "16:9"];
const VALID_STYLES: VisualStyle[] = [
  "studio",
  "lifestyle",
  "premium",
  "minimal",
  "luxury",
  "ugc-static",
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      imageBase64,
      imageMimeType,
      numberOfCreatives,
      aspectRatio,
      visualStyle,
      userInstructions,
      negativePrompt,
    } = body as GenerationParams;

    // Validation
    if (!imageBase64 || !imageMimeType) {
      return NextResponse.json(
        { error: "Image produit requise" },
        { status: 400 }
      );
    }

    if (!VALID_MIME_TYPES.includes(imageMimeType)) {
      return NextResponse.json(
        { error: "Format d'image non supporté. Utilisez PNG, JPG ou WebP." },
        { status: 400 }
      );
    }

    // Check approximate base64 size
    const approximateSize = (imageBase64.length * 3) / 4;
    if (approximateSize > MAX_IMAGE_SIZE) {
      return NextResponse.json(
        { error: "Image trop volumineuse (max 20 MB)" },
        { status: 400 }
      );
    }

    if (
      !numberOfCreatives ||
      numberOfCreatives < 1 ||
      numberOfCreatives > 8
    ) {
      return NextResponse.json(
        { error: "Nombre de créas entre 1 et 8" },
        { status: 400 }
      );
    }

    if (!VALID_RATIOS.includes(aspectRatio)) {
      return NextResponse.json(
        { error: "Format d'image non valide" },
        { status: 400 }
      );
    }

    if (!VALID_STYLES.includes(visualStyle)) {
      return NextResponse.json(
        { error: "Style visuel non valide" },
        { status: 400 }
      );
    }

    if (typeof userInstructions !== "string" || typeof negativePrompt !== "string") {
      return NextResponse.json(
        { error: "Paramètres invalides" },
        { status: 400 }
      );
    }

    const { creatives, errors } = await generateCreatives({
      imageBase64,
      imageMimeType,
      numberOfCreatives,
      aspectRatio,
      visualStyle,
      userInstructions: userInstructions.slice(0, 2000),
      negativePrompt: negativePrompt.slice(0, 500),
    });

    if (creatives.length === 0 && errors.length > 0) {
      return NextResponse.json(
        { error: `Échec de la génération : ${errors.join("; ")}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      creatives,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error("Generation error:", error);
    const message =
      error instanceof Error ? error.message : "Erreur serveur interne";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
