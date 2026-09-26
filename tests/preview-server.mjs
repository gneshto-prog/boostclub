// Local-only static preview. No external provider calls and no customer writes.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(process.argv[2] || '_site');
const mime={'.html':'text/html','.css':'text/css','.js':'application/javascript','.json':'application/json','.svg':'image/svg+xml','.webp':'image/webp','.jpg':'image/jpeg','.png':'image/png','.woff2':'font/woff2','.mp4':'video/mp4','.xml':'application/xml','.txt':'text/plain'};
http.createServer((req,res)=>{
  const url=new URL(req.url,'http://localhost');
  if(url.pathname.startsWith('/api/')) {res.writeHead(503,{'content-type':'application/json'});res.end(JSON.stringify({ok:false,code:'AVAILABILITY_UNAVAILABLE',requestId:'local-preview-no-providers'}));return;}
  if(req.method!=='GET' && req.method!=='HEAD') {res.writeHead(405);res.end();return;}
  let relative=decodeURIComponent(url.pathname).replace(/^\/+/, '');
  if(!relative || relative.endsWith('/'))relative+='index.html';
  if(!path.extname(relative))relative+='.html';
  let file=path.resolve(root,relative);
  if(!file.startsWith(root+path.sep)) {res.writeHead(403);res.end();return;}
  let status=200;
  if(!fs.existsSync(file)||!fs.statSync(file).isFile()){file=path.join(root,'404.html');status=404;}
  res.writeHead(status,{'content-type':mime[path.extname(file)]||'application/octet-stream','cache-control':'no-store'});
  fs.createReadStream(file).pipe(res);
}).listen(4173,'127.0.0.1',()=>console.log('Local preview: http://127.0.0.1:4173 (provider writes disabled)'));
