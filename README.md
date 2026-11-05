# CognitiveFocus

**Live website:** https://cognitive-focus.ai.studio  
**GitHub:** https://github.com/david-8188/cognitivefocus

CognitiveFocus is an AI-assisted research and learning workspace designed for sustained concentration, active recall, and deeper understanding of complex technical material.

## Features

- **Research reader:** Read structured research papers, navigate sections, inspect citations, highlight important passages, and use Bionic Focus reading support.
- **Generative synthesis lab:** Explore concepts through a concept graph, audio briefing, and paper-grounded question-and-answer experience.
- **Active recall:** Practice with flashcards, cloze deletion, and retrieval exams. Review actions use spaced-repetition intervals.
- **Deep focus sessions:** Run timed focus and break cycles with optional synthesized audio.
- **Research library:** Search the sample library and ingest custom paper or source text.
- **Comprehension telemetry:** View learning and review analytics.

The repository includes seeded sample research material for demonstration. Review generated or sample academic content against primary sources before relying on it.

## Live demo

Try the deployed Google AI Studio application here:

**https://cognitive-focus.ai.studio**

## Tech stack

- React 19 and TypeScript
- Vite
- Tailwind CSS 4
- Google Gemini SDK (`@google/genai`)
- Lucide React icons
- Motion

## Run locally

### Requirements

- Node.js 22.12 or newer
- npm

### Install dependencies

```bash
npm install
```

### Configure Gemini

Create a local `.env.local` file in the project root. The current exported client-side integration looks for `VITE_GEMINI_API_KEY` first:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key
```

Then start the development server:

```bash
npm run dev
```

Open the local URL printed by Vite (the project config uses port 3000).

### Production build

```bash
npm run build
npm run preview
```

The production output is written to `dist/`.

## API key security

**Do not commit API keys to GitHub.** The current exported `src/services/aiService.ts` calls Gemini from the browser and reads a Vite environment variable. Vite-prefixed variables are included in the client-side bundle and can be inspected by website visitors. The live AI Studio deployment may provide its own managed secret environment, but a separately hosted production deployment should use a server-side API proxy (for example, a Cloud Run backend) and a restricted API key rather than publishing a personal Gemini key in frontend code.

The app has a local deterministic fallback for some paper-question flows when Gemini is not configured. Other interface areas may use seeded/demo data.

## Project structure

```text
.
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── metadata.json
├── public/
│   └── assets/
└── src/
    ├── App.tsx
    ├── components/
    ├── data/
    ├── services/
    ├── types/
    └── index.css
```

## Resume description

**CognitiveFocus | React, TypeScript, Vite, Tailwind CSS, Google Gemini API**

Built an AI-assisted research and learning workspace featuring a structured paper reader, AI-based paper Q&A and synthesis, active-recall study modes, spaced-repetition flashcards, focus sessions with synthesized audio, a searchable research library, and learning telemetry.

## License

See [LICENSE](LICENSE).
