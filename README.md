# Done-ish

A minimalist to-do / lists / notes app for Android, built with Expo and React Native. Done-ish was made for personal use, with the specific focus on being ADHD-friendly. It is purposely designed to have lower mental load than most complicated productivity apps, thus it uses no accounts, cloud sync, or unnecessary features. It uses high-contrast, minimalist UI inspired by apps like Notion and Todoist.

This is a portfolio project, built incrementally, feature by feature. It still isn't 100% finished, but completely functional.

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

## License

MIT — see [LICENSE](./LICENSE).
