import {readFile,stat} from 'node:fs/promises';
import assert from 'node:assert/strict';
import path from 'node:path';
const root=path.resolve('dist');
const html=await readFile(path.join(root,'index.html'),'utf8');
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
assert.equal(new Set(ids).size,ids.length,'Duplicate element IDs');
for(const [,id] of html.matchAll(/href="#([^"]+)"/g))assert(ids.includes(id),'Missing navigation target '+id);
for(const [,ref] of html.matchAll(/(?:src|href|poster|data-src)="(\/[^"#]+)"/g)){const asset=await stat(path.join(root,ref));assert(asset.isFile(),'Missing asset '+ref)}
for(const [,ref] of html.matchAll(/aria-(?:labelledby|controls)="([^"]+)"/g))for(const id of ref.split(' '))assert(ids.includes(id),'Missing ARIA reference '+id);
assert.equal([...html.matchAll(/<h1[ >]/g)].length,1,'Expected a single H1');
assert.equal([...html.matchAll(/data-solution="/g)].length,7,'Seven solutions required');
assert.equal([...html.matchAll(/data-phase="/g)].length,6,'Six consulting phases required');
JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);
console.log('Validated navigation, assets, ARIA references, content structure and structured metadata.');
