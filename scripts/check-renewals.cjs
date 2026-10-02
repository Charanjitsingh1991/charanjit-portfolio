const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),Module=require('node:module'),ts=require('typescript');
function load(name,mocks={}){const filename=path.resolve(name),m=new Module(filename);m.require=id=>id in mocks?mocks[id]:require(id);m._compile(ts.transpileModule(fs.readFileSync(filename,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText,filename);return m.exports;}
const forecast=load('lib/renewal-forecast.ts');
const site={id:'test',label:'Client website',clientName:'Client',url:'https://example.com',domainRenewal:'2026-10-22T00:00:00Z',serverRenewal:'2026-10-30T00:00:00Z',domainCharge:120.10,serverCharge:300.20,active:true,notes:'Domain renewal AED 120.10',reminderLog:{}};
assert.equal(forecast.dubaiDate(new Date('2026-10-01T21:00:00Z')),'2026-10-02');
assert.equal(forecast.renewalDays(site.domainRenewal,new Date('2026-10-01T21:00:00Z')),20);
assert.equal(forecast.renewalForecast([site],'2026-10').total,420.30);
assert.equal(forecast.renewalForecast([site],'2026-11').total,0);
assert.equal(forecast.renewalForecast([{...site,active:false}],'2026-10').entries.length,0);
assert.equal(forecast.renewalForecast([{...site,domainCharge:null}],'2026-10').missing,1);
const mails=[],logs=[];process.env.CONTACT_EMAIL='admin@example.com';
const reminders=load('lib/renewal-reminders.ts',{'server-only':{},'./renewal-forecast':forecast,'./managed-sites':{listManagedSites:async()=>[site],getManagedSite:async()=>site,setReminderLog:async(id,log)=>logs.push({...log})},'./smtp':{smtpConfigured:()=>true,sendMail:async mail=>mails.push(mail)}});
(async()=>{
await reminders.sendTestRenewalReminder('test');assert.equal(logs.length,0);assert.match(mails[0].text,/120\.10/);assert.match(mails[0].text,/300\.20/);assert.match(mails[0].text,/Private notes:\nDomain renewal AED/);assert.equal(mails[0].to,'admin@example.com');
assert.equal((await reminders.sendRenewalReminders(new Date('2026-10-02T00:00:00Z'))).sent,1);
assert.equal((await reminders.sendRenewalReminders(new Date('2026-10-02T12:00:00Z'))).sent,0);
assert.equal((await reminders.sendRenewalReminders(new Date('2026-10-03T00:00:00Z'))).sent,0);
assert.equal(logs.length,1);console.log('PASS renewal charges, exact monthly totals, missing amounts, inactive sites, UAE midnight, email notes, admin recipient, test isolation and duplicate reminders');
})().catch(e=>{console.error(e);process.exitCode=1;});
