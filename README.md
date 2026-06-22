# OpenCode Provider Models

Auto-discover models for any OpenAI-compatible provider in OpenCode.

Stop manually listing models in `opencode.jsonc`. This plugin fetches all available models from `GET /v1/models` automatically.

## How It Works

Instead of this (manual, 20+ lines):

```json
{
  "9router": {
    "npm": "@ai-sdk/openai-compatible",
    "options": { "baseURL": "http://localhost:20128/v1" },
    "models": {
      "kr/claude-sonnet-4.5": { "name": "Claude Sonnet 4.5" },
      "kr/deepseek-3.2": { "name": "DeepSeek 3.2" }
    }
  }
}
```

Just this (3 lines, auto-discovered):

```json
{
  "9router": {
    "npm": "@ai-sdk/openai-compatible",
    "options": { "baseURL": "http://localhost:20128/v1" }
  }
}
```

The plugin fetches `GET /v1/models` and returns all models automatically.

## Installation

```bash
git clone https://github.com/nurhambali/opencode-provider-models \
  ~/.config/opencode/skills/opencode-provider-models
```

## Usage

Add any OpenAI-compatible provider to your `opencode.jsonc`:

```json
{
  "provider": {
    "my-provider": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "My Provider",
      "options": {
        "baseURL": "http://localhost:20128/v1"
      }
    }
  }
}
```

That's it. Models are auto-discovered from `GET /v1/models`.

```json
{
  "provider": {
    "9router": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "9Router",
      "options": {
        "baseURL": "http://localhost:20128/v1"
      }
    }
  }
}
```

## How It Works

1. OpenCode calls the plugin's `provider.models()` hook
2. Plugin fetches `GET {baseURL}/models`
3. Response is parsed and mapped to OpenCode's `Model` format
4. Results are cached for 5 minutes to avoid excessive requests

## Features

- Zero configuration — just add your provider
- Works with any OpenAI-compatible API
- Auto-detects all models from `GET /v1/models`
- Clean model names with provider suffix (e.g. `Claude Sonnet 4.5 (Kiro)`)
- 5-minute cache to reduce API calls
- Silent failure — never blocks provider loading

## Development

```bash
git clone https://github.com/nurhambali/opencode-provider-models
cd opencode-provider-models
# Edit src/index.js
```

## License

MIT
