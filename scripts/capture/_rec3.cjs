const { chromium } = require('D:/Projects/DAR/node_modules/playwright-core');
const fs=require('fs');const dir='D:/Projects/Portfolio-Studio/shots/vid3/';fs.rmSync(dir,{recursive:true,force:true});fs.mkdirSync(dir,{recursive:true});
(async()=>{
 const b=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 const ctx=await b.newContext({viewport:{width:1280,height:800},recordVideo:{dir,size:{width:1280,height:800}}});
 const t0=Date.now();const p=await ctx.newPage();
 await p.goto('http://localhost:3101/en/projects/abdoun-residence?room=living&view=wide#explore',{waitUntil:'load',timeout:120000});
 await p.addStyleTag({content:'nextjs-portal{display:none!important} html{scroll-behavior:auto!important}'});
 const y0=await p.evaluate(()=>{const e=document.querySelector('#explore')||document.body;return Math.max(0,e.getBoundingClientRect().top+scrollY-90)});
 const pin=()=>p.evaluate(y=>window.scrollTo(0,y),y0);
 const settle=async(ms)=>{await p.waitForFunction(()=>[...document.images].filter(i=>{const r=i.getBoundingClientRect();return r.bottom>0&&r.top<innerHeight}).every(i=>i.complete&&i.naturalWidth>0),null,{timeout:12000}).catch(()=>{});await p.waitForTimeout(ms)};
 const click=async n=>{const l=p.getByRole('button',{name:n,exact:true}).first();if(await l.count()){await l.dispatchEvent('click');await pin();}};
 await pin();
 for(const n of ['Kitchen','Bedroom','Bathroom','Living room','Evening','Morning']){await click(n);await settle(400);}
 const start=(Date.now()-t0)/1000;console.log('performance starts at',start);
 await pin();await settle(1800);
 for(const [n,ms] of [['Kitchen',2200],['Evening',1900],['Bedroom',2200],['Morning',1700],['Living room',2200]]){await click(n);await settle(ms);}
 await ctx.close();await b.close();
 fs.writeFileSync(dir+'offset.txt',String(start));
})();
