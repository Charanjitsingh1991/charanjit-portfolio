import {NextResponse} from 'next/server';
import {listProjects,saveProject} from '@/lib/store';
import {isAdmin,sameOrigin,readJson} from '@/lib/http';
import {projectSchema} from '@/lib/validation';
export const dynamic='force-dynamic';
export async function GET(){try{return NextResponse.json(await listProjects());}catch{return NextResponse.json({error:'Projects are temporarily unavailable.'},{status:503});}}
export async function POST(req:Request){
 if(!sameOrigin(req)||!await isAdmin())return NextResponse.json({error:'Unauthorized'},{status:401});
 try{const result=projectSchema.safeParse(await readJson(req));if(!result.success)return NextResponse.json({error:result.error.issues[0].path.join('.')+': '+result.error.issues[0].message},{status:400});return NextResponse.json(await saveProject(result.data),{status:201});}
 catch{return NextResponse.json({error:'Could not save. Check that the slug is unique and storage is available.'},{status:400});}
}