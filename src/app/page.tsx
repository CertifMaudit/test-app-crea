"use client";

import { useCallback, useEffect, useState } from "react";
import ImageUploader from "@/components/ImageUploader";
import GenerationParams from "@/components/GenerationParams";
import ResultsGrid from "@/components/ResultsGrid";
import FullscreenViewer from "@/components/FullscreenViewer";
import { loadHistory, saveHistory, loadFavorites, saveFavorites } from "@/lib/storage";
import type {
  AspectRatio,
  VisualStyle,
  GeneratedCreative,
  HistoryEntry,
} from "@/types";

export default function Home() {
  // Image state
  const [imageBase64, setImageBase64] = useState("");
  const [imageMimeType, setImageMimeType] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Params state
  const [numberOfCreatives, setNumberOfCreatives] = useState(4);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("1:1");
  const [visualStyle, setVisualStyle] = useState<VisualStyle>("studio");
  const [userInstructions, setUserInstructions] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");

  // Results state
  const [creatives, setCreatives] = useState<GeneratedCreative[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  // History (persisted)
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Favorites (persisted)
  const [favorites, setFavorites] = useState<GeneratedCreative[]>([]);
  const [showFavorites, setShowFavorites] = useState(false);

  // Fullscreen viewer
  const [fullscreenIndex, setFullscreenIndex] = useState<number | null>(null);
  const [fullscreenList, setFullscreenList] = useState<GeneratedCreative[]>([]);

  // Load persisted data on mount
  useEffect(() => {
    setHistory(loadHistory());
    setFavorites(loadFavorites());
  }, []);

  // Persist history
  useEffect(() => {
    if (history.length > 0) saveHistory(history);
  }, [history]);

  // Persist favorites
  useEffect(() => {
    saveFavorites(favorites);
  }, [favorites]);

  const favoriteIds = new Set(favorites.map((f) => f.id));

  const handleToggleFavorite = useCallback(
    (creative: GeneratedCreative) => {
      setFavorites((prev) => {
        const exists = prev.some((f) => f.id === creative.id);
        if (exists) {
          return prev.filter((f) => f.id !== creative.id);
        }
        return [...prev, creative];
      });
    },
    []
  );

  const handleImageClick = useCallback(
    (index: number, list: GeneratedCreative[]) => {
      setFullscreenList(list);
      setFullscreenIndex(index);
    },
    []
  );

  const handleImageSelected = useCallback((base64: string, mimeType: string) => {
    if (!base64) {
      setImageBase64("");
      setImageMimeType("");
      setImagePreview(null);
      return;
    }
    setImageBase64(base64);
    setImageMimeType(mimeType);
    setImagePreview(`data:${mimeType};base64,${base64}`);
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!imageBase64 || isGenerating) return;

    setIsGenerating(true);
    setGlobalError(null);
    setErrors([]);
    setCreatives([]);
    setShowFavorites(false);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64,
          imageMimeType,
          numberOfCreatives,
          aspectRatio,
          visualStyle,
          userInstructions,
          negativePrompt,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setGlobalError(data.error || "Erreur lors de la génération");
        return;
      }

      setCreatives(data.creatives || []);
      setErrors(data.errors || []);

      if (data.creatives?.length > 0) {
        setHistory((prev) => [
          { creatives: data.creatives, timestamp: Date.now() },
          ...prev,
        ]);
      }
    } catch {
      setGlobalError(
        "Impossible de contacter le serveur. Vérifiez que l'application est bien lancée."
      );
    } finally {
      setIsGenerating(false);
    }
  }, [
    imageBase64,
    imageMimeType,
    numberOfCreatives,
    aspectRatio,
    visualStyle,
    userInstructions,
    negativePrompt,
    isGenerating,
  ]);

  const handleDownloadAll = useCallback((list: GeneratedCreative[]) => {
    list.forEach((c, i) => {
      setTimeout(() => {
        const link = document.createElement("a");
        link.href = `data:${c.mimeType};base64,${c.imageBase64}`;
        const ext = c.mimeType.includes("png") ? "png" : "jpg";
        link.download = `creative-${c.variant}.${ext}`;
        link.click();
      }, i * 200);
    });
  }, []);

  const loadHistoryEntry = useCallback((entry: HistoryEntry) => {
    setCreatives(entry.creatives);
    setErrors([]);
    setShowHistory(false);
    setShowFavorites(false);
  }, []);

  const displayedCreatives = showFavorites ? favorites : creatives;

  return (
    <div className="mx-auto min-h-screen max-w-7xl px-4 py-6">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Ad Creative Generator
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Importez une image produit et générez des créas publicitaires
          prêtes pour vos campagnes
        </p>
      </header>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Left column: upload + params */}
        <aside className="w-full space-y-6 lg:w-80 lg:shrink-0">
          <ImageUploader
            onImageSelected={handleImageSelected}
            currentPreview={imagePreview}
          />

          <hr className="border-gray-200" />

          <GenerationParams
            numberOfCreatives={numberOfCreatives}
            onNumberChange={setNumberOfCreatives}
            aspectRatio={aspectRatio}
            onAspectRatioChange={setAspectRatio}
            visualStyle={visualStyle}
            onVisualStyleChange={setVisualStyle}
            userInstructions={userInstructions}
            onUserInstructionsChange={setUserInstructions}
            negativePrompt={negativePrompt}
            onNegativePromptChange={setNegativePrompt}
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
            hasImage={!!imageBase64}
          />

          {/* Regenerate */}
          {creatives.length > 0 && !isGenerating && (
            <button
              onClick={handleGenerate}
              className="w-full rounded-xl border border-blue-600 px-4 py-2.5 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50"
            >
              Regénérer
            </button>
          )}

          {/* Favorites toggle */}
          {favorites.length > 0 && (
            <button
              onClick={() => setShowFavorites(!showFavorites)}
              className={`w-full rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors ${
                showFavorites
                  ? "border-red-400 bg-red-50 text-red-600"
                  : "border-gray-300 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {showFavorites ? "Retour aux résultats" : `Favoris (${favorites.length})`}
            </button>
          )}

          {/* History toggle */}
          {history.length > 0 && (
            <div>
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="text-xs font-medium text-gray-500 hover:text-gray-700"
              >
                {showHistory ? "Masquer" : "Afficher"} l&apos;historique (
                {history.length})
              </button>
              {showHistory && (
                <div className="mt-2 max-h-40 space-y-1 overflow-y-auto">
                  {history.map((entry, i) => (
                    <button
                      key={entry.timestamp}
                      onClick={() => loadHistoryEntry(entry)}
                      className="block w-full rounded-lg bg-gray-100 px-3 py-2 text-left text-xs text-gray-600 hover:bg-gray-200"
                    >
                      Session {history.length - i} —{" "}
                      {entry.creatives.length} créa
                      {entry.creatives.length > 1 ? "s" : ""} —{" "}
                      {new Date(entry.timestamp).toLocaleTimeString("fr-FR")}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </aside>

        {/* Right column: results */}
        <main className="min-h-[400px] flex-1">
          {showFavorites && favorites.length > 0 && (
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">Favoris</h2>
              <button
                onClick={() => handleDownloadAll(favorites)}
                className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-200"
              >
                Tout télécharger
              </button>
            </div>
          )}

          {globalError && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-sm font-medium text-red-800">
                {globalError}
              </p>
            </div>
          )}

          <ResultsGrid
            creatives={displayedCreatives}
            isGenerating={isGenerating}
            numberOfCreatives={numberOfCreatives}
            errors={showFavorites ? [] : errors}
            onDownloadAll={() => handleDownloadAll(displayedCreatives)}
            favoriteIds={favoriteIds}
            onToggleFavorite={handleToggleFavorite}
            onImageClick={(index) => handleImageClick(index, displayedCreatives)}
          />
        </main>
      </div>

      {/* Fullscreen viewer */}
      {fullscreenIndex !== null && (
        <FullscreenViewer
          creatives={fullscreenList}
          currentIndex={fullscreenIndex}
          onClose={() => setFullscreenIndex(null)}
          onNavigate={setFullscreenIndex}
        />
      )}
    </div>
  );
}
