# Trainly

> Trainly is an Expo-based React Native fitness app for tracking workouts, building plans, and recording cardio routes on a map.

This repository contains the mobile app source code (React Native + Expo) and supporting components, screens, and APIs used by the app.

## Key features

- Workout plans and exercise tracking
- Cardio tracking with map route recording (uses device location)
- Favorites and quick-pick sections
- Redux Toolkit for state management

## Built with

- Expo (SDK ~54)
- React Native 0.81
- React 19
- Redux Toolkit
- react-native-maps
- react-native-paper
- axios
- yup

These and other dependencies are listed in `package.json`.

## Prerequisites

- Node.js (16+ recommended)
- npm or yarn
- Expo CLI (optional, you can use `npx expo`)
- Android Studio for Android emulator, or a physical device
- Xcode (macOS) for iOS simulator / building

If you already have Node installed, you can use npm (included) or install yarn globally:

```powershell
# install dependencies (npm)
npm install

# or with yarn
yarn
```

## Available scripts

The following npm scripts are defined (from `package.json`):

- `start` - Start Expo development server
- `android` - Start Expo and open Android
- `ios` - Start Expo and open iOS
- `web` - Start Expo for web

Run them with npm or yarn. Examples (PowerShell):

```powershell
npm run start
npm run android
npm run ios   # macOS only
npm run web
```

Or with yarn:

```powershell
yarn start
yarn android
yarn ios
yarn web
```

## Project structure (high level)

- `App.js` — app entry
- `assets/` — images, animations, icons
- `components/` — shared UI components
- `constants/` — theme and constants
- `hooks/` — custom React hooks
- `src/api/` — API wrappers (e.g., `authAPI.js`)
- `src/redux/` — Redux slices and store
- `src/screens/` — app screens and nested feature folders (Cardio, Workout)
- `src/utils/` — helper utilities

Explore the folders to find the screens and components you want to modify.

## Configuration & API

If the app needs environment-specific configuration (API base URLs, feature flags), keep that configuration in `src/api` or add an `.env` file and update `src/api/*` to read from it. For local development you can edit `src/api/authAPI.js` to set the correct backend URL.

## Running on device/emulator

1. Install dependencies (`npm install` or `yarn`).
2. Start the Expo dev server: `npm run start`.
3. Open Android emulator or iOS simulator (or scan the QR code with the Expo Go app on a real device).

## Testing & linting

This project includes ESLint configuration. Run the linter if you add or modify code:

```powershell
npm run lint
```

Add tests or a test runner if/when needed.

## Branches, commits and contribution guide

Suggested workflow for small teams and contributors:

- Create feature branches: `feature/<short-description>` (e.g. `feature/auth-login`).
- Keep commits focused and small. Use `git add -p` to stage related hunks.
- Commit messages: use Conventional Commits style, for example:

```
feat(auth): add login validation

- validate input on client
- integrate error messages from API
```

- Push branch and open a PR for review. Include testing steps and screenshots where relevant.

## License

No license file included in this repository. If you'd like to make this project open-source, add a `LICENSE` (for example, MIT) at the repository root.

## Contact

Repo: https://github.com/Govindu-Bandara/Trainly

If you want me to also create a `CONTRIBUTING.md`, add a license, or open a PR with the README committed on a feature branch, tell me which option you prefer and I'll do it.
# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
