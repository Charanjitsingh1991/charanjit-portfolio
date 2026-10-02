const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),Module=require('node:module'),ts=require('typescript');
const filename=path.resolve('lib/captcha.ts'),moduleUnderTest=new Module(filename);
moduleUnderTest.require=id=>id==='server-only'?{}:require(id);
moduleUnderTest._compile(ts.transpileModule(fs.readFileSync(filename,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText,filename);
const {verifyCaptcha}=moduleUnderTest.exports,originalFetch=global.fetch,prior={...process.env};
async function check(name,token,result,status){global.fetch=async()=>({ok:true,json:async()=>result});const response=await verifyCaptcha(token,'inquiry');assert.equal(response?.status??200,status);console.log('PASS '+name);}
(async()=>{try{
  process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY='test-site';process.env.RECAPTCHA_SECRET_KEY='test-secret';process.env.SITE_URL='https://thecharanjitsingh.com';
  await check('missing CAPTCHA rejected',undefined,{},400);
  await check('forged CAPTCHA rejected','fake',{success:false},400);
  await check('wrong hostname rejected','token',{success:true,hostname:'attacker.example',action:'inquiry',score:0.9},400);
  await check('verified domain accepted','token',{success:true,hostname:'thecharanjitsingh.com',action:'inquiry',score:0.9},200);
  await check('verified www domain accepted','token',{success:true,hostname:'www.thecharanjitsingh.com',action:'inquiry',score:0.9},200);
  await check('wrong form action rejected','token',{success:true,hostname:'thecharanjitsingh.com',action:'support',score:0.9},400);
  await check('bot risk score rejected','token',{success:true,hostname:'thecharanjitsingh.com',action:'inquiry',score:0.1},400);
  global.fetch=async()=>{throw Error('offline');};assert.equal((await verifyCaptcha('token','inquiry')).status,503);console.log('PASS provider outage blocks submission');
  delete process.env.RECAPTCHA_SECRET_KEY;assert.equal((await verifyCaptcha('token','inquiry')).status,503);console.log('PASS incomplete configuration blocks submission');
}finally{global.fetch=originalFetch;for(const key of ['NEXT_PUBLIC_RECAPTCHA_SITE_KEY','RECAPTCHA_SECRET_KEY','SITE_URL','GOOGLE_CLOUD_PROJECT_ID']){if(prior[key]===undefined)delete process.env[key];else process.env[key]=prior[key];}}})().catch(error=>{console.error(error);process.exitCode=1;});
