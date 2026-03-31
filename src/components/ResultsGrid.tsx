"use client";

import type { GeneratedCreative } from "@/types";
import CreativeCard from "./CreativeCard";

interface Props {
  creatives: GeneratedCreative[];
  isGenerating: boolean;
  numberOfCreatives: number;
  errors: string[];
  onDownloadAll: () => void;
  favoriteIds: Set<string>;
  onToggleFavorite: (creative: GeneratedCreative) => void;
  onImageClick: (index: number) => void;
}

export default function ResultsGrid({
  creatives,
  isGenerating,
  numberOfCreatives,
  errors,
  onDownloadAll,
  favoriteIds,
  onToggleFavorite,
  onImageClick,
}: Props) {
  if (isGenerating) {
    return (
      <div className="flex h-full flex-col items-center justify-center py-20">
        <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
        <p className="text-sm font-medium text-gray-600">
          Génération en cours...
        </p>
        <p className="mt-1 text-xs text-gray-400">
          {numberOfCreatives} créa{numberOfCreatives > 1 ? "s" : ""} en
          préparation
        </p>
      </div>
    );
  }

  if (creatives.length === 0 && errors.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center py-20 text-center">
        <svg
          className="mb-3 h-16 w-16 text-gray-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <p className="text-sm text-gray-500">
          Vos créas apparaîtront ici
        </p>
        <p className="mt-1 text-xs text-gray-400">
          Uploadez une image et lancez la génération
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {creatives.length > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">
            {creatives.length} créa{creatives.length > 1 ? "s" : ""} générée
            {creatives.length > 1 ? "s" : ""}
          </span>
          <button
            onClick={onDownloadAll}
            className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-200"
          >
            Tout télécharger
          </button>
        </div>
      )}

      {errors.length > 0 && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2">
          <p className="text-xs font-medium text-amber-800">
            Certaines variantes n&apos;ont pas pu être générées :
          </p>
          {errors.map((err, i) => (
            <p key={i} className="text-xs text-amber-700">
              {err}
            </p>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {creatives.map((creative, index) => (
          <CreativeCard
            key={creative.id}
            creative={creative}
            isFavorite={favoriteIds.has(creative.id)}
            onToggleFavorite={onToggleFavorite}
            onImageClick={() => onImageClick(index)}
          />
        ))}
      </div>
    </div>
  );
}
