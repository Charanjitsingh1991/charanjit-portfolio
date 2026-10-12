import {PrismaClient,Prisma} from '@prisma/client';
import {catalog,type Project} from '../lib/catalog';

const prisma=new PrismaClient();
const presentationOverrides:Record<string,Partial<Project>>={
 'privydesk-support-suite':{featured:true,order:0,repoUrl:null,coverImage:'/work/covers/privydesk-live.png',coverAlt:'Screenshot of the live PrivyDesk customer support platform homepage'},
 'noor-al-quran':{featured:false,order:1,coverImage:'/work/covers/noor-quran-live-520.png',coverAlt:'Mobile screenshot of the live Noor Al Quran reading companion',seoTitle:'Noor Al Quran | Multilingual Quran Reading App',seoDescription:'A mobile-first Quran reading companion with Arabic, English, Hindi, and Urdu, plus an Android app download.'},
 'adore-by-mmk':{featured:false,order:2,coverImage:'/work/covers/adore-by-mmk-live.png',coverAlt:'Live Adore by MMK made-to-measure clothing boutique website',seoTitle:'Adore by MMK | Made-to-Measure Clothing Boutique',seoDescription:'A designer-led clothing boutique for custom pieces, collections, and occasion wear.'},
 'globalwatch':{featured:false,order:3,coverImage:'/work/covers/globalwatch-live.png',coverAlt:'Live GlobalWatch intelligence dashboard',seoTitle:'GlobalWatch | Global Intelligence Dashboard',seoDescription:'A dashboard bringing global security signals, news, markets, flight activity, and live media into one view.'},
 'medical-analysis':{featured:false,order:4,published:true,liveUrl:'https://medical-analysis-two.vercel.app/',coverImage:'/work/covers/medical-analysis-live.png',coverAlt:'Live Medical Analysis report explainer website',description:'A medical report analysis experience that helps people understand blood tests, MRI results, and lab reports with clear, AI-assisted explanations.',tech:'AI-assisted analysis,Medical reports,Responsive web app',client:'Medical Analysis',role:'Product design & application development',challenge:'Make complex medical reports easier to understand while keeping the upload and analysis journey clear.',solution:'Designed a report-analysis flow for blood tests, MRI scans, and lab results, with a sample report and privacy cues.',outcome:'A live medical analysis product website presenting report upload and explanation workflows.',seoTitle:'Medical Analysis | Understand Your Medical Reports',seoDescription:'An AI-assisted product experience for understanding blood tests, MRI results, and lab reports.'},
 'health-nexus-ai':{featured:false,order:5,published:true,liveUrl:'https://health-nexus-ai.vercel.app/',coverImage:'/work/covers/health-nexus-ai-live.png',coverAlt:'Live Health Nexus AI healthcare platform website',description:'A healthcare AI operations platform showcasing workflows for patient verification, clinical documentation, medical coding, crisis triage, and population health.',tech:'Healthcare AI workflows,EHR integrations,Clinical operations',client:'Health Nexus AI',role:'Product design & platform development',challenge:'Present multiple healthcare operations workflows in one clear, modern product experience.',solution:'Built a healthcare platform website around AI-agent workflows, EHR connectivity, compliance, and operational status dashboards.',outcome:'A live healthcare AI platform website describing eight coordinated operational agents.',seoTitle:'Health Nexus AI | Healthcare Operations Platform',seoDescription:'A healthcare AI platform website showcasing patient verification, clinical documentation, coding, and related workflows.'},
 'elyndor-ai':{featured:false,order:6,liveUrl:'https://elyndor-ai.vercel.app/',coverImage:'/work/covers/elyndor-ai-live.png',coverAlt:'Live Elyndor AI market research platform website',description:'An AI-powered market research platform featuring KIRA, live market signals, and analysis with buy, sell, or hold verdicts, confidence scores, entry levels, and stop-loss guidance.',tech:'AI market research,Financial analytics,Live market dashboard',role:'Product design & platform development',challenge:'Make institutional-style market research and decision signals easier to explore through one accessible interface.',solution:'Created a live market research experience with a streaming ticker, analysis entry point, confidence-led verdicts, and market overview metrics.',outcome:'A live AI market research product website with an interactive analysis experience.',seoTitle:'Elyndor AI | AI-Powered Market Research',seoDescription:'An AI market research platform featuring live market signals and analysis workflows.'},
 'eili-platform':{featured:false,order:7},
 'project-cartographer':{featured:false,order:8},
 'nexqr':{featured:false,order:9,coverImage:'/work/covers/nexqr-live.png',coverAlt:'Live NexQR dynamic QR code platform website',seoTitle:'NexQR | AI QR Code Generator & Analytics',seoDescription:'Create customizable dynamic QR codes, use AI design suggestions, and track scan analytics with NexQR.'},
 'pingbase':{featured:false,order:10,coverImage:'/work/covers/pingbase-live.png',coverAlt:'Live PingBase status page and uptime monitoring website',seoTitle:'PingBase | Status Pages & Uptime Monitoring',seoDescription:'Monitor service health, manage incidents, and keep customers informed with PingBase status pages.'},
 'ajooba-llc-website':{featured:false,order:11},
};

for(const slug of ['noor-al-quran','adore-by-mmk','globalwatch','medical-analysis','health-nexus-ai','elyndor-ai','nexqr','pingbase']){
 const project=catalog.find(item=>item.slug===slug);
 if(!project)continue;
 const details=Object.fromEntries(Object.entries(project).filter(([key])=>!['id','slug','gallery'].includes(key))) as Partial<Project>;
 presentationOverrides[slug]={...details,...presentationOverrides[slug]};
}

async function main(){
 for(const {id,...project} of catalog){
  const presentation=presentationOverrides[project.slug]||{};
  await prisma.project.upsert({where:{slug:project.slug},update:presentation,create:{...project,...presentation,gallery:project.gallery as Prisma.InputJsonValue}});
 }
 console.log('Portfolio catalog imported. Existing editorial edits preserved; requested project order applied.');
}
main().catch(e=>{console.error(e);process.exitCode=1;}).finally(()=>prisma.$disconnect());
