const { chromium } = require('D:/Projects/DAR/node_modules/playwright-core');
(async()=>{
 const b=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 const p=await (await b.newContext()).newPage();
 p.on('console',m=>console.log('console',m.type(),m.text().slice(0,300)));p.on('pageerror',e=>console.log('pageerror',e.message.slice(0,300)));
 p.on('response',r=>{if(r.status()>=400)console.log('HTTP',r.status(),r.url())});
 await p.goto('http://localhost:3300/',{waitUntil:'networkidle'});await p.waitForTimeout(1500);
 console.log(await p.evaluate(()=>Object.keys(document.querySelector('button')||{}).filter(k=>k.startsWith('__react')).length));
 await b.close();})();
