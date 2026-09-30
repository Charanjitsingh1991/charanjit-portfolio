"use client";
import {useEffect} from 'react';import {usePathname} from 'next/navigation';import {useSiteContent} from './SiteContentProvider';
export default function Analytics(){const path=usePathname();const {analyticsEnabled}=useSiteContent();useEffect(()=>{if(!analyticsEnabled||path.startsWith('/admin')||navigator.doNotTrack==='1')return;fetch('/api/analytics',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({path}),keepalive:true}).catch(()=>{});},[path,analyticsEnabled]);return null;}
