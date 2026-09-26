import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import path from 'node:path';
import worker from '../dist/_worker.js';
const root=path.resolve('dist');
const port=Number(process.env.PORT||5173);
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'application/javascript; charset=utf-8','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.mp4':'video/mp4','.webm':'video/webm','.svg':'image/svg+xml','.woff2':'font/woff2','.ttf':'font/ttf','.xml':'application/xml','.txt':'text/plain'};
http.createServer(async(req,res)=>{
  try {
    const url=new URL(req.url,'http://localhost');
    if(url.pathname==='/api/locale') {
      // Local preview has no public IP geolocation. Optional country is for QA only.
      const response=await worker.fetch({url:url.href,method:req.method,cf:{country:process.env.MAP_PREVIEW_COUNTRY}},{});
      res.writeHead(response.status,Object.fromEntries(response.headers));res.end(await response.text());return;
    }
    const pathname=decodeURIComponent(url.pathname);
    if(pathname.startsWith('/_')) {res.writeHead(404).end();return;}
    const file=path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));
    if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}
    const info=await stat(file);if(!info.isFile())throw Error();
    const data=await readFile(file);
    res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-cache'});res.end(data);
  } catch {res.writeHead(404,{'Content-Type':'text/plain'}).end('Not found');}
}).listen(port,'127.0.0.1',()=>console.log(`Local: http://127.0.0.1:${port}`));
