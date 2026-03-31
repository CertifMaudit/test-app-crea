"use client";

import { ASPECT_RATIOS, VISUAL_STYLES } from "@/types";
import type { AspectRatio, VisualStyle } from "@/types";

interface Props {
  numberOfCreatives: number;
  onNumberChange: (n: number) => void;
  aspectRatio: AspectRatio;
  onAspectRatioChange: (r: AspectRatio) => void;
  visualStyle: VisualStyle;
  onVisualStyleChange: (s: VisualStyle) => void;
  userInstructions: string;
  onUserInstructionsChange: (s: string) => void;
  negativePrompt: string;
  onNegativePromptChange: (s: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  hasImage: boolean;
}

export default function GenerationParams({
  numberOfCreatives,
  onNumberChange,
  aspectRatio,
  onAspectRatioChange,
  visualStyle,
  onVisualStyleChange,
  userInstructions,
  onUserInstructionsChange,
  negativePrompt,
  onNegativePromptChange,
  onGenerate,
  isGenerating,
  hasImage,
}: Props) {
  return (
    <div className="space-y-5">
      {/* Number of creatives */}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Nombre de créas : {numberOfCreatives}
        </label>
        <input
          type="range"
          min={1}
          max={8}
          value={numberOfCreatives}
          onChange={(e) => onNumberChange(Number(e.target.value))}
          className="w-full accent-blue-600"
        />
        <div className="flex justify-between text-xs text-gray-400">
          <span>1</span>
          <span>8</span>
        </div>
      </div>

      {/* Aspect ratio */}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Format
        </label>
        <div className="grid grid-cols-3 gap-2">
          {ASPECT_RATIOS.map((r) => (
            <button
              key={r.value}
              onClick={() => onAspectRatioChange(r.value)}
              className={`rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                aspectRatio === r.value
                  ? "border-blue-600 bg-blue-50 text-blue-700"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Visual style */}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Style visuel
        </label>
        <div className="grid grid-cols-2 gap-2">
          {VISUAL_STYLES.map((s) => (
            <button
              key={s.value}
              onClick={() => onVisualStyleChange(s.value)}
              className={`rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                visualStyle === s.value
                  ? "border-blue-600 bg-blue-50 text-blue-700"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* User instructions */}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Instructions / précisions{" "}
          <span className="text-gray-400">(optionnel)</span>
        </label>
        <textarea
          value={userInstructions}
          onChange={(e) => onUserInstructionsChange(e.target.value)}
          placeholder="Ex: fond blanc, ambiance été, mise en scène cuisine..."
          rows={3}
          maxLength={2000}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* Negative prompt */}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Negative prompt{" "}
          <span className="text-gray-400">(optionnel)</span>
        </label>
        <textarea
          value={negativePrompt}
          onChange={(e) => onNegativePromptChange(e.target.value)}
          placeholder="Ex: texte, logo, mains..."
          rows={2}
          maxLength={500}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* Generate button */}
      <button
        onClick={onGenerate}
        disabled={isGenerating || !hasImage}
        className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
      >
        {isGenerating ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="h-4 w-4 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                className="opacity-25"
              />
              <path
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                className="opacity-75"
              />
            </svg>
            Génération en cours...
          </span>
        ) : (
          "Générer les créas"
        )}
      </button>

      {!hasImage && !isGenerating && (
        <p className="text-center text-xs text-gray-400">
          Importez une image produit pour commencer
        </p>
      )}
    </div>
  );
}
