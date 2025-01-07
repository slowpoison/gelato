# Gelato App

A simple tray-based application for controlling Key Light.

Limitations:
- Only designed to handle a single key light device. If multiple devices are found, the first one will be used.
- Doesn't support the comprehensive set of Key Light features.

## Features

Turn Key Light on or off

## Development Setup

1. Install dependencies:
```bash
pnpm install
```

2. Run the development server:
```bash
pnpm run start
```

## Building

To build the application for production:

```bash
pnpm run build
```

## License

MIT

## Technical Stack

- Electron
- TypeScript
- Node.js

## Application Structure

The main application logic is handled by the `GelatoApp` class which manages:

- Tray icon creation and management
- Main application window
- Event handling for window visibility
- Application lifecycle
