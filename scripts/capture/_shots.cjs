const { chromium } = require('D:/Projects/DAR/node_modules/playwright-core');
const out='D:/Projects/Portfolio-Studio/shots/r/';require('fs').mkdirSync(out,{recursive:true});
const base='http://localhost:3700';
(async()=>{
 const b=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 for(const [tag,theme,vp,mob] of [['d-light','light',{width:1440,height:900},false],['d-dark','dark',{width:1440,height:900},false],['m-light','light',{width:390,height:844},true]]){
  const ctx=await b.newContext({viewport:vp,isMobile:mob,hasTouch:mob});
  await ctx.addInitScript(t=>{try{localStorage.setItem('theme',t)}catch(e){}},theme);
  const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message.slice(0,140)));p.on('console',m=>{if(m.type()==='error')errs.push(m.text().slice(0,140))});
  await p.goto(base+'/',{waitUntil:'load'});await p.waitForTimeout(2200);
  await p.screenshot({path:out+tag+'-00-hero.png'});
  const h=await p.evaluate(()=>document.documentElement.scrollHeight);
  const stops=mob?[900,1900,2900,4400,6200,8200,10200,12400]:[900,1700,2500,3500,4600,5600,6600,7700];
  let i=1;for(const y of stops){if(y>h)break;await p.evaluate(v=>window.scrollTo(0,v),y);await p.waitForTimeout(1100);await p.screenshot({path:out+tag+'-'+String(i++).padStart(2,'0')+'.png'});}
  const ov=await p.evaluate(()=>({sw:document.documentElement.scrollWidth,cw:document.documentElement.clientWidth}));
  console.log(tag,'height',h,'overflow',JSON.stringify(ov),'errors',errs);
  await ctx.close();
 }
 await b.close();})();
