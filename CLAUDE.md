# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Presenton** is an open-source AI presentation generator featuring:
- Electron desktop app (Windows, macOS, Linux)
- Multi-provider LLM support (OpenAI, Google Gemini, Anthropic, Ollama, custom compatible)
- Flexible image generation (DALL-E 3, Gemini Flash, Pexels, Pixabay, ComfyUI)
- PPTX/PDF export with custom templates and themes
- Built-in MCP server for remote presentation generation
- Docker deployment option

## Architecture

### Three-Process Model (Electron)

The Electron app orchestrates three separate processes:

1. **Electron Main Process** (`electron/app/main.ts`)
   - Manages window lifecycle and OS integration
   - Spawns and manages FastAPI server (Python)
   - Spawns and manages Next.js server (Node.js)
   - Coordinates IPC handlers for process communication
   - Environment: Node.js (TypeScript compiled to JS)

2. **FastAPI Backend** (`electron/servers/fastapi/`)
   - REST API handling presentation generation, templates, file uploads
   - LLM/image provider integration and abstraction
   - PDF/PPTX export logic (using Puppeteer, Sharp, python-pptx)
   - Multi-provider architecture (agents for each LLM/image provider)
   - Environment: Python 3.11+, bundled as PyInstaller binary in production

3. **Next.js Frontend** (`electron/servers/nextjs/`)
   - React-based UI for presentation generation workflow
   - Built as static export (`output: "export"` in next.config.mjs)
   - Can run in development (SSR) or production (static)
   - Communicates with FastAPI via HTTP
   - Environment: Node.js with React/TypeScript

### Directory Structure

```
electron/
├── app/                    # Electron main process (TypeScript)
│   ├── main.ts            # Entry point, process orchestration
│   ├── ipc/               # IPC handlers (templates, config, uploads, etc.)
│   ├── preloads/          # Electron preload scripts for security
│   ├── utils/             # Utilities (servers, constants, dialog, config)
│   └── types/             # TypeScript type definitions
├── servers/
│   ├── fastapi/           # Python FastAPI backend
│   │   ├── api/           # FastAPI routes and logic
│   │   ├── agents/        # LLM/image provider integrations
│   │   ├── enums/         # Provider types, tone, verbosity, etc.
│   │   ├── constants/     # Configuration constants
│   │   ├── server.py      # Entry point
│   │   └── requirements.txt # Python dependencies
│   └── nextjs/            # React Next.js frontend
│       ├── app/           # Next.js app router pages
│       ├── components/    # React components
│       ├── lib/           # Utilities and hooks
│       └── package.json   # Dependencies
├── resources/
│   ├── ui/                # Static UI files (homepage, styles)
│   ├── nextjs/            # Built Next.js static output (generated)
│   └── fastapi/           # PyInstaller build output (generated)
├── build/                 # Electron builder assets
├── tsconfig.json          # TypeScript config for main process
└── package.json           # Electron app dependencies
```

## Development Workflow

### Initial Setup

```bash
cd electron
npm run setup:env
```

This command:
1. Installs Node dependencies (`npm install`)
2. Runs `uv sync` in FastAPI server (Python dependency management)
3. Installs Next.js dependencies

**Prerequisites**: Node.js (LTS), npm, Python 3.11+, [uv](https://docs.astral.sh/uv/)

### Running Development Server

```bash
cd electron
npm run dev
```

This:
1. Compiles TypeScript (`tsc`)
2. Launches Electron
3. Electron starts FastAPI and Next.js servers automatically
4. Opens window at localhost:{port} with hot-reload capabilities

**Ports are automatically allocated** via `findUnusedPorts()` to avoid conflicts.

### Building for Distribution

```bash
cd electron
npm run build:all   # Full pipeline
npm run dist        # Package with electron-builder
```

This creates:
- **macOS**: `.dmg` in `electron/dist/`
- **Linux**: `.AppImage` in `electron/dist/`
- **Windows**: NSIS installer + APPX package in `electron/dist/`

### Individual Build Commands

| Command | Purpose |
|---------|---------|
| `npm run build:ts` | Compile TypeScript to app_dist/ |
| `npm run build:css` | Build Tailwind CSS (watch mode) |
| `npm run build:nextjs` | Build Next.js static export |
| `npm run build:fastapi` | Build Python binary with PyInstaller |
| `npm run build:electron` | Package Electron app with electron-builder |
| `npm run clean:build` | Remove all build artifacts |

## Key Implementation Patterns

### Environment Configuration

**Environment variables** are the primary configuration mechanism:

```javascript
// electron/app/main.ts - Environment setup
const envVars = {
  // LLM Configuration
  LLM: "openai|google|anthropic|ollama|custom",
  OPENAI_API_KEY, OPENAI_MODEL,
  GOOGLE_API_KEY, GOOGLE_MODEL,
  ANTHROPIC_API_KEY, ANTHROPIC_MODEL,
  OLLAMA_URL, OLLAMA_MODEL,
  CUSTOM_LLM_URL, CUSTOM_LLM_API_KEY, CUSTOM_MODEL,

  // Image Generation
  IMAGE_PROVIDER: "dall-e-3|gpt-image-1.5|gemini_flash|pexels|pixabay|comfyui",
  PEXELS_API_KEY, PIXABAY_API_KEY, COMFYUI_URL, COMFYUI_WORKFLOW,

  // UI/UX Control
  CAN_CHANGE_KEYS: true|false,  // Lock API keys in UI
  DISABLE_IMAGE_GENERATION: true|false,
  WEB_GROUNDING: true|false,    // Enable web search

  // Directories (set automatically)
  APP_DATA_DIRECTORY, TEMP_DIRECTORY, USER_CONFIG_PATH,
};
```

These are passed to:
1. **FastAPI server** via environment variables
2. **User config file** for UI retrieval (`electron/app/utils/index.ts setUserConfig()`)
3. **Next.js** via `NEXT_PUBLIC_*` variables

### IPC Handler Pattern

IPC handlers in `electron/app/ipc/` follow a standardized pattern:

```typescript
// electron/app/ipc/example_handlers.ts
import { ipcMain } from "electron";

export function setupExampleHandlers() {
  ipcMain.handle("example:action", async (event, payload) => {
    // Handle request
    return { result: "success" };
  });
}
```

Handlers are registered in `electron/app/ipc/index.ts` and called from Next.js frontend via:

```typescript
// In Next.js components
await window.electron.invoke("example:action", payload);
```

### API Structure

FastAPI routes typically follow:

```
POST /api/v1/ppt/presentation/generate
  - Request: PresentationGenerationRequest (prompt, slides_markdown, template, etc.)
  - Response: { presentation_id, path, edit_path }

POST /api/v1/ppt/files/upload
  - Uploads documents/images for presentation context

GET /api/v1/templates
  - List available presentation templates
```

See `electron/servers/fastapi/api/` for route implementations.

## Common Development Tasks

### Adding a New LLM Provider

1. Create agent in `electron/servers/fastapi/agents/{provider_name}.py`
   - Inherit from base provider class
   - Implement `generate()` and `generate_with_schema()` methods
2. Add enum to `electron/servers/fastapi/enums/llm_provider.py`
3. Update constants in `electron/servers/fastapi/constants/llm.py`
4. Add initialization in FastAPI main (`electron/servers/fastapi/api/main.py`)
5. Update environment variable documentation in README.md

### Adding an Image Provider

1. Create agent in `electron/servers/fastapi/agents/image_providers/{provider_name}.py`
2. Add to `electron/servers/fastapi/enums/image_provider.py`
3. Register in FastAPI main with initialization logic
4. Update README.md configuration section

### Modifying UI Components

1. Edit components in `electron/servers/nextjs/components/`
2. Styles use Tailwind CSS (no need to rebuild separately during dev)
3. Next.js hot-reload applies changes automatically
4. For TypeScript issues, restart development server

### Working with Templates

- Custom templates are HTML/CSS-based (Tailwind)
- Located in `electron/servers/nextjs/app/presentation-templates/`
- Stored in database after user creation
- Presentation slides are generated as HTML then converted to PDF/PPTX

## Debug and Testing

### Logging

Electron main process logs appear in console:
```bash
npm run dev  # Logs printed to terminal
```

FastAPI logs appear in the same terminal output when running in development mode.

Next.js logs also appear in the terminal.

### Environment Variable Overrides

During development, you can override environment variables:

```bash
cd electron
LLM=openai OPENAI_API_KEY=sk-... npm run dev
```

### Hot Reload Behavior

- **TypeScript changes** (main.ts, ipc handlers): Require full restart (`npm run dev` again)
- **Next.js changes** (components, pages, styles): Hot reload (just refresh browser)
- **FastAPI changes**: Auto-reload enabled in development mode (see `server.py` reload flag)

## Build Configuration Notes

### Electron Builder

Configuration in `electron/build.js`:
- **macOS**: DMG distribution, sets execute permissions on FastAPI binary
- **Windows**: NSIS installer (per-user, no admin required) + APPX for Store
- **Linux**: AppImage
- **Resources**: Bundles `resources/nextjs/` (Next.js output) and `resources/fastapi/` (PyInstaller binary)

### PyInstaller Hook

`electron/servers/fastapi/runtime_hook_docling.py` - Workaround for docling library bundling with PyInstaller. Do not remove.

### Type Safety

- Main process uses TypeScript (`tsconfig.json` strict mode)
- Generated JavaScript goes to `app_dist/`
- Preload scripts also TypeScript (compiled to `app_dist/preloads/`)

## Important Constraints and Known Issues

### Known Electron Issue (Resolved)

Previous Electron 40.6.1 issue: ELECTRON_RUN_AS_NODE environment variable caused module patching failure. If this recurs:
- Ensure start script doesn't have ELECTRON_RUN_AS_NODE=1
- Check `npm run dev` in package.json doesn't set this variable

### Module Resolution

Electron requires module names match exactly:
- `require("electron")` must return Electron API object
- Preload scripts must have correct `nodeIntegration: false, contextIsolation: true` settings (for security)

### Port Management

Ports are allocated dynamically to avoid conflicts. This is intentional for multi-user systems.

## Docker Alternative

For deployment or avoiding Node/Python setup locally:

```bash
docker run -it --name presenton \
  -p 5000:80 \
  -e LLM=openai \
  -e OPENAI_API_KEY=sk-... \
  -v "./app_data:/app_data" \
  ghcr.io/presenton/presenton:latest
```

Docker Compose and deployment docs: See README.md deployment section.

## API Documentation

Full API documentation: https://docs.presenton.ai/using-presenton-api

Key endpoint: `POST /api/v1/ppt/presentation/generate`

## Community and Support

- GitHub: https://github.com/presenton/presenton
- Discord: https://discord.gg/9ZsKKxudNE
- Docs: https://docs.presenton.ai
- License: Apache 2.0
