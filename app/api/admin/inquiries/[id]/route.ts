import {afterInquiry} from '@/lib/visitor-confirmation';import {NextResponse} from 'next/server';import {isAdmin,sameOrigin,readJson} from '@/lib/http';import {updateInquiry,listInquiries} from '@/lib/store';import {notifyInquiry} from '@/lib/email';
export async function PATCH(req:Request,{params}:{params:Promise<{id:string}>}){
 if(!sameOrigin(req)||!await isAdmin())return NextResponse.json({error:'Unauthorized'},{status:401});
 try{const {id}=await params;const body=await readJson(req,12000);if(body.retryEmail){const item=(await listInquiries()).find(i=>i.id===id);if(!item)throw Error();const status=await notifyInquiry(item);await afterInquiry(item);return NextResponse.json({ok:status==='sent',emailStatus:status});}
 if(body.followUp!==undefined&&(typeof body.followUp!=='string'||(body.followUp!==''&&!/^\d{4}-\d{2}-\d{2}$/.test(body.followUp))))throw Error();
 if(!['new','read','contacted','proposal sent','won','closed','replied','archived'].includes(body.status)||typeof body.notes!=='string'||body.notes.length>8000)throw Error();
 return NextResponse.json(await updateInquiry(id,{status:body.status,notes:body.notes,followUp:body.followUp||''}));}catch{return NextResponse.json({error:'Could not update inquiry.'},{status:400});}
}