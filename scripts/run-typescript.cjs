// Execute the repository's small maintenance scripts without tsx's OS-user lookup.
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => {
  const { outputText } = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true },
    fileName: filename,
  });
  module._compile(outputText, filename);
};
const script = process.argv[2];
if (!['prisma/seed.ts', 'scripts/sync-local-catalog.ts', 'scripts/refresh-project-presentation.ts'].includes(script)) throw new Error('Unknown maintenance script.');
require(path.resolve(script));
