const { chromium } = require('D:/Projects/DAR/node_modules/playwright-core');
const out='D:/Projects/Portfolio-Studio/shots/v/';
require('fs').mkdirSync(out,{recursive:true});
(async()=>{
 const b=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 for(const [tag,vp,mob] of [['d',{width:1440,height:900},false],['m',{width:390,height:844},true]]){
  const ctx=await b.newContext({viewport:vp,deviceScaleFactor:1,isMobile:mob,hasTouch:mob});
  const p=await ctx.newPage();
  const errs=[]; p.on('console',m=>{if(m.type()==='error')errs.push(m.text().slice(0,160))}); p.on('pageerror',e=>errs.push('PAGEERR '+e.message.slice(0,160)));
  await p.goto('http://localhost:3300/',{waitUntil:'load'});
  await p.waitForTimeout(1800);
  await p.screenshot({path:out+'hero-'+tag+'.png'});
  const h=await p.evaluate(()=>document.documentElement.scrollHeight);
  for(let y=0;y<h;y+=500){await p.evaluate(v=>window.scrollTo(0,v),y);await p.waitForTimeout(150);}
  await p.evaluate(()=>window.scrollTo(0,0)); await p.waitForTimeout(800);
  const ov=await p.evaluate(()=>({sw:document.documentElement.scrollWidth,cw:document.documentElement.clientWidth}));
  console.log(tag,'height',h,'overflow',ov,'errors',errs);
  await p.screenshot({path:out+'full-'+tag+'.png',fullPage:true});
  await ctx.close();
 }
 await b.close();
})();
