import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export interface ThreeBgProps {
  mode?: 'orb' | 'wave';
  color1?: string;
  color2?: string;
  opacity?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * React port of three-bg.js — a GPU particle ambient background.
 * "orb": 2,800 additive-blended points on a jittered sphere shell, slow
 *        rotation + sine breathing, damped mouse parallax.
 * "wave": 130x62 point grid animated as a rolling sine/cosine surface,
 *         camera drifts with the cursor.
 * Fills its parent box — wrap in a positioned container with a fixed size.
 */
export default function ThreeBg({
  mode = 'orb',
  color1 = '#22c55e',
  color2 = '#a855f7',
  opacity,
  className,
  style,
}: ThreeBgProps) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const c1 = new THREE.Color(color1);
    const c2 = new THREE.Color(color2);
    const alpha = opacity ?? (mode === 'wave' ? 0.8 : 0.9);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.domElement.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;';
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);

    let geo: THREE.BufferGeometry;
    let mat: THREE.PointsMaterial;
    let points: THREE.Points;

    if (mode === 'wave') {
      camera.position.set(0, 2.3, 6);
      camera.lookAt(0, 0, 0);
      const W = 130;
      const H = 62;
      const N = W * H;
      const pos = new Float32Array(N * 3);
      const col = new Float32Array(N * 3);
      let i = 0;
      for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
          pos[i * 3] = (x / W - 0.5) * 17;
          pos[i * 3 + 1] = 0;
          pos[i * 3 + 2] = (y / H - 0.5) * 9;
          const c = c1.clone().lerp(c2, x / W);
          col[i * 3] = c.r;
          col[i * 3 + 1] = c.g;
          col[i * 3 + 2] = c.b;
          i++;
        }
      }
      geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
      mat = new THREE.PointsMaterial({
        size: 0.034,
        vertexColors: true,
        transparent: true,
        opacity: alpha,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
    } else {
      camera.position.set(0, 0, 4.2);
      const N = 2800;
      const pos = new Float32Array(N * 3);
      const col = new Float32Array(N * 3);
      for (let i = 0; i < N; i++) {
        const u = Math.random();
        const v = Math.random();
        const theta = 2 * Math.PI * u;
        const phi = Math.acos(2 * v - 1);
        const shell = Math.random() < 0.85 ? 1.5 : 1.05 + Math.random() * 0.3;
        const r = shell + (Math.random() - 0.5) * 0.07;
        pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        pos[i * 3 + 2] = r * Math.cos(phi);
        const c = c1.clone().lerp(c2, Math.random());
        col[i * 3] = c.r;
        col[i * 3 + 1] = c.g;
        col[i * 3 + 2] = c.b;
      }
      geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
      mat = new THREE.PointsMaterial({
        size: 0.021,
        vertexColors: true,
        transparent: true,
        opacity: alpha,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
    }
    points = new THREE.Points(geo, mat);
    scene.add(points);

    const basePos = geo.attributes.position.array.slice() as Float32Array;
    const clock = new THREE.Clock();
    let mx = 0;
    let my = 0;
    let tmx = 0;
    let tmy = 0;

    const onMouse = (e: MouseEvent) => {
      const r = host.getBoundingClientRect();
      tmx = (e.clientX - r.left) / Math.max(r.width, 1) - 0.5;
      tmy = (e.clientY - r.top) / Math.max(r.height, 1) - 0.5;
    };
    window.addEventListener('mousemove', onMouse);

    const resize = () => {
      const w = host.clientWidth || 1;
      const h = host.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);

    let raf = 0;
    const tick = () => {
      const t = clock.getElapsedTime();
      mx += (tmx - mx) * 0.04;
      my += (tmy - my) * 0.04;
      if (mode === 'wave') {
        const arr = geo.attributes.position.array as Float32Array;
        for (let i = 0; i < arr.length; i += 3) {
          const x = basePos[i];
          const z = basePos[i + 2];
          arr[i + 1] = Math.sin(x * 0.85 + t * 0.9) * 0.22 + Math.cos(z * 1.25 + t * 0.65) * 0.18;
        }
        geo.attributes.position.needsUpdate = true;
        camera.position.x = mx * 1.1;
        camera.position.y = 2.3 - my * 0.5;
        camera.lookAt(0, 0, 0);
      } else {
        points.rotation.y = t * 0.12 + mx * 0.5;
        points.rotation.x = Math.sin(t * 0.15) * 0.18 + my * 0.35;
        const s = 1 + Math.sin(t * 0.8) * 0.02;
        points.scale.set(s, s, s);
      }
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('mousemove', onMouse);
      geo.dispose();
      mat.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === host) host.removeChild(renderer.domElement);
    };
  }, [mode, color1, color2, opacity]);

  return (
    <div
      ref={hostRef}
      className={className}
      style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', display: 'block', ...style }}
    />
  );
}
