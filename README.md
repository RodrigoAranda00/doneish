# TaskOrganizer

A minimalist to-do / lists / notes app for Android, built with Expo and React Native. TaskOrganizer strips away the noise and mental load that comes with complicated productivity apps — no accounts, no cloud sync, no clutter — with a specific focus on being usable by people with ADHD.

This is a personal portfolio project, built incrementally, feature by feature.

## Features

- **Lists** — general-purpose to-do lists with items, ordering, and completion tracking.
- **Notes** — quick freeform notes.
- **Supermarket** — a dedicated shopping-list feature with categories, drag-and-drop reordering, price tracking, and a running total.
- **Debug screen** — a hidden maintenance screen for inspecting raw storage, running migrations manually, and wiping/exporting data during development.

Chores and calendar/reminders views are planned but not yet implemented.

## Tech Stack

- [Expo](https://expo.dev) / React Native (Android target)
- [Expo Router](https://docs.expo.dev/router/introduction/) for file-based navigation
- `@react-native-async-storage/async-storage` for local, on-device persistence
- [Zod](https://zod.dev) for validating data read from storage
- TypeScript, strict mode

## Data & Storage

All data is stored locally on-device — there is no backend, cloud sync, or user account. Each feature persists its own data through `AsyncStorage`, wrapped by a `StorageManager` (`src/store/StorageManager.ts`) that:

- Tags stored data with a `schemaVersion` integer.
- Runs versioned migrations (`src/store/migrations.ts`) on startup to bring older data up to the current shape.
- Validates data with Zod schemas on read, so a corrupted or stale record can't crash the app.

Domain objects (`Task`, list/notes/supermarket items, etc.) use `string` IDs (nanoid) and store dates as ISO 8601 strings.

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the Expo dev server:

   ```bash
   npx expo start
   ```

3. Run on Android — either scan the QR code with [Expo Go](https://expo.dev/go), or launch an emulator with:

   ```bash
   npm run android
   ```

## Project Structure

```
app/                  Expo Router screens (file-based routing)
src/features/         Feature-specific components, hooks, and logic (lists, notes, supermarket)
src/components/       Shared UI primitives (Button, IconButton, ScreenContainer, ...)
src/store/            Persistence layer: StorageManager, migrations, shared types
theme/                Design tokens: colors, spacing, typography, border radius
```

## Design

High-contrast, black-on-white, minimalist UI inspired by apps like Notion and Todoist. Colors are centralized as design tokens in `theme/`, built around Eigengrau (`#16161d`) for text/shapes and Anti-Flash White (`#F1F1F1`) for backgrounds.

## License

MIT — see [LICENSE](./LICENSE).
