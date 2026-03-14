# BTT — 3D TTRPG Map Editor / VTT

A browser-based 3D tactical map editor and virtual tabletop built with React Three Fiber.

## Stack

- [Vite](https://vitejs.dev/) + [React](https://react.dev/) + TypeScript
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) — Three.js in React
- [@react-three/drei](https://github.com/pmndrs/drei) — R3F helpers
- [Zustand](https://github.com/pmndrs/zustand) — state management

## Getting Started

```bash
npm install
npm run dev
```

## Features

- **Paint terrain tiles** — grass, dirt, stone, water, wood
- **Erase tiles** with the eraser tool
- **Place tokens** — color-coded character/monster tokens with labels
- **3D camera** — orbit, pan, zoom
- 30×30 tile grid with 5-tile section markers

## Tools

| Tool | Action |
|------|--------|
| 🖱️ Select | Orbit / pan / zoom camera |
| 🖌️ Paint | Click or drag to paint terrain |
| 🧹 Erase | Click or drag to erase tiles |
| 🧙 Token | Click to place a token |
