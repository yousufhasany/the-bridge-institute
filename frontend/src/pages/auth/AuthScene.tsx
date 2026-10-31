import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

type SceneStatus = 'ready' | 'lost' | 'unsupported';

export function AuthScene({ boost }: { boost: boolean }) {
  const mount = useRef<HTMLDivElement>(null);
  const boostRef = useRef(boost);
  const [status, setStatus] = useState<SceneStatus>('ready');
  boostRef.current = boost;

  useEffect(() => {
    const host = mount.current;
    if (!host) return;

    const probe = document.createElement('canvas');
    const gl = probe.getContext('webgl2') ?? probe.getContext('webgl');
    if (!gl) {
      setStatus('unsupported');
      return;
    }

    let stopped = false;
    let frame = 0;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const renderer = new THREE.WebGLRenderer({
      canvas: document.createElement('canvas'),
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x050505, 1);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.domElement.className = 'auth-sci-canvas';
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 40);
    camera.position.set(0, 0.15, 6.4);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = environment;
    pmrem.dispose();

    const geometry = new THREE.TorusKnotGeometry(1.15, 0.34, 240, 36);
    const material = new THREE.MeshPhysicalMaterial({
      color: 0xc5dcff,
      metalness: 1,
      roughness: 0.14,
      iridescence: 1,
      iridescenceIOR: 1.45,
      clearcoat: 1,
      clearcoatRoughness: 0.06,
      envMapIntensity: 1.55,
    });
    material.iridescenceThicknessMinimum = 90;
    material.iridescenceThicknessMaximum = 520;
    const knot = new THREE.Mesh(geometry, material);
    scene.add(knot);

    const blue = new THREE.PointLight(0x3d7bff, 50, 18);
    blue.position.set(-3.2, 1.8, 2.4);
    const purple = new THREE.PointLight(0xb14cff, 42, 18);
    purple.position.set(2.8, -1.4, 2.2);
    const rim = new THREE.DirectionalLight(0x8eb6ff, 2.4);
    rim.position.set(-2, 4, -5);
    scene.add(blue, purple, rim, new THREE.AmbientLight(0x24304a, 1.4));

    const resize = () => {
      const width = Math.max(1, host.clientWidth);
      const height = Math.max(1, host.clientHeight);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(host);
    resize();

    let speed = reduced ? 0 : 0.16;
    let previous = performance.now();
    const tick = (now: number) => {
      if (stopped) return;
      frame = requestAnimationFrame(tick);
      const dt = Math.min(0.05, (now - previous) / 1000);
      previous = now;
      try {
        if (renderer.getContext().isContextLost()) return;
        const target = reduced ? 0 : boostRef.current ? 1.2 : 0.16;
        speed += (target - speed) * (1 - Math.exp(-dt * 3.2));
        knot.rotation.y += speed * dt;
        knot.rotation.x += speed * 0.32 * dt;
        renderer.render(scene, camera);
      } catch (error) {
        host.dataset.error = error instanceof Error ? error.message : 'render failed';
      }
    };
    frame = requestAnimationFrame(tick);

    const onLost = (event: Event) => {
      event.preventDefault();
      if (!stopped) setStatus('lost');
    };
    const onRestored = () => {
      if (!stopped) {
        resize();
        setStatus('ready');
      }
    };
    renderer.domElement.addEventListener('webglcontextlost', onLost);
    renderer.domElement.addEventListener('webglcontextrestored', onRestored);

    return () => {
      stopped = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      renderer.domElement.removeEventListener('webglcontextlost', onLost);
      renderer.domElement.removeEventListener('webglcontextrestored', onRestored);
      geometry.dispose();
      material.dispose();
      environment.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div className="auth-sci-scene" data-status={status}>
      <div ref={mount} className="auth-sci-mount" />
      {status !== 'ready' && (
        <div className="auth-sci-fallback" role="status">
          <span className="auth-sci-prism" aria-hidden />
          {status === 'lost' ? 'Graphics paused. They will resume when the display recovers.' : null}
        </div>
      )}
    </div>
  );
}
