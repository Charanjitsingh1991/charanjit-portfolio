"use client";
import {createContext,useContext} from 'react';import {defaultContent,type SiteContent} from '@/lib/site-content';
const Context=createContext(defaultContent);
export const useSiteContent=()=>useContext(Context);
export default function SiteContentProvider({content,children}:{content:SiteContent;children:React.ReactNode}){return <Context.Provider value={content}>{children}</Context.Provider>;}
