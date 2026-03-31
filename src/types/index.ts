export type AspectRatio = "1:1" | "3:4" | "4:3" | "9:16" | "16:9";

export type VisualStyle =
  | "studio"
  | "lifestyle"
  | "premium"
  | "minimal"
  | "luxury"
  | "ugc-static";

export const ASPECT_RATIOS: { value: AspectRatio; label: string }[] = [
  { value: "1:1", label: "1:1 — Carré" },
  { value: "3:4", label: "3:4 — Portrait" },
  { value: "4:3", label: "4:3 — Paysage" },
  { value: "9:16", label: "9:16 — Story / Reel" },
  { value: "16:9", label: "16:9 — Banner" },
];

export const VISUAL_STYLES: { value: VisualStyle; label: string }[] = [
  { value: "studio", label: "Studio" },
  { value: "lifestyle", label: "Lifestyle" },
  { value: "premium", label: "Premium" },
  { value: "minimal", label: "Minimal" },
  { value: "luxury", label: "Luxury" },
  { value: "ugc-static", label: "UGC-like Static" },
];

export interface GenerationParams {
  imageBase64: string;
  imageMimeType: string;
  numberOfCreatives: number;
  aspectRatio: AspectRatio;
  visualStyle: VisualStyle;
  userInstructions: string;
  negativePrompt: string;
}

export interface GeneratedCreative {
  id: string;
  imageBase64: string;
  mimeType: string;
  prompt: string;
  variant: number;
}

export interface GenerationResult {
  creatives: GeneratedCreative[];
  error?: string;
}
