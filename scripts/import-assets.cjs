const fs = require('fs');
const source = fs.readFileSync('prisma/seed.ts','utf8');
const literal = source.slice(source.indexOf('const projects = ') + 17, source.indexOf('\n];') + 2);
const rows = Function('return ' + literal)();
fs.writeFileSync('lib/legacy-projects.json', JSON.stringify(rows,null,2));
(async()=>{for(const p of rows){try{const url=p.coverImage.replace('https://thecharanjitsingh.com','https://www.thecharanjitsingh.com');const r=await fetch(url,{signal:AbortSignal.timeout(18000)});if(!r.ok || !r.headers.get('content-type')?.startsWith('image/'))throw Error('HTTP '+r.status);fs.writeFileSync('public/work/'+p.slug+'.png',Buffer.from(await r.arrayBuffer()));console.log('Saved',p.slug)}catch(e){console.log('Unavailable',p.slug,e.message)}}})();
