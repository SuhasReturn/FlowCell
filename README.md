<div align="center">

<br />

```
  ███████╗██╗      ██████╗ ██╗    ██╗ ██████╗███████╗██╗     ██╗
  ██╔════╝██║     ██╔═══██╗██║    ██║██╔════╝██╔════╝██║     ██║
  █████╗  ██║     ██║   ██║██║ █╗ ██║██║     █████╗  ██║     ██║
  ██╔══╝  ██║     ██║   ██║██║███╗██║██║     ██╔══╝  ██║     ██║
  ██║     ███████╗╚██████╔╝╚███╔███╔╝╚██████╗███████╗███████╗███████╗
  ╚═╝     ╚══════╝ ╚═════╝  ╚══╝╚══╝  ╚═════╝╚══════╝╚══════╝╚══════╝
```

**See your code think.**

Watch functions, variables, and logic connect in real time — as you type.

<br />

![Version](https://img.shields.io/badge/version-1.0.0-5B8DEF?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-F2A33C?style=flat-square)
![Made with React](https://img.shields.io/badge/React-18-5B8DEF?style=flat-square&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-5B8DEF?style=flat-square&logo=typescript&logoColor=white)
![Powered by Vite](https://img.shields.io/badge/Vite-5-F2A33C?style=flat-square&logo=vite&logoColor=white)
![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=flat-square&logo=vercel&logoColor=white)

<br />

[Live Demo](https://flowcell.vercel.app) · [Report a Bug](https://github.com/yourusername/flowcell/issues) · [Request a Feature](https://github.com/yourusername/flowcell/issues)

<br />

</div>

---

## What is Flowcell?

Flowcell is a live code visualizer that turns your code into a relationship graph **as you type**. Instead of reading your code line by line and guessing how things connect, you can see it — every function, every variable, every call — laid out as a live graph that updates the moment you stop typing.

It's built for two kinds of people:

- **Learners** who want to understand how recursion, loops, and function calls actually work by seeing the structure form in real time
- **Developers** who want a fast, visual way to understand unfamiliar code or debug logic without adding console.logs everywhere

No account needed. No code leaves your browser. Everything runs client-side.

---

## Features

### Live structural graph
The graph updates automatically ~250ms after you stop typing. Even if your code has a syntax error, the last valid graph stays on screen — you're never looking at a blank canvas.

### Execution tracing
Hit Run and Flowcell executes your code step by step using a sandboxed interpreter running in a Web Worker (so an infinite loop can never freeze your tab). Variable values and call entries/exits overlay onto the graph live, and you can step forward, backward, pause, or scrub through the entire execution trace.

### Two visual layers
Structural connections (parsed but not yet run) appear in **blue** as dashed edges. Once you run the code, traced connections appear in **amber** as solid edges. The visual language is consistent everywhere so you always know what's live and what's static.

### JavaScript and Python
Switch between JS and Python without losing your layout. Python runs via Pyodide (WebAssembly, loaded lazily only when you switch), using the same graph interface and playback controls.

### Fully responsive
Works on mobile. On narrow screens the editor and graph stack vertically instead of side by side.

### Private by design
Code is parsed and executed entirely in your browser. Nothing is sent to a server. The Python runtime (Pyodide) downloads once to your device and runs locally via WebAssembly.

---

## Tech stack

| Layer | Library |
|---|---|
| Framework | React 18 + TypeScript + Vite |
| Editor | Monaco Editor (`@monaco-editor/react`) |
| JS parsing | Acorn |
| JS execution | JS-Interpreter (Web Worker sandbox) |
| Python execution | Pyodide (WebAssembly, lazy-loaded) |
| Graph rendering | React Flow (`@xyflow/react`) |
| State | Zustand |
| Animation | Framer Motion |
| Styling | Tailwind CSS |
| Icons | Lucide React |
| Fonts | Space Grotesk · Inter · JetBrains Mono |
| Hosting | Vercel |

---

## Getting started

### Prerequisites

- Node.js 18 or higher
- npm 9 or higher

### Run locally

```bash
# 1. Clone the repo
git clone https://github.com/yourusername/flowcell.git
cd flowcell

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for production

```bash
npm run build
```

The output goes to `dist/`. Preview it locally with:

```bash
npm run preview
```

---

## Project structure

```
flowcell/
├── public/
├── src/
│   ├── main.tsx
│   ├── App.tsx                    # Router + page transitions
│   ├── styles/
│   │   └── globals.css
│   ├── pages/
│   │   ├── Home.tsx               # Marketing landing page
│   │   └── Visualize.tsx          # The visualizer tool
│   └── components/
│       ├── visualizer/            # All tool components
│       │   ├── EditorPane.tsx
│       │   ├── GraphCanvas.tsx
│       │   ├── PlaybackBar.tsx
│       │   ├── PaneDivider.tsx
│       │   ├── LanguageToggle.tsx
│       │   └── worker/
│       │       └── executor.worker.ts
│       ├── landing/               # Homepage sections
│       │   ├── Navbar.tsx
│       │   ├── Hero.tsx
│       │   ├── DemoStrip.tsx
│       │   ├── Features.tsx
│       │   ├── HowItWorks.tsx
│       │   ├── Languages.tsx
│       │   ├── Testimonials.tsx
│       │   ├── Faq.tsx
│       │   └── Footer.tsx
│       └── ui/                    # Shared primitives
│           ├── Button.tsx
│           └── Badge.tsx
├── AGENTS.md
├── tailwind.config.js
├── vite.config.ts
└── tsconfig.json
```

---

## How it works

Flowcell runs two layers simultaneously:

**Structural layer (instant)** — On every keystroke, Acorn parses your code into an AST and extracts all function declarations, variable references, and call relationships. This builds the graph even while your code is mid-sentence and not yet runnable. If parsing fails, the last valid graph is preserved.

**Execution layer (on Run)** — When you hit Run, the code is sent to a Web Worker where JS-Interpreter executes it step by step. At each step, variable values and call entry/exit events are captured and posted back to the main thread. These get overlaid onto the existing structural graph as traced (amber) values and edges.

The Web Worker has a hard 5,000-step and 2-second time limit, so infinite loops can never freeze your tab.

For Python, Pyodide provides a full CPython runtime in WebAssembly. Python's own `ast` module handles structural parsing, and `sys.settrace` captures execution events — the same trace format flows into the same graph and playback UI.

---

## Design system

Flowcell uses a strict two-color semantic system:

| Color | Hex | Meaning |
|---|---|---|
| Blue | `#5B8DEF` | Structural — parsed but not yet executed |
| Amber | `#F2A33C` | Traced — live execution values |
| Coral | `#E0654F` | Error states only |

Backgrounds alternate between light (`#F7F8FC`) and dark (`#13151A`) sections to give the marketing site visual rhythm. The tool itself runs on a deep graphite background (`#13151A`) with panel surfaces at `#1C1F27`.

---

## Roadmap

- [x] Live structural graph (JS)
- [x] Step-by-step execution tracing (JS)
- [x] Python support via Pyodide
- [x] Responsive mobile layout
- [ ] Shareable links (paste your code, share a URL)
- [ ] TypeScript support with type annotation overlays
- [ ] Async/Promise visualization (event loop, microtask queue)
- [ ] AI-narrated step-by-step explanations
- [ ] Export visualization as image or GIF
- [ ] VS Code extension
- [ ] Community snippet gallery

---

## Contributing

Contributions are welcome. If you find a bug or want to suggest a feature, open an issue first so we can discuss it before you build.

```bash
# Fork the repo, then:
git checkout -b feature/your-feature-name
npm install
npm run dev

# When you're done:
npm run build        # must pass with zero errors
npx tsc --noEmit     # must pass with zero type errors
git push origin feature/your-feature-name
# Open a pull request
```

Please don't submit PRs that add `// @ts-ignore` or `eslint-disable` comments. Fix the actual error.

---

## License

MIT — see [LICENSE](./LICENSE) for details.

---

<div align="center">

Built for developers who want to see their code think.

**[flowcell.vercel.app](https://flowcell.vercel.app)**

</div>
