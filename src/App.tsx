import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { Scene } from './components/scene/Scene';
import { Toolbar } from './components/ui/Toolbar';
import { Sidebar } from './components/ui/Sidebar';
import './App.css';

export default function App() {
  return (
    <div className="app">
      <Toolbar />
      <Sidebar />
      <div className="canvas-wrapper">
        <Canvas
          shadows
          camera={{ position: [10, 14, 14], fov: 50, near: 0.1, far: 200 }}
          gl={{ antialias: true }}
        >
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
}
