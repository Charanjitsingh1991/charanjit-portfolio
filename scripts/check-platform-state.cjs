const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');

async function check(rawJson) {
  const existing = {content:{name:'Saved profile'},security:{sessions:[{id:'signed-in'}],recovery:[],passwordHash:'saved-hash'},drafts:{site:{data:{name:'Draft'}}},activity:[],media:[],revisions:[],analytics:{}};
  let saved;
  const db = {$transaction:fn=>fn({$executeRaw:async()=>{},$queryRaw:async()=>[{value:rawJson?JSON.stringify(existing):existing}],siteState:{update:async({data})=>{saved=data.value;}}})};
  const filename = path.resolve('lib/platform-state.ts');
  const compiled = ts.transpileModule(fs.readFileSync(filename,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;
  const module = new Module(filename);
  module.require = id => id==='server-only'?{}:id==='./prisma'?{prisma:db}:id==='./site-content'?{defaultContent:{name:'Default'}}:require(id);
  module._compile(compiled,filename);
  await module.exports.state(s=>{s.content.name='Updated profile';},true);
  assert.equal(saved.content.name,'Updated profile');
  assert.equal(saved.security.sessions[0].id,'signed-in');
  assert.equal(saved.security.passwordHash,'saved-hash');
  assert.equal(saved.drafts.site.data.name,'Draft');
  console.log('PASS database JSON '+(rawJson?'text':'object')+' preserves admin session, password and draft');
}
const prior=process.env.DATABASE_URL;
process.env.DATABASE_URL='mysql://test-only';
(async()=>{try{await check(true);await check(false);}finally{if(prior===undefined)delete process.env.DATABASE_URL;else process.env.DATABASE_URL=prior;}})().catch(error=>{console.error(error);process.exitCode=1;});
