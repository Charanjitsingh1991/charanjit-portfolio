import {state,activity} from '@/lib/platform-state';import {uploadsDirectory,uploadsEnabled} from '@/lib/uploads';import {NextResponse} from 'next/server';import {randomUUID} from 'crypto';import {promises as fs} from 'fs';import path from 'path';import {isAdmin,sameOrigin} from '@/lib/http';
export async function POST(req:Request){
 if(!sameOrigin(req)||!await isAdmin())return NextResponse.json({error:'Unauthorized'},{status:401});
 if(Number(req.headers.get('content-length'))>4200000)return NextResponse.json({error:'Use a file smaller than 4 MB.'},{status:413});
 try{const form=await req.formData();const file=form.get('file');if(!(file instanceof File)||file.size>4000000||file.size<12)return NextResponse.json({error:'Choose a PNG, JPEG, WebP, PDF, or MP4 file under 4 MB.'},{status:400});
 const buffer=Buffer.from(await file.arrayBuffer());let extension='';
 if(buffer.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])))extension='png';
 else if(buffer[0]===255&&buffer[1]===216&&buffer[2]===255)extension='jpg';
 else if(buffer.toString('ascii',0,4)==='RIFF'&&buffer.toString('ascii',8,12)==='WEBP')extension='webp';
 else if(buffer.toString('ascii',0,5)==='%PDF-')extension='pdf';
 else if(buffer.toString('ascii',4,8)==='ftyp')extension='mp4';
 if(!extension)return NextResponse.json({error:'Use PNG, JPEG, WebP, PDF, or MP4 files.'},{status:400});
 if(!uploadsEnabled())return NextResponse.json({error:'Set HOSTINGER_UPLOADS=true and configure a persistent UPLOADS_DIR.'},{status:503});
 const name=randomUUID()+'.'+extension;const type=extension==='pdf'?'application/pdf':extension==='mp4'?'video/mp4':extension==='jpg'?'image/jpeg':'image/'+extension;
 const folder=uploadsDirectory();await fs.mkdir(folder,{recursive:true});await fs.writeFile(path.join(folder,name),buffer);const url='/api/media/'+name;
 await state(s=>{s.media.unshift({id:randomUUID(),url,name:file.name.slice(0,160),alt:'',folder:'Unsorted',type,size:file.size,createdAt:new Date().toISOString()});activity(s,'Uploaded '+file.name.slice(0,80));},true);return NextResponse.json({url});
 }catch{return NextResponse.json({error:'Upload failed. Check the Hostinger upload directory and write permissions.'},{status:503});}
}
