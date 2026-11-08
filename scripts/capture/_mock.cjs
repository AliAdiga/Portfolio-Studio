// Local stand-in for an email provider. Records requests; nothing is ever sent anywhere.
const http=require('http'),fs=require('fs');
http.createServer((req,res)=>{let b='';req.on('data',c=>b+=c);req.on('end',()=>{fs.appendFileSync('D:/Projects/Portfolio-Studio/scripts/_mock.log',JSON.stringify({auth:req.headers.authorization,body:b})+'\n');res.writeHead(200,{'content-type':'application/json'});res.end('{"id":"mock"}')})}).listen(4010);
