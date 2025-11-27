# 🔴 Live Web Commentary Widget

A React-based widget that adds a Twitch-style chat overlay to your web applications. It uses Vision Language Models (VLMs) to analyze screen content in real-time and generate witty, context-aware commentary.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![React](https://img.shields.io/badge/React-19-blue)

## 📖 About

This project is a monorepo that contains:
1.  **`@cristianglezm/live-commentary-widget`**: A standalone, publishable React library.
2.  **Demo Application**: A showcase app featuring four simulated environments.

## ✨ Features

-   **👁️ Visual Intelligence**: Analyzes screen content using multimodal AI models (GPT-4o, local VLMs via llama.cpp, Gemini, etc.).
-   **🔌 Middleware Support**: Intercept AI responses to define your own users, colors, and parsing logic.
-   **🪝 Headless Hooks**: Use `useScreenCapture` and `useLiveCommentary` independently to build custom UIs.
-   **💬 Live Chat Experience**: Simulates a lively chat environment with sticky scrolling and message overflow handling.
-   **🎮 Game Ready**: Supports `external` mode to capture frames directly from `<canvas>` elements for high-performance game commentary.
-   **🤖 Autonomous Agents**: The Football demo features self-driving AI agents playing a real-time match.

## 🚀 Getting Started

### Prerequisites

-   Node.js (v20+)
-   NPM

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/cristianglezm/live-commentary-widget.git
    cd live-commentary-widget
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

### Running the Demo

Start the development server to see the widget in action.

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## 🛠️ Development

-   **Library Code**: `packages/@cristianglezm/live-commentary-widget`
-   **Demo App**: `src/`

### Testing

Run unit tests for the library:
```bash
npm test
```

## 📄 License

MIT © [Cristian Gonzalez](https://github.com/cristianglezm)
