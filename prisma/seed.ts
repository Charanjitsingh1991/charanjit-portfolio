import {PrismaClient,Prisma} from '@prisma/client';
import {catalog} from '../lib/catalog';

const prisma=new PrismaClient();
const presentationOverrides:Record<string,{featured:boolean;order:number;repoUrl?:string|null}>={
 'privydesk-support-suite':{featured:true,order:0,repoUrl:null},
 'eili-platform':{featured:false,order:1},
 'project-cartographer':{featured:false,order:2},
 'nexqr':{featured:false,order:3},
 'pingbase':{featured:false,order:4},
 'elyndor-ai':{featured:false,order:5},
 'ajooba-llc-website':{featured:false,order:6},
};

async function main(){
 for(const {id,...project} of catalog){
  const presentation=presentationOverrides[project.slug]||{};
  await prisma.project.upsert({where:{slug:project.slug},update:presentation,create:{...project,...presentation,gallery:project.gallery as Prisma.InputJsonValue}});
 }
 console.log('Portfolio catalog imported. Existing editorial edits preserved; requested project order applied.');
}
main().catch(e=>{console.error(e);process.exitCode=1;}).finally(()=>prisma.$disconnect());
