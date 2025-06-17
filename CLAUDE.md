# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.
请始终使用中文.
## Project Overview

XivStrat is a Final Fantasy XIV strategy guide website built with Astro, Vue 3, TailwindCSS, and PixiJS. It provides detailed raid guides with interactive visualizations starting from patch 7.2.

## Common Development Commands

### Development
```bash
# Install dependencies (use pnpm)
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Lint code
pnpm lint

# Fix linting errors
pnpm lint:fix

# Type check
astro check

# Minify public scripts
pnpm minify
```

## High-Level Architecture

### Technology Stack
- **Framework**: Astro (SSG) with Vue.js integration
- **Build Tool**: Vite
- **Styling**: TailwindCSS with shadcn-vue components
- **Interactive Graphics**: PixiJS for strategy boards
- **State Management**: Nanostores with persistence
- **Package Manager**: pnpm (10.12.1)

### Project Structure
```
xivstrat/
├── src/
│   ├── components/      # Reusable components (.astro/.vue)
│   │   ├── action/      # Game action components
│   │   ├── buff/        # Status effect components
│   │   ├── section/     # Page section components
│   │   └── shadcn-vue/  # UI library components
│   ├── pages/           # Astro pages (duties organized by patch)
│   │   └── 07/          # Patch 7.x duties
│   │       └── m5s/     # Each duty has index + phase pages
│   ├── assets/          # Images/resources (auto-optimized)
│   ├── data/            # JSON data files for duties
│   ├── pixi/            # PixiJS integration code
│   └── stores/          # Nanostores for state
├── public/              # Static assets (not optimized)
│   └── pixi/            # Multi-resolution assets (@2x, @3x)
└── cli/                 # Build scripts
```

### Key Architectural Patterns

1. **Duty Organization**: Each duty (raid) is organized by expansion/patch (e.g., `07/m5s`) with:
   - `index.astro`: Home page with waymarks, macros, timeline
   - `p1.astro`, `p2.astro`, etc.: Phase-specific mechanics

2. **Component Composition**: Mechanics are built from smaller components:
   - Static components use `.astro` format
   - Interactive components use `.vue` format
   - All mechanics have timestamps and descriptions

3. **Asset Management**:
   - Images in `src/assets/` are automatically optimized by Astro
   - PixiJS assets in `public/pixi/` support multiple resolutions
   - Formats: WebP, AVIF with PNG fallbacks

4. **Data Structure**: Duties defined in JSON with:
   - Metadata (name, type, status)
   - Localization (cn, jp)
   - Phase breakdowns

5. **Interactive Boards**: PixiJS integration through:
   - Manifest-based asset loading (`src/pixi/manifest.json`)
   - Custom `<StratBoard>` component
   - State stored in `$stratBoards` store

### Development Workflow

1. **Adding New Content**:
   - Define duty in `src/data/duties/`
   - Create page structure in `src/pages/`
   - Build mechanics using existing components
   - Add interactive elements with Vue components
   - Create visual boards with PixiJS

2. **Image Assets**:
   - Place optimizable images in `src/assets/`
   - Place PixiJS assets in `public/pixi/` with multiple resolutions
   - Follow 800px = 40m game scale for strategy diagrams

3. **Code Style**:
   - ESLint configuration with @antfu/eslint-config
   - Single quotes for strings
   - No semicolons
   - 1tbs brace style
   - Run `pnpm lint:fix` before committing

### Current Priorities

- Completing raid guides for patches 7.x and 8.x
- Adding home pages for each duty (waymarks, macros, cheatsheets)
- Future: MDX-based content management system
- Future: User-generated content editor

### Important Notes

- The project is primarily in Chinese with plans for i18n support
- Currently using "hand-crafted HTML" approach for content
- No backend yet, but planned for voting, comments, user accounts
- Mobile adaptation is planned but not yet implemented
- Use existing components and patterns when adding new content

## Tauri Desktop Application

The project includes Tauri configuration for building desktop applications:

### Tauri Commands
```bash
# Run in development mode
npm run tauri:dev

# Build desktop app for current platform
npm run tauri:build

# Generate app icons
npm run tauri:icon
```

### Tauri Structure
```
src-tauri/
├── src/
│   └── main.rs          # Rust application entry point
├── icons/               # Application icons
├── build.rs             # Build script
├── Cargo.toml           # Rust dependencies
└── tauri.conf.json      # Tauri configuration
```

### Building for Different Platforms
- **Windows**: Requires Windows SDK
- **macOS**: Requires Xcode Command Line Tools
- **Linux**: Requires system dependencies (libwebkit2gtk-4.0-dev, etc.)

Note: The desktop app packages the entire static site for offline use.