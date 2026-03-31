import type { AspectRatio, VisualStyle } from "@/types";

const STYLE_DESCRIPTIONS: Record<VisualStyle, string> = {
  studio:
    "professional studio photography setup with clean backdrop, perfect lighting, sharp product focus, commercial quality",
  lifestyle:
    "lifestyle context showing the product in real-life use, warm and inviting atmosphere, relatable scene, natural setting",
  premium:
    "high-end luxury aesthetic, elegant composition, rich colors, sophisticated lighting, premium brand feel",
  minimal:
    "minimalist design, clean white or neutral background, ample negative space, modern and sleek presentation",
  luxury:
    "opulent luxury setting, gold accents, marble surfaces, dramatic lighting, exclusive and aspirational mood",
  "ugc-static":
    "user-generated content aesthetic, authentic and natural look, casual styling, relatable and trustworthy feel, slightly imperfect but appealing",
};

const RATIO_DESCRIPTIONS: Record<AspectRatio, string> = {
  "1:1": "square format (1:1 ratio), centered product composition",
  "3:4": "portrait format (3:4 ratio), vertical composition with product prominence",
  "4:3": "landscape format (4:3 ratio), horizontal composition with context",
  "9:16": "tall vertical story format (9:16 ratio), full-height vertical composition",
  "16:9": "wide banner format (16:9 ratio), panoramic horizontal composition",
};

const DEFAULT_NEGATIVE =
  "blurry, out of focus, illegible text, watermark, logo overlay, artifacts, deformed hands, duplicate elements, distorted product, cluttered composition, low quality, pixelated, oversaturated, underexposed, overexposed, amateur";

export function buildPrompt(
  aspectRatio: AspectRatio,
  visualStyle: VisualStyle,
  userInstructions: string,
  negativePrompt: string,
  variant: number
): string {
  const styleDesc = STYLE_DESCRIPTIONS[visualStyle];
  const ratioDesc = RATIO_DESCRIPTIONS[aspectRatio];
  const fullNegative = negativePrompt
    ? `${DEFAULT_NEGATIVE}, ${negativePrompt}`
    : DEFAULT_NEGATIVE;

  const variantSeed = [
    "with a slightly different angle and lighting",
    "with an alternative color palette and composition",
    "with a different background scene and mood",
    "with varied props and styling elements",
    "with a fresh creative direction and framing",
    "with an alternative perspective and atmosphere",
  ];

  const variantHint = variantSeed[variant % variantSeed.length];

  let prompt = `Create a high-quality static advertising creative for an e-commerce product. Use the provided product image as the primary visual reference.

STYLE: ${styleDesc}
FORMAT: ${ratioDesc}
VARIANT: ${variantHint}

REQUIREMENTS:
- The product must be the clear focal point of the image
- Professional advertising quality suitable for paid social media ads
- Clean, visually appealing composition optimized for conversion
- Cohesive background and scene that enhances the product
- Modern, polished look that builds trust and desire
- No text overlays, no logos, just the visual creative`;

  if (userInstructions.trim()) {
    prompt += `\n\nADDITIONAL INSTRUCTIONS: ${userInstructions.trim()}`;
  }

  prompt += `\n\nAVOID: ${fullNegative}`;

  return prompt;
}
