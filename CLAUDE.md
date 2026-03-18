# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start                    # Start Metro bundler
npm run android              # Run on Android
npm run android:dev          # Run Android (dev environment)
npm run android:release      # Run Android (production)
npm run ios                  # Run on iOS
npm run build:apk:dev        # Build dev APK
npm run build:apk:release    # Build release APK
npm run lint                 # ESLint
npm test                     # Jest tests
npm run clean                # Clean caches and build artifacts
npm run clean:all            # Full clean including node_modules
npm run start:clean          # Start Metro with cache reset
```

## Architecture

**React Native 0.83 + TypeScript** mobile app (Korean-language UI).

### State Management
- **Redux Toolkit** with `redux-persist` (AsyncStorage, whitelist: `['dataRoom']`)
- **RTK Query** for server state — tag-based cache invalidation, bearer token auth via `prepareHeaders`
- Legacy endpoints use custom `apiGet`/`apiPost`/`apiRest` utilities in `src/api/api.ts`
- Token management via `tokenService` in `src/services/`

### Navigation
React Navigation v7 with type-safe param lists:
- `AuthStack` → `MainTabs` (Home, Schedule, MeetingMinutes, Contract, Draft)
- Each tab has a nested native stack (HomeStack, ScheduleStack, DataRoomStack, etc.)
- Navigation types defined in `src/interface/tab.interface.ts`

### Styling
- `StyleSheet.create()` — no Tailwind
- Responsive scaling via `react-native-size-matters` (base: 375×812)
- Design tokens in `src/constants/`: `colors.ts`, `typography.ts`, `shadows.ts`

### Environment
- `react-native-dotenv` babel plugin reads `.env` for `API_BASE_URL`

## Code Conventions

- **Interfaces** use `I` prefix (`IAppButtonProps`, `ISchedule`)
- **Type aliases** use `T` prefix (`TScheduleMode`, `TMeetingMinutes`)
- **Components** are functional, memoized on export: `export const MemoFoo = React.memo(Foo)`
- Use `//---------------------------------------` separator comments between functions/hooks inside components
- Feature types live in `src/screens/{feature}/type.ts`
- RTK Query APIs live in `src/store/api/`; Redux slices in `src/store/slices/`

## Project Layout

```
src/
  api/          # Async storage & fetch utilities
  assets/       # Images, icons, GIFs
  component/    # Shared UI components
  config/       # App config (size-matters base dimensions)
  constants/    # Colors, typography, icons, images, shadows, theme
  hooks/        # Custom React hooks
  interface/    # Navigation TypeScript types
  navigation/   # Navigation stacks (Auth, Home, Schedule, etc.)
  providers/    # Context providers (Toast, Overlay)
  screens/      # Feature modules (auth, bulletin, dashboard, dataRoom, meetingMinutes, schedule)
  services/     # Business logic (token, upload)
  store/        # Redux store, slices, RTK Query APIs
  types/        # Global TypeScript definitions
  utils/        # Helpers (date, format, calendar)
```
