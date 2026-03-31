import { NextResponse } from "next/server";

const API_BASE = "https://generativelanguage.googleapis.com";

export async function GET() {
  const apiKey = process.env.GOOGLE_AI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "No API key" }, { status: 500 });
  }

  try {
    // List all available models
    const res = await fetch(
      `${API_BASE}/v1beta/models?key=${apiKey}&pageSize=100`
    );

    if (!res.ok) {
      const err = await res.json().catch(() => null);
      return NextResponse.json(
        { error: `API error: ${res.status}`, details: err },
        { status: res.status }
      );
    }

    const data = await res.json();
    const models = (data.models || []).map(
      (m: { name: string; displayName: string; supportedGenerationMethods: string[] }) => ({
        name: m.name,
        displayName: m.displayName,
        methods: m.supportedGenerationMethods,
      })
    );

    // Filter for models that might support image generation
    const imageModels = models.filter(
      (m: { name: string; methods: string[] }) =>
        m.name.includes("image") ||
        m.name.includes("imagen") ||
        m.name.includes("flash")
    );

    return NextResponse.json({
      totalModels: models.length,
      imageRelatedModels: imageModels,
      allModels: models,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
