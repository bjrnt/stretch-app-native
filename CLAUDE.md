# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A personal stretching/exercise timer app built with Expo (SDK 57, React Native 0.86, React 19). It shows a list of routines, then walks through a routine one step at a time with a countdown ring for timed holds, rep targets for exercises, and gong/woodblock sounds. Updates ship over the air via EAS Update.

## Commands

Package manager is pnpm (`.npmrc` uses a hoisted `node_modules`).

- `pnpm export` — the main way the app is run: publishes an OTA update (`eas update`), which the owner opens in **Expo Go** on their phone. The owner is the only user, so this is safe to run whenever a change is ready to try on device. In non-interactive shells pass `--non-interactive --branch main --message "…"`.
- `pnpm web` — Expo in the browser; the quickest way to check changes during development
- `pnpm start` — Expo dev server; `pnpm ios` / `pnpm android` build and run natively
- `pnpm lint` — oxlint (config extends `@nkzw/oxlint-config`)
- `pnpm fmt` / `pnpm lint:format` — oxfmt write / check
- `npx tsc --noEmit` — typecheck (no script for it)

There is no test runner set up, despite `@types/jest` in devDependencies.

The lint config uses perfectionist to enforce sorted object keys, interface/type members and JSX props, which is why they are alphabetical throughout. Run `pnpm fmt` and `pnpm lint` after edits.

## Architecture

All source files live flat in the repo root; there is no `src/` and no navigation library.

- **`App.tsx`** holds the only navigation state: `open: RoutineKey | null` switches between `HomeScreen` and `SessionScreen`. It also loads fonts, keeps the screen awake, and maps the Android back button to closing a session.
- **Routine data**: `Data.ts` defines the task types (`Stretch` has a `duration` in seconds; `Exercise` has `repetitions`, a number or a free-form string like `"3 rounds"`). `RoutineBuilder.ts` expands configs into a flat task list: `eachSide` becomes a Left + Right pair, `withSets` repeats and numbers tasks, and `withDefaultLength` fills missing stretch durations. `Routines.ts` is the default-exported map of all routines; its keys become `RoutineKey`.
- **`RightSideRoutines.ts`** builds the "Right-Side Tightness Plan" routines with its own helpers (`hold`, `reps`, `right`, `sets`, `sides`) instead of `eachSide`, so side order and per-side set counts can be asymmetric. Exercise names use family codes (`H2 …`, `R1 …`) that `splitCode` in `Session.ts` parses for display.
- **`Library.ts`** decides how routines appear on the home screen: `groups` (sections and order) and `budgets` (time-budget cards for the plan routines). **A new routine must be added both to `Routines.ts` and to a group in `Library.ts`**, or it won't be shown.
- **`Session.ts`** has the pure session logic: `sessionReducer` (toggle/complete/skip/back/jump/restart), with timing stored as an absolute `endsAt` timestamp while running and `remainingMs` while paused. Consecutive stretches auto-advance unless a task sets `pauseAfter`. It also has display helpers (`keyCue`, `repsParts`, `estimateMinutes`, etc.). `SessionScreen.tsx` wires the reducer to UI and audio; `RingTimer.tsx` animates the countdown with `requestAnimationFrame`.
- **`Log.ts`** stores session history in AsyncStorage (`useLog`, owned by `App.tsx`). Completed steps are saved as they happen, identified by `stepKey` (name, side, set, target) so steps shared between routines count for each. A routine counts as done on a day when that day's steps cover 80% of it; the home screen derives weekly counts, the daily streak and "last done" from that.
- **Descriptions are Markdown** rendered by the custom `Markdown.tsx`, which supports only paragraphs, `-` and `1.` lists, `**bold**`, `_italic_` and `[links](https://…)`. `keyCue` pulls the mid-exercise hint from a `**Feel it:**` or `**Purpose:**` line, so keep those labels when writing descriptions.
- **Theming**: `theme.ts` defines light/dark `Palette`s (picked via `useColorScheme`) and font names. The palette is passed down as a `palette` prop instead of through context. `Paper.tsx` is the shared screen background and exports the `topInset`/`bottomInset` constants (there's no safe-area library).

## Native and release

The app runs in Expo Go, so no native build is needed to try a change. Native dependencies must be ones Expo Go ships for the current SDK (install them with `npx expo install` so versions match). The notes below only matter for standalone builds.

- `ios/` is committed (prebuilt); there is no `android/` directory. After changing native config in `app.json` or adding native modules, the iOS project may need regenerating with `npx expo prebuild`.
- OTA compatibility is keyed on `runtimeVersion` in `app.json` (`2.1.0` on iOS, `appVersion` policy on Android). Bump it when a change needs a new native build.
- Assets loaded with `require()` (fonts, sounds, `hanji.png`) need the `typescript-eslint/no-require-imports` lint rule disabled locally, as in the existing code.
