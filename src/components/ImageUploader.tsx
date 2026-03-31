"use client";

import { useCallback, useRef, useState } from "react";

const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
const MAX_SIZE = 20 * 1024 * 1024;

interface Props {
  onImageSelected: (base64: string, mimeType: string) => void;
  currentPreview: string | null;
}

export default function ImageUploader({ onImageSelected, currentPreview }: Props) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(
    (file: File) => {
      setError(null);

      if (!ACCEPTED_TYPES.includes(file.type)) {
        setError("Format non supporté. Utilisez PNG, JPG ou WebP.");
        return;
      }

      if (file.size > MAX_SIZE) {
        setError("Image trop volumineuse (max 20 MB).");
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // result is "data:<mime>;base64,<data>"
        const base64 = result.split(",")[1];
        onImageSelected(base64, file.type);
      };
      reader.onerror = () => setError("Erreur de lecture du fichier.");
      reader.readAsDataURL(file);
    },
    [onImageSelected]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-gray-700">
        Image produit
      </label>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 transition-colors ${
          dragActive
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50"
        }`}
      >
        {currentPreview ? (
          <img
            src={currentPreview}
            alt="Produit uploadé"
            className="max-h-48 rounded-lg object-contain"
          />
        ) : (
          <>
            <svg
              className="mb-2 h-10 w-10 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 16v-8m0 0-3 3m3-3 3 3M4.5 20.25h15A2.25 2.25 0 0021.75 18V6a2.25 2.25 0 00-2.25-2.25h-15A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25z"
              />
            </svg>
            <p className="text-sm text-gray-500">
              Glissez une image ou{" "}
              <span className="font-medium text-blue-600">parcourez</span>
            </p>
            <p className="mt-1 text-xs text-gray-400">
              PNG, JPG, WebP — max 20 MB
            </p>
          </>
        )}

        <input
          ref={inputRef}
          type="file"
          accept=".png,.jpg,.jpeg,.webp"
          onChange={handleChange}
          className="hidden"
        />
      </div>

      {currentPreview && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onImageSelected("", "");
            if (inputRef.current) inputRef.current.value = "";
          }}
          className="text-xs text-red-500 hover:text-red-700"
        >
          Supprimer l&apos;image
        </button>
      )}

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
