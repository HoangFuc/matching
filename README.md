# Matching (매칭)

A **React Native 0.83** mobile application built with **TypeScript** for organizational management — scheduling, meeting minutes, data rooms, bulletin boards, and attendance tracking. Korean-language UI.

## Tech Stack

- **React Native** 0.83 + **TypeScript** 5.8
- **Redux Toolkit** + **RTK Query** (state & server cache)
- **React Navigation** v7 (type-safe stacks & tabs)
- **React Hook Form** (form handling)
- **redux-persist** with AsyncStorage
- Social login: Google, Kakao, Naver

## Prerequisites

- Node.js >= 20
- React Native environment set up ([guide](https://reactnative.dev/docs/set-up-your-environment))
- Android Studio / Xcode
- `.env` file with `API_BASE_URL` and social login credentials

## Getting Started

```bash
# Install dependencies
npm install

# iOS only — install CocoaPods
bundle install
bundle exec pod install

# Start Metro bundler
npm start

# Run on device / emulator
npm run android        # Android (debug)
npm run ios            # iOS (debug)
```

## Scripts

| Command | Description |
|---|---|
| `npm start` | Start Metro bundler |
| `npm run android` | Run on Android |
| `npm run android:dev` | Run Android (dev environment) |
| `npm run android:release` | Run Android (production) |
| `npm run ios` | Run on iOS |
| `npm run build:apk:dev` | Build dev APK |
| `npm run build:apk:release` | Build release APK |
| `npm run lint` | Run ESLint |
| `npm test` | Run Jest tests |
| `npm run clean` | Clean caches and build artifacts |
| `npm run clean:all` | Full clean including node_modules |
| `npm run start:clean` | Start Metro with cache reset |

## Project Structure

```
src/
  api/            # AsyncStorage & fetch utilities
  assets/         # Images, icons, GIFs
  component/      # Shared UI components (buttons, forms, calendar, modals)
  config/         # App config (size-matters base dimensions)
  constants/      # Colors, typography, icons, images, shadows, theme
  hooks/          # Custom React hooks
  interface/      # Navigation & feature TypeScript types
  navigation/     # Navigation stacks (Auth, Home, Schedule, DataRoom, etc.)
  providers/      # Context providers (Toast, Overlay, UpdateRequired)
  screens/        # Feature modules
    auth/          # Login, registration, organization setup
    bulletin/      # Bulletin board (posts, comments)
    dashboard/     # Home dashboard
    dataRoom/      # File & folder management
    meetingMinutes/           # Meeting minutes CRUD
    meetingScheduleManagement/ # Meeting schedule management
    organizationChart/        # Org chart display
    schedule/      # Calendar & attendance
  services/       # Business logic (token, upload, location, social login)
  store/          # Redux store, slices, RTK Query APIs, middleware
  types/          # Global TypeScript definitions
  utils/          # Helpers (date, format, calendar)
```

## Testing

```bash
npm test              # Run all tests
npx jest --verbose    # Run with detailed output
npx jest <path>       # Run specific test file
```

Tests are located in `__tests__/` and cover APIs, Redux slices, services, middleware, utilities, and hooks.

