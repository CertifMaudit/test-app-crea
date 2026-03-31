"use client";

import { useState } from "react";
import type { GeneratedCreative } from "@/types";

interface Props {
  creative: GeneratedCreative;
}

export default function CreativeCard({ creative }: Props) {
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
        <img
          src={dataUrl}
          alt={`Variante ${creative.variant}`}
          className="w-full object-cover"
        />
        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100">
          <div className="flex w-full gap-2 p-3">
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
