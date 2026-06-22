# opencode-provider-models

Auto-discover models for any OpenAI-compatible provider in OpenCode.

```
gratis          → Gratis (Combo)
kr/auto         → Auto (Kiro)
kr/claude-sonnet-4.5 → Claude Sonnet 4.5 (Kiro)
ag/gemini-3-flash → Gemini 3 Flash (Antigravity)
```

## How it works

1. You add a provider to `opencode.json` — just name + npm + URL
2. Plugin's `config` hook reads API key from auth store (`/connect`)
3. Fetches `GET /v1/models` and injects all models into the provider
4. Each model gets a clean display name with provider suffix

## Installation

Copy `src/index.js` to your plugins directory:

```bash
mkdir -p ~/.config/opencode/plugins
curl -o ~/.config/opencode/plugins/provider-models.js \
  https://raw.githubusercontent.com/nurhambali/opencode-provider-models/main/src/index.js
```

Or clone the repo:

```bash
git clone https://github.com/nurhambali/opencode-provider-models \
  ~/.config/opencode/plugins/opencode-provider-models
# then copy or symlink provider-models.js into ~/.config/opencode/plugins/
```

## Usage

Add any OpenAI-compatible provider — no models needed:

```json
{
  "provider": {
    "9router": {
      "npm": "@ai-sdk/openai-compatible",
      "options": {
        "baseURL": "http://localhost:20128/v1"
      }
    }
  }
}
```

API key is auto-read from OpenCode's auth store. Set it via `/connect` or `options.apiKey`.

With API key in config:

```json
{
  "provider": {
    "my-ai": {
      "npm": "@ai-sdk/openai-compatible",
      "options": {
        "baseURL": "http://localhost:20128/v1",
        "apiKey": "sk-..."
      }
    }
  }
}
```

Restart OpenCode — all models appear automatically.

## Features

- No manual model listing — just add the provider
- Works with any OpenAI-compatible API
- Auto-reads API key from auth store (supports `/connect`)
- Clean names: `Gratis (Combo)`, `Claude Sonnet 4.5 (Kiro)`
- 5-minute cache, silent on failure

## Requirements

- OpenCode
- An OpenAI-compatible provider with `GET /v1/models`

## License

MIT
