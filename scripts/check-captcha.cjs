const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),Module=require('node:module'),ts=require('typescript');
const filename=path.resolve('lib/captcha.ts'),moduleUnderTest=new Module(filename);
moduleUnderTest.require=id=>id==='server-only'?{}:require(id);
moduleUnderTest._compile(ts.transpileModule(fs.readFileSync(filename,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText,filename);
const {verifyCaptcha}=moduleUnderTest.exports,originalFetch=global.fetch,prior={...process.env};
const good={tokenProperties:{valid:true,hostname:'thecharanjitsingh.com',action:'inquiry'},riskAnalysis:{score:0.9}};
async function check(name,token,result,status){global.fetch=async(url,options)=>{assert.match(url,/recaptchaenterprise\.googleapis\.com\/v1\/projects\/test-project\/assessments\?key=test-api-key/);if(options){const body=JSON.parse(options.body);assert.equal(body.event.siteKey,'test-site');assert.equal(body.event.expectedAction,'inquiry');assert.equal(body.event.token,token);}return{ok:true,json:async()=>result};};const response=await verifyCaptcha(token,'inquiry');assert.equal(response?.status??200,status);console.log('PASS '+name);}
(async()=>{try{
  process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY='test-site';process.env.RECAPTCHA_ENTERPRISE_API_KEY='test-api-key';process.env.RECAPTCHA_ENTERPRISE_PROJECT_ID='test-project';process.env.SITE_URL='https://thecharanjitsingh.com';
  await check('missing CAPTCHA rejected',undefined,{},400);
  await check('forged CAPTCHA rejected','fake',{tokenProperties:{valid:false},riskAnalysis:{score:0.9}},400);
  await check('wrong hostname rejected','token',{...good,tokenProperties:{...good.tokenProperties,hostname:'attacker.example'}},400);
  await check('verified domain accepted','token',good,200);
  await check('verified www domain accepted','token',{...good,tokenProperties:{...good.tokenProperties,hostname:'www.thecharanjitsingh.com'}},200);
  await check('wrong form action rejected','token',{...good,tokenProperties:{...good.tokenProperties,action:'support'}},400);
  await check('bot risk score rejected','token',{...good,riskAnalysis:{score:0.1}},400);
  global.fetch=async()=>({ok:false,status:403});assert.equal((await verifyCaptcha('token','inquiry')).status,503);console.log('PASS API authentication/configuration error handled');
  global.fetch=async()=>{throw Error('offline');};assert.equal((await verifyCaptcha('token','inquiry')).status,503);console.log('PASS provider outage blocks submission');
  delete process.env.RECAPTCHA_ENTERPRISE_API_KEY;assert.equal((await verifyCaptcha('token','inquiry')).status,503);console.log('PASS incomplete configuration blocks submission');
  delete process.env.RECAPTCHA_ENTERPRISE_API_KEY;delete process.env.RECAPTCHA_ENTERPRISE_PROJECT_ID;delete process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;assert.equal(await verifyCaptcha('token','inquiry'),null);console.log('PASS CAPTCHA-disabled local mode');
}finally{global.fetch=originalFetch;for(const key of ['NEXT_PUBLIC_RECAPTCHA_SITE_KEY','RECAPTCHA_ENTERPRISE_API_KEY','RECAPTCHA_ENTERPRISE_PROJECT_ID','RECAPTCHA_SECRET_KEY','SITE_URL']){if(prior[key]===undefined)delete process.env[key];else process.env[key]=prior[key];}}})().catch(error=>{console.error(error);process.exitCode=1;});
