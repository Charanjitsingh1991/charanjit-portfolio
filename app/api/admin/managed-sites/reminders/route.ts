import {NextResponse} from 'next/server';
import {isAdmin,readJson,sameOrigin} from '@/lib/http';
import {sendRenewalReminders,sendTestRenewalReminder} from '@/lib/renewal-reminders';
import {z} from 'zod';
export const dynamic='force-dynamic';
const input=z.discriminatedUnion('action',[z.object({action:z.literal('test'),id:z.string().min(1).max(128)}),z.object({action:z.literal('run')})]);
export async function POST(req:Request){if(!await isAdmin())return NextResponse.json({error:'Unauthorized'},{status:401});if(!sameOrigin(req))return NextResponse.json({error:'Invalid origin'},{status:403});try{const p=input.safeParse(await readJson(req,2000));if(!p.success)return NextResponse.json({error:'Invalid reminder request.'},{status:400});return NextResponse.json(p.data.action==='test'?await sendTestRenewalReminder(p.data.id):await sendRenewalReminders());}catch(e){return NextResponse.json({error:e instanceof Error?e.message:'Could not send reminder.'},{status:503});}}
