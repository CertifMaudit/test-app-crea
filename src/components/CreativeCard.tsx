"use client";

import { useState } from "react";
import type { GeneratedCreative } from "@/types";

interface Props {
  creative: GeneratedCreative;
  isFavorite: boolean;
  onToggleFavorite: (creative: GeneratedCreative) => void;
  onImageClick: () => void;
}

export default function CreativeCard({
  creative,
  isFavorite,
  onToggleFavorite,
  onImageClick,
}: Props) {
  const [showPrompt, setShowPrompt] = useState(false);
  const [copied, setCopied] = useState(false);

  const dataUrl = `data:${creative.mimeType};base64,${creative.imageBase64}`;

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = dataUrl;
    const ext = creative.mimeType.includes("png") ? "png" : "jpg";
    link.download = `creative-${creative.variant}.${ext}`;
    link.click();
  };

  const handleCopyPrompt = async () => {
    await navigator.clipboard.writeText(creative.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="relative">
        {/* Favorite toggle */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(creative);
          }}
          className="absolute top-2 right-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 transition-colors hover:bg-white"
          aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
        >
          {isFavorite ? (
            <svg className="h-5 w-5 text-red-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
            </svg>
          ) : (
            <svg className="h-5 w-5 text-gray-400 hover:text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
          )}
        </button>

        <img
          src={dataUrl}
          alt={`Variante ${creative.variant}`}
          className="w-full cursor-pointer object-cover"
          onClick={onImageClick}
        />
        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none">
          <div className="flex w-full gap-2 p-3 pointer-events-auto">
            <button
              onClick={handleDownload}
              className="flex-1 rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-gray-800 hover:bg-gray-100"
            >
              Télécharger
            </button>
            <button
              onClick={() => setShowPrompt(!showPrompt)}
              className="rounded-lg bg-white/80 px-3 py-1.5 text-xs font-medium text-gray-800 hover:bg-white"
            >
              Prompt
            </button>
          </div>
        </div>
      </div>

      <div className="px-3 py-2">
        <span className="text-xs font-medium text-gray-500">
          Variante {creative.variant}
        </span>
      </div>

      {showPrompt && (
        <div className="border-t border-gray-100 px-3 py-2">
          <p className="mb-2 max-h-32 overflow-y-auto text-xs text-gray-600">
            {creative.prompt}
          </p>
          <button
            onClick={handleCopyPrompt}
            className="text-xs font-medium text-blue-600 hover:text-blue-800"
          >
            {copied ? "Copié !" : "Copier le prompt"}
          </button>
        </div>
      )}
    </div>
  );
}
