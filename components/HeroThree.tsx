"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";

const ROLE_HEX: Record<string, number> = {
  dev: 0x2dd4bf, design: 0xe9b872, it: 0x8b9df5, data: 0xf472b6,
};

export default function HeroThree({ roleRef }: { roleRef: React.MutableRefObject<string> }) {
  const mount = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const holder = mount.current!;
    let raf = 0;
    const scene = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(60, holder.clientWidth / holder.clientHeight, 0.1, 100);
    cam.position.z = 8;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(holder.clientWidth, holder.clientHeight);
    holder.appendChild(renderer.domElement);

    const COLS = 110, ROWS = 60, N = COLS * ROWS;
    const pos = new Float32Array(N * 3);
    let i3 = 0;
    for (let y = 0; y < ROWS; y++)
      for (let x = 0; x < COLS; x++) {
        pos[i3++] = (x / COLS - 0.5) * 26;
        pos[i3++] = (y / ROWS - 0.5) * 14;
        pos[i3++] = 0;
      }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({ color: 0x2dd4bf, size: 0.035, transparent: true, opacity: 0.55 });
    const points = new THREE.Points(geo, mat);
    points.rotation.x = -0.9;
    points.position.y = -2.2;
    scene.add(points);

    const ico = new THREE.Mesh(
      new THREE.IcosahedronGeometry(2.1, 1),
      new THREE.MeshBasicMaterial({ color: 0x2dd4bf, wireframe: true, transparent: true, opacity: 0.16 })
    );
    ico.position.set(4.1, 1.1, -1);
    scene.add(ico);

    let mx = 0, my = 0;
    const onMove = (e: MouseEvent) => { mx = e.clientX / innerWidth - 0.5; my = e.clientY / innerHeight - 0.5; };
    addEventListener("mousemove", onMove, { passive: true });

    const arr = geo.attributes.position.array as Float32Array;
    let t = 0, currentRole = "";
    const animate = () => {
      raf = requestAnimationFrame(animate);
      const role = roleRef.current;
      if (role !== currentRole) {
        currentRole = role;
        const hex = ROLE_HEX[role] ?? 0x2dd4bf;
        mat.color.setHex(hex);
        (ico.material as THREE.MeshBasicMaterial).color.setHex(hex);
      }
      t += reduced ? 0 : 0.012;
      let i = 0;
      for (let y = 0; y < ROWS; y++)
        for (let x = 0; x < COLS; x++) {
          const px = arr[i], py = arr[i + 1];
          arr[i + 2] = Math.sin(px * 0.55 + t) * Math.cos(py * 0.7 + t * 0.8) * 0.65;
          i += 3;
        }
      geo.attributes.position.needsUpdate = true;
      ico.rotation.x += 0.0016; ico.rotation.y += 0.0022;
      cam.position.x += (mx * 1.3 - cam.position.x) * 0.04;
      cam.position.y += (-my * 0.9 - cam.position.y) * 0.04;
      cam.lookAt(0, -0.4, 0);
      renderer.render(scene, cam);
    };
    animate();

    const onResize = () => {
      cam.aspect = holder.clientWidth / holder.clientHeight;
      cam.updateProjectionMatrix();
      renderer.setSize(holder.clientWidth, holder.clientHeight);
    };
    addEventListener("resize", onResize);

    const io = new IntersectionObserver(
      (es) => es.forEach((e) => {
        if (e.isIntersecting) { if (!raf) animate(); }
        else { cancelAnimationFrame(raf); raf = 0; }
      }), { threshold: 0 }
    );
    io.observe(holder);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      removeEventListener("mousemove", onMove);
      removeEventListener("resize", onResize);
      renderer.dispose();
      geo.dispose();
      holder.innerHTML = "";
    };
  }, [roleRef]);

  return <div id="three-bg" ref={mount} />;
}
