"use client";

import {useEffect, useRef} from 'react';
import * as THREE from 'three';

const COLORS: Record<string, number> = {dev: 0x2dd4bf, design: 0xe9b872, data: 0xf472b6, it: 0x8b9df5};

export default function HeroScene({roleRef, paused = false}: {roleRef: React.MutableRefObject<string>; paused?: boolean}) {
  const mount = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const holder = mount.current;
    if (!holder) return;
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, .1, 100);
    camera.position.z = 11;
    let renderer: THREE.WebGLRenderer;
    try {renderer = new THREE.WebGLRenderer({antialias: true, alpha: true, powerPreference: 'low-power'});} catch {return;}
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    holder.appendChild(renderer.domElement);
    const root = new THREE.Group(); scene.add(root);
    const shell = new THREE.Mesh(new THREE.IcosahedronGeometry(2.1, 2), new THREE.MeshBasicMaterial({color: COLORS.dev, wireframe: true, transparent: true, opacity: .65})); root.add(shell);
    const core = new THREE.Mesh(new THREE.OctahedronGeometry(1.38, 1), new THREE.MeshBasicMaterial({color: COLORS.dev, wireframe: true, transparent: true, opacity: .23})); root.add(core);
    const rings = [2.75, 3.1, 3.45].map((radius, index) => {const ring = new THREE.Mesh(new THREE.TorusGeometry(radius, .014, 3, 84), new THREE.MeshBasicMaterial({color: COLORS.dev, transparent: true, opacity: .52 - index * .1})); ring.rotation.set(.45 + index * .35, .3 + index * .5, index * .3); root.add(ring); return ring;});
    const positions = new Float32Array(130 * 3);
    const nodeGeo = new THREE.BufferGeometry(); nodeGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const nodeMat = new THREE.PointsMaterial({color: COLORS.dev, size: .065, transparent: true, opacity: .9});
    const points = new THREE.Points(nodeGeo, nodeMat); root.add(points);
    const grid = new THREE.GridHelper(11, 12, COLORS.dev, COLORS.dev); grid.position.y = -3.5; (grid.material as THREE.Material).transparent = true; (grid.material as THREE.Material).opacity = .13; scene.add(grid);
    let raf = 0, inView = true, reduced = motion.matches, time = 0, mouseX = 0, mouseY = 0;
    function draw() {
      const role = roleRef.current, color = COLORS[role] || COLORS.dev;
      (shell.material as THREE.MeshBasicMaterial).color.setHex(color);
      (core.material as THREE.MeshBasicMaterial).color.setHex(color);
      nodeMat.color.setHex(color);
      rings.forEach(ring => (ring.material as THREE.MeshBasicMaterial).color.setHex(color));
      shell.visible = role !== 'data'; core.visible = role === 'dev' || role === 'design';
      rings.forEach((ring, index) => {ring.visible = role === 'design' || role === 'it' || (role === 'dev' && index === 0); ring.scale.setScalar(role === 'design' ? 1 : role === 'it' ? .87 : .75);});
      points.visible = role === 'data' || role === 'it'; grid.visible = role === 'dev' || role === 'it';
      shell.scale.setScalar(role === 'it' ? 1.1 : role === 'design' ? .8 : 1);
      const position = nodeGeo.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < 130; i++) {
        if (role === 'data') {const a = i * .38 + time * .5, y = (i / 129 - .5) * 6.2; position.setXYZ(i, Math.cos(a) * (1.1 + i % 5 * .19), y, Math.sin(a) * (1.1 + i % 5 * .19));}
        else {const a = i * 2.39996, y = 1 - i / 129 * 2, r = Math.sqrt(1 - y * y); position.setXYZ(i, Math.cos(a) * r * 3.25, y * 3.25, Math.sin(a) * r * 3.25);}
      }
      position.needsUpdate = true;
      root.rotation.y += (mouseX * .35 - root.rotation.y) * .025;
      root.rotation.x += (-mouseY * .2 - root.rotation.x) * .025;
      renderer.render(scene, camera);
    }
    const animate = () => {raf = 0; const running = !paused && !reduced && !document.hidden && inView; if (running) {time += .012; shell.rotation.y += .003; core.rotation.x += .003; rings.forEach((ring, i) => ring.rotation.z += (i % 2 ? -1 : 1) * .0015);} draw(); if (running) raf = requestAnimationFrame(animate);};
    const restart = () => {cancelAnimationFrame(raf); animate();};
    const resize = () => {const w = holder.clientWidth, h = holder.clientHeight; if (!w || !h) return; camera.aspect = w / h; camera.updateProjectionMatrix(); renderer.setSize(w, h); restart();};
    const onMove = (event: PointerEvent) => {const rect = holder.getBoundingClientRect(); mouseX = (event.clientX - rect.left) / rect.width - .5; mouseY = (event.clientY - rect.top) / rect.height - .5;};
    const onMotion = () => {reduced = motion.matches; restart();};
    const observer = new IntersectionObserver(entries => {inView = entries[0]?.isIntersecting ?? false; restart();}); observer.observe(holder);
    const mutation = new MutationObserver(restart); mutation.observe(document.documentElement, {attributes: true, attributeFilter: ['data-role']});
    holder.addEventListener('pointermove', onMove, {passive: true}); window.addEventListener('resize', resize); document.addEventListener('visibilitychange', restart); motion.addEventListener('change', onMotion);
    resize();
    return () => {cancelAnimationFrame(raf); observer.disconnect(); mutation.disconnect(); holder.removeEventListener('pointermove', onMove); window.removeEventListener('resize', resize); document.removeEventListener('visibilitychange', restart); motion.removeEventListener('change', onMotion); scene.traverse(object => {if (object instanceof THREE.Mesh || object instanceof THREE.Points || object instanceof THREE.GridHelper) {object.geometry?.dispose(); const materials = Array.isArray(object.material) ? object.material : [object.material]; materials.forEach(material => material?.dispose());}}); renderer.dispose(); renderer.domElement.remove();};
  }, [roleRef, paused]);
  return <div id="three-bg" ref={mount} aria-hidden="true"/>;
}
