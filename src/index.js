const MODEL_CACHE_TTL = 5 * 60 * 1000;
const cache = new Map();

const PROVIDER_NAMES = {
  kr: "Kiro",
  ag: "Antigravity",
  nc: "Nc",
  nvidia: "Nvidia",
  openrouter: "OpenRouter",
};

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function cleanModelName(rawName) {
  const s = rawName.replace(/[-_]/g, " ").replace(/[:;]+/g, " ");
  const words = s.split(/\s+/).filter(Boolean);
  const result = [];

  for (const w of words) {
    const wl = w.toLowerCase();
    if (wl === "gpt" || wl === "ai" || wl === "llm" || wl === "asr") {
      result.push(w.toUpperCase());
    } else if (wl === "glm" || wl === "qwen3") {
      result.push(w.toUpperCase());
    } else if (wl === "abacusai") {
      result.push("AbacusAI");
    } else if (wl.endsWith("b") && /^\d+(\.\d+)?b$/.test(wl)) {
      result.push(w.toUpperCase());
    } else {
      result.push(capitalize(w));
    }
  }

  return result.join(" ");
}

function getProviderName(id, ownedBy) {
  if (ownedBy === "combo") return "Combo";

  const parts = id.split("/");
  if (parts.length > 1) {
    return PROVIDER_NAMES[parts[0]] || capitalize(parts[0]);
  }

  return "Combo";
}

async function fetchModels(baseURL, apiKey) {
  const cacheKey = baseURL + ":" + apiKey;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() < cached.expires) return cached.models;

  try {
    const url = baseURL.replace(/\/$/, "") + "/models";
    const headers = { "Content-Type": "application/json" };
    if (apiKey) headers["Authorization"] = "Bearer " + apiKey;

    const res = await fetch(url, { headers, signal: AbortSignal.timeout(10000) });
    if (!res.ok) return null;

    const body = await res.json();
    if (!body?.data) return null;

    const models = {};
    for (const m of body.data) {
      if (typeof m.id !== "string") continue;
      const parts = m.id.split("/");
      const namePart = parts[parts.length - 1];
      const provider = getProviderName(m.id, m.owned_by || "");
      const name = cleanModelName(namePart) + " (" + provider + ")";
      models[m.id] = { name };
    }

    cache.set(cacheKey, { models, expires: Date.now() + MODEL_CACHE_TTL });
    return models;
  } catch {
    return null;
  }
}

export const ProviderModelsPlugin = async () => {
  return {
    config: async (config) => {
      const providers = config.provider || {};
      for (const id of Object.keys(providers)) {
        const p = providers[id];
        const baseURL = p.options?.baseURL;
        if (!baseURL) continue;
        if (p.models && Object.keys(p.models).length > 0) continue;

        const apiKey = p.options?.apiKey;
        const models = await fetchModels(baseURL, apiKey);
        if (models) p.models = models;
      }
    },
  };
};
