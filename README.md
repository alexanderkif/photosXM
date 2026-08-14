# GalleryTemplate

A small Angular photo gallery app that emulates real-world API latency for loading photos.

## Assignment requirements

This implementation follows the project requirements:

- Use Angular Router module
- Use the latest Angular and SCSS instead of CSS
- Use Angular Material components
- Implement infinite scroll manually without external libraries
- Don’t use any backend server to retain state
- Add unit tests

## Prerequisites

- Node.js (compatible with npm 11.x)
- Angular CLI 22.x

## Installation

Install dependencies in the project root:

```bash
npm install
```

## Development server

Start the development server:

```bash
npm start
```

Open your browser at `http://localhost:4200/`.

The app supports live reload and will refresh automatically when source files change.

## Build

Build the production bundle:

```bash
npm run build
```

The compiled output is written to the `dist/` folder.

## Tests

Run unit tests:

```bash
npm test
```

Run unit tests with coverage:

```bash
npm run test:coverage
```

Run Vitest UI with coverage:

```bash
npm run test:ui
```

> Note: this Angular 22 zoneless project uses Angular CLI's `ng test` runner. The CLI initializes the Angular test environment and selects Vitest automatically. Do not invoke `npx vitest` directly.

## Loading delay emulation

The app intentionally simulates network/API latency for photo loading:

- In `src/app/components/card/card.ts`, the photo card uses a random loading delay based on the `delayMs` setting:
  - `Math.random() * this.settings.delayMs()`
- In `src/app/services/photo-service.ts`, the `loadNextPage` method also applies the `delayMs` setting to simulate network delay before fetching the next page of photos.


## Notes

- The project was generated with Angular CLI 22.0.6.
- The app uses Vitest for unit testing.
- For additional Angular CLI documentation, visit https://angular.dev/tools/cli.

