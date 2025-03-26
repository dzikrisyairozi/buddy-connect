This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Firebase Emulator Integration

This project includes support for testing with Firebase Emulators. This allows you to develop and test against a local Firebase environment without affecting production data.

### First-time setup

Before using the emulators, make sure you have the required dependencies installed:

```bash
# Navigate to the backend directory
cd ../backend

# Install firebase-tools locally (if not already installed)
npm install --save-dev firebase-tools
```

### Setting up Emulator Mode

1. Start the backend Firebase Emulators:

```bash
# Navigate to the backend directory
cd ../backend

# Build and start the emulators
npm run build && npm run emulators
```

2. In a separate terminal, start the frontend in emulator mode:

```bash
# Navigate to the frontend directory
cd frontend

# Start with emulator configuration enabled
npm run dev:emulator
```

### Quick Start (Combined Emulators)

If you want to start both the backend and frontend emulators with a single command:

```bash
# From the frontend directory
npm run emulator:all
```

This script will:

1. Build the backend TypeScript code
2. Start the Firebase emulators
3. Start the frontend with emulator configuration

### What's Enabled in Emulator Mode?

- Firebase Auth Emulator (localhost:9099)
- Firestore Emulator (localhost:8080)
- Cloud Functions Emulator (localhost:5001)

When running in emulator mode, a visual badge will appear in the bottom-right corner of the app to indicate you're using emulators.

### Environment Configuration

To enable emulator mode, the `NEXT_PUBLIC_USE_EMULATOR` environment variable is set to `true` in your `.env.local` file. You can toggle this setting:

```
NEXT_PUBLIC_USE_EMULATOR=true
```

### Testing Emulator Connection

You can verify your connection to the emulators by running:

```bash
npm run test:emulator
```

This will attempt to connect to the Firebase Functions emulator and report the status.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Firebase Emulator Integration
