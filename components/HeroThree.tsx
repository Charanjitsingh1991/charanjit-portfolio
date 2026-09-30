"use client";
import {useEffect,useRef} from 'react';import * as THREE from 'three';
const ROLE_HEX:Record<string,number>={dev:0x2dd4bf,design:0xe9b872,it:0x8b9df5,data:0xf472b6};
export default function HeroThree({roleRef,paused=false}:{roleRef:React.MutableRefObject<string>;paused?:boolean}){
 const mount=useRef<HTMLDivElement>(null);
 useEffect(()=>{const holder=mount.current;if(!holder)return;const motion=matchMedia('(prefers-reduced-motion: reduce)');let reduced=motion.matches,raf=0,inView=true;const scene=new THREE.Scene();const cam=new THREE.PerspectiveCamera(60,holder.clientWidth/holder.clientHeight,.1,100);cam.position.z=8;let renderer:THREE.WebGLRenderer;
 try{renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});}catch{return;}
 renderer.setPixelRatio(Math.min(devicePixelRatio,innerWidth<700?1.5:2));renderer.setSize(holder.clientWidth,holder.clientHeight);holder.appendChild(renderer.domElement);
 const cols=innerWidth<700?70:110,rows=innerWidth<700?40:60;const pos=new Float32Array(cols*rows*3);let i=0;for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){pos[i++]=(x/cols-.5)*26;pos[i++]=(y/rows-.5)*14;pos[i++]=0;}
 const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(pos,3));const mat=new THREE.PointsMaterial({color:0x2dd4bf,size:.035,transparent:true,opacity:.55});const points=new THREE.Points(geo,mat);points.rotation.x=-.9;points.position.y=-2.2;scene.add(points);
 const icoGeo=new THREE.IcosahedronGeometry(2.1,1),icoMat=new THREE.MeshBasicMaterial({color:0x2dd4bf,wireframe:true,transparent:true,opacity:.16}),ico=new THREE.Mesh(icoGeo,icoMat);ico.position.set(4.1,1.1,-1);scene.add(ico);
 let mx=0,my=0,t=0;
 const render=()=>{raf=0;const animate=!reduced&&!paused&&!document.hidden&&inView;const hex=ROLE_HEX[roleRef.current]??0x2dd4bf;mat.color.setHex(hex);icoMat.color.setHex(hex);if(animate)t+=.012;for(let j=0;j<pos.length;j+=3)pos[j+2]=Math.sin(pos[j]*.55+t)*Math.cos(pos[j+1]*.7+t*.8)*.65;geo.attributes.position.needsUpdate=true;if(animate){ico.rotation.x+=.0016;ico.rotation.y+=.0022;cam.position.x+=(mx*1.3-cam.position.x)*.04;cam.position.y+=(-my*.9-cam.position.y)*.04;}cam.lookAt(0,-.4,0);renderer.render(scene,cam);if(animate)raf=requestAnimationFrame(render);};
 const restart=()=>{cancelAnimationFrame(raf);render();};
 const onMove=(e:MouseEvent)=>{mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5;};
 const onResize=()=>{cam.aspect=holder.clientWidth/holder.clientHeight;cam.updateProjectionMatrix();renderer.setSize(holder.clientWidth,holder.clientHeight);restart();};
 const onMotion=()=>{reduced=motion.matches;restart();};
 const io=new IntersectionObserver(es=>{inView=es[0].isIntersecting;if(inView)restart();else{cancelAnimationFrame(raf);raf=0;}});io.observe(holder);
 const mutation=new MutationObserver(()=>{if(!raf)render();});mutation.observe(document.documentElement,{attributes:true,attributeFilter:['data-role']});
 addEventListener('mousemove',onMove,{passive:true});addEventListener('resize',onResize);document.addEventListener('visibilitychange',restart);motion.addEventListener('change',onMotion);render();
 return()=>{cancelAnimationFrame(raf);io.disconnect();mutation.disconnect();removeEventListener('mousemove',onMove);removeEventListener('resize',onResize);document.removeEventListener('visibilitychange',restart);motion.removeEventListener('change',onMotion);geo.dispose();mat.dispose();icoGeo.dispose();icoMat.dispose();renderer.dispose();renderer.domElement.remove();};
 },[roleRef,paused]);return <div id="three-bg" ref={mount} aria-hidden="true"/>;
}