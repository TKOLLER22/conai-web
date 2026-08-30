"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, useGLTF } from "@react-three/drei";
import { ScrollSmoother } from "@/lib/gsap";
import { useEffect, useRef, useState } from "react";
import type { Group, Mesh, MeshStandardMaterial } from "three";

const MODEL_URL = "/models/conai-icon.glb";

const BASE_SCALE = 1.85;
const BASE_TILT = 0.16;

function Icon() {
  const group = useRef<Group>(null);
  const { scene } = useGLTF(MODEL_URL);
  // Entrance: lerp scale up from 0 after mount.
  const entrance = useRef(0);

  useEffect(() => {
    scene.traverse((obj) => {
      const mesh = obj as Mesh;
      if (mesh.isMesh) {
        const mat = mesh.material as MeshStandardMaterial;
        mat.envMapIntensity = 1.5;
        mat.roughness = 0.24;
      }
    });
  }, [scene]);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;

    entrance.current = Math.min(entrance.current + delta * 1.2, 1);
    const eased = 1 - Math.pow(1 - entrance.current, 3);
    g.scale.setScalar(eased * BASE_SCALE);

    // Idle spin + gentle bob + pointer parallax (lerped) + scroll rotation.
    // Read the smoothed position when ScrollSmoother is active so the icon
    // reacts to the same signal that moves the visible layout.
    const { x, y } = state.pointer;
    const scrollY = ScrollSmoother.get()?.scrollTop() ?? window.scrollY;
    const scroll = scrollY / window.innerHeight;
    g.rotation.y += delta * 0.22;
    g.rotation.x +=
      (BASE_TILT + y * -0.16 + scroll * 0.3 - g.rotation.x) * 0.04;
    g.rotation.z += (x * 0.07 - g.rotation.z) * 0.04;
    g.position.y = Math.sin(state.clock.elapsedTime * 0.7) * 0.07;
  });

  return (
    <group ref={group} scale={0}>
      <primitive object={scene} />
    </group>
  );
}

export default function Hero3D({ className = "" }: { className?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  // Stop rendering entirely while the hero is offscreen or the tab is hidden.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    let intersecting = true;
    const update = () => setVisible(intersecting && !document.hidden);
    const io = new IntersectionObserver(
      ([entry]) => {
        intersecting = entry.isIntersecting;
        update();
      },
      { rootMargin: "80px" },
    );
    io.observe(el);
    document.addEventListener("visibilitychange", update);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, []);

  return (
    <div ref={wrapRef} className={className} aria-hidden>
      <Canvas
        dpr={[1, 1.75]}
        frameloop={visible ? "always" : "never"}
        camera={{ position: [0, 0, 3.9], fov: 38 }}
        gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
        style={{ background: "transparent" }}
      >
        <Icon />
        {/* Generated environment — no HDR download. Sells the purple metal. */}
        <directionalLight position={[4, 5, 6]} intensity={1.4} color="#ffffff" />
        <directionalLight position={[-5, -2, 4]} intensity={0.5} color="#9e9eff" />
        <Environment resolution={128}>
          <Lightformer
            intensity={5}
            position={[3, 2.5, 3]}
            scale={[5, 5, 1]}
            color="#e9e2ff"
          />
          <Lightformer
            intensity={3.5}
            position={[-4, -1, 2.5]}
            scale={[3.5, 6, 1]}
            color="#9e9eff"
          />
          <Lightformer
            intensity={7}
            position={[0, 5, -3]}
            scale={[8, 2.5, 1]}
            color="#ffffff"
          />
          <Lightformer
            intensity={2.5}
            position={[0, -4, 2]}
            scale={[6, 2.5, 1]}
            color="#c4b5fd"
          />
        </Environment>
      </Canvas>
    </div>
  );
}

useGLTF.preload(MODEL_URL);
