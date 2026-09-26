import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
function files(dir) { return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?files(path.join(dir,e.name)):[path.join(dir,e.name)]); }
const source = ['js','scripts','content','tests'].flatMap(files).filter(f=>/\.(m?js)$/.test(f));
for(const file of source)execFileSync(process.execPath,['--check',file],{stdio:'inherit'});
console.log(`Syntax lint passed: ${source.length} scripts. CSS/HTML policy is checked by the production build.`);
