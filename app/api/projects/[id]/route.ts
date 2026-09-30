import {NextResponse} from 'next/server';
import {recordRevision} from '@/lib/platform-state';
import {saveProject,deleteProject,listProjects} from '@/lib/store';
import {isAdmin,sameOrigin,readJson} from '@/lib/http';
import {projectSchema} from '@/lib/validation';
type Context={params:Promise<{id:string}>};
export async function PUT(req:Request,ctx:Context){
 if(!sameOrigin(req)||!await isAdmin())return NextResponse.json({error:'Unauthorized'},{status:401});
 try{const id=Number((await ctx.params).id);if(!Number.isSafeInteger(id)||id<1)throw Error();const result=projectSchema.safeParse(await readJson(req));if(!result.success)return NextResponse.json({error:result.error.issues[0].path.join('.')+': '+result.error.issues[0].message},{status:400});const prior=(await listProjects(true)).find(p=>p.id===id);if(prior)await recordRevision('project',String(id),'Updated '+prior.title,prior);return NextResponse.json(await saveProject(result.data,id));}catch{return NextResponse.json({error:'Update failed. Check the slug and project details.'},{status:400});}
}
export async function DELETE(req:Request,ctx:Context){
 if(!sameOrigin(req)||!await isAdmin())return NextResponse.json({error:'Unauthorized'},{status:401});
 try{const id=Number((await ctx.params).id);if(!Number.isSafeInteger(id)||id<1)throw Error();const prior=(await listProjects(true)).find(p=>p.id===id);if(prior)await recordRevision('project',String(id),'Moved to trash: '+prior.title,prior);await deleteProject(id);return NextResponse.json({ok:true});}catch{return NextResponse.json({error:'Could not delete this project.'},{status:400});}
}