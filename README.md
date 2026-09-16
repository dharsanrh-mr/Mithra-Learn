# MITHRA Learn — AI Voice Backend

This package keeps the existing `index.html` and adds a Convex backend for Mithra AI.

## 1. Create/open a Convex project
In your Android IDE terminal, inside this folder:

```bash
npm install
npx convex dev
```

Follow the Convex login/project prompts.

## 2. Add the OpenAI key securely
Do NOT put the key in `index.html`.

In the Convex dashboard, open Deployment Settings → Environment Variables and add:

`OPENAI_API_KEY = your_key_here`

Convex stores deployment environment variables separately from frontend code.

## 3. Deploy
```bash
npx convex deploy
```

Your HTTP endpoint will be on your Convex `.convex.site` domain.

## 4. Connect the HTML app
Set the Convex site URL in the HTML configuration, for example:

```js
const MITHRA_API = "https://YOUR-DEPLOYMENT.convex.site";
```

Then call:
- `POST /mithra/chat` for Mithra AI replies
- `POST /mithra/speak` for Mithra voice audio

The current HTML still has browser SpeechRecognition as a fallback. Once the Convex URL is configured, the app can use the backend AI voice path.

## Architecture
🎤 Browser voice → SpeechRecognition → Convex `/mithra/chat` → OpenAI Responses API → Convex `/mithra/speak` → OpenAI TTS → 🔊 audio in browser
