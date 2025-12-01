# @cristianglezm/live-commentary-widget

[![npm](https://img.shields.io/npm/v/@cristianglezm/live-commentary-widget.svg)](https://www.npmjs.com/package/@cristianglezm/live-commentary-widget)
![License](https://img.shields.io/npm/l/@cristianglezm/live-commentary-widget)

A React component library that adds a "Twitch-style" live chat overlay to your application. It uses AI Vision models to "watch" the screen (or a specific canvas) and generate humor, context-aware commentary, or useful insights in real-time.


## ✨ Features

*   **Plug & Play**: Drop `<LiveCommentary />` into any React app.
*   **📸 Snapshot Verification**: Users can toggle "Show Reference Image" to see exactly what the AI was looking at when it commented (New in v1.1).
*   **Headless Hooks**: Use `useLiveCommentary` and `useScreenCapture` to build your own custom UI.
*   **AI Middleware**: Intercept raw AI responses to handle your own parsing, username assignment, or state management.
*   **AI Powered**: Compatible with OpenAI's Vision API (`gpt-4o`) and local alternatives (e.g., `llama.cpp` server).
*   **Screen & Canvas Support**: Capture the entire screen via the browser API or hook directly into a `<canvas>` for games.
*   **Sticky Scroll**: Chat widget automatically scrolls to new messages but pauses when you scroll up.

## 📦 Installation

```bash
npm install @cristianglezm/live-commentary-widget
```

## 💻 Usage

### 1. Basic Usage (The "Easy" Way)
The `LiveCommentary` component wraps the logic and the UI into one standard widget.

```tsx
import { LiveCommentary } from '@cristianglezm/live-commentary-widget';
import '@cristianglezm/live-commentary-widget/style.css';

function App() {
  return (
    <div>
      <LiveCommentary 
        config={{
          model: 'gpt-4o',
          apiKey: process.env.REACT_APP_API_KEY, 
        }} 
      />
    </div>
  );
}
```

### 2. Middleware (Controlled Mode)
Want to control exactly who says what? Use `responseTransform` to intercept the raw text from the LLM and return your own message objects.

```tsx
import { LiveCommentary, createChatMessage } from '@cristianglezm/live-commentary-widget';

<LiveCommentary 
  responseTransform={(rawText) => {
    // rawText is exactly what the LLM returned
    console.log("AI said:", rawText);
    
    // You can parse JSON, XML, or just return a hardcoded user
    return [
      createChatMessage(rawText, "MyCustomBot", "#ff0000")
    ];
  }}
/>
```

### 3. Headless Mode (Custom UI)
Build your own UI entirely using the hooks.

```tsx
import { useLiveCommentary, useScreenCapture, ChatWidget } from '@cristianglezm/live-commentary-widget';

function MyCustomPage() {
  const { isCapturing, startCapture, captureFrame } = useScreenCapture({ mode: 'screen-capture' });
  
  const { messages, triggerEvaluation } = useLiveCommentary({
     isCapturing,
     captureFrame,
     config: { apiKey: '...' }
  });

  return (
    <div>
      <button onClick={startCapture}>Start Recording</button>
      <button onClick={() => triggerEvaluation()}>Force Comment</button>
      
      {/* You can use our widget or render your own list */}
      <div className="my-custom-chat-container">
        {messages.map(msg => <div key={msg.id}>{msg.text}</div>)}
      </div>
    </div>
  );
}
```

## ⚙️ Configuration Props (`LiveCommentary`)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `config` | `Partial<VlmSettings>` | | Override API settings (url, key, model, temp). |
| `mode` | `'screen-capture' \| 'external'` | `'screen-capture'` | Use `'external'` for direct canvas/video hook. |
| `responseTransform` | `(raw: string) => ChatMessage[]` | | **New:** Middleware to handle raw AI text yourself. |
| `captureSource` | `() => string \| null` | | Required if mode is `external`. Returns base64 image string. |
| `prompts` | `CommentaryPrompts` | | Customize the system instructions and triggers. |
| `contextData` | `object` | | Arbitrary JSON data sent to the AI for context. |
| `usernames` | `string[]` | `undefined` | Custom list of usernames for random assignment. |
| `showBadges` | `boolean` | `true` | Show Twitch-style badges (Broadcaster, Prime, etc). |
| `title` | `string` | `"Live Commentary"` | Header title of the widget. |
| `overlay` | `boolean` | `true` | If `true`, fixed positioning. If `false`, fills parent. |

## 🎨 Customization

The widget uses CSS variables for theming. Import the CSS and override variables in your `:root`.

```css
import '@cristianglezm/live-commentary-widget/style.css';

:root {
  --color-lc-bg: #18181b;
  --color-lc-accent: #9147ff;
}
```

## 📄 License

MIT © Cristian Gonzalez
