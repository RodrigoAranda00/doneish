# Done-ish
<img width="1640" height="664" alt="doneish cover" src="https://github.com/user-attachments/assets/9d55e6ae-239d-4b57-81c3-e98d595a88d9" />
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
