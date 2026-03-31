"use client";

import { useCallback, useEffect } from "react";
import type { GeneratedCreative } from "@/types";

interface Props {
  creatives: GeneratedCreative[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export default function FullscreenViewer({
  creatives,
  currentIndex,
  onClose,
  onNavigate,
}: Props) {
  const creative = creatives[currentIndex];
  if (!creative) return null;

  const dataUrl = `data:${creative.mimeType};base64,${creative.imageBase64}`;
  const hasMultiple = creatives.length > 1;

  const goNext = useCallback(() => {
    if (currentIndex < creatives.length - 1) onNavigate(currentIndex + 1);
  }, [currentIndex, creatives.length, onNavigate]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) onNavigate(currentIndex - 1);
  }, [currentIndex, onNavigate]);

  const handleDownload = useCallback(() => {
    const link = document.createElement("a");
    link.href = dataUrl;
    const ext = creative.mimeType.includes("png") ? "png" : "jpg";
    link.download = `creative-${creative.variant}.${ext}`;
    link.click();
  }, [dataUrl, creative]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    document.addEventListener("keydown", handleKey);
    // Prevent body scroll
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose, goNext, goPrev]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
        aria-label="Fermer"
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Download button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleDownload();
        }}
        className="absolute top-4 right-16 z-10 flex h-10 items-center gap-2 rounded-full bg-white/10 px-4 text-sm text-white transition-colors hover:bg-white/20"
        aria-label="Télécharger"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V3" />
        </svg>
        Télécharger
      </button>

      {/* Counter */}
      {hasMultiple && (
        <span className="absolute top-4 left-4 z-10 rounded-full bg-white/10 px-3 py-1 text-sm text-white">
          {currentIndex + 1} / {creatives.length}
        </span>
      )}

      {/* Previous */}
      {hasMultiple && currentIndex > 0 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            goPrev();
          }}
          className="absolute left-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          aria-label="Précédent"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* Next */}
      {hasMultiple && currentIndex < creatives.length - 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            goNext();
          }}
          className="absolute right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          aria-label="Suivant"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Image */}
      <img
        src={dataUrl}
        alt={`Variante ${creative.variant}`}
        className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}
