import fs from 'node:fs';
import { domHash } from './lib/parity.mjs';
const file='content/audit-parity.json';
const records=fs.existsSync(file)?JSON.parse(fs.readFileSync(file,'utf8')):{};
const [reason,...pages]=process.argv.slice(2);
if(!reason || !pages.length)throw new Error('Usage: node scripts/record-audit-parity.mjs reason page.html ...');
for(const page of pages)records[page]={hash:domHash(fs.readFileSync('_site/'+page,'utf8')),reason};
fs.writeFileSync(file,JSON.stringify(records,null,2)+'\n');
