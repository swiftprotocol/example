# Swift Protocol Example App

A Next.js application that demonstrates how to use the Swift Protocol SDK for secure data management. This app allows users to:

- Identify themselves with a plaintext username
- List their associated data keys
- Store encrypted data by key
- Retrieve and decrypt data by key

This example uses the `dev` environment of Swift Protocol.

## Setup

1. Install dependencies:

```bash
yarn install
```

2. Create a `.env.local` file in the root directory with the following variables:

```
SWIFT_API_URL=https://dev.api.swiftprotocol.zone
SWIFT_API_KEY=your_api_key_here
```

## Running the App

To run the app in development mode:

```bash
yarn dev
```

This will start the Next.js development server on http://localhost:3000.

To build and run the production version:

```bash
yarn build
yarn start
```

## Project Structure

- `/pages`: Next.js pages including the main app interface
- `/pages/api`: API routes for handling server-side logic
- `/components`: Reusable React components
- `/lib`: Utility functions including Swift Protocol helpers
- `/styles`: Global styles and Tailwind configuration