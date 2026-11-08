const { chromium } = require('D:/Projects/DAR/node_modules/playwright-core');
const out='D:/Projects/Portfolio-Studio/shots/t/';require('fs').mkdirSync(out,{recursive:true});
const base='http://localhost:3600';
(async()=>{
 const b=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 for(const [tag,theme,vp] of [['light','light',{width:1440,height:900}],['dark','dark',{width:1440,height:900}],['m','light',{width:390,height:844}]]){
  const ctx=await b.newContext({viewport:vp,isMobile:tag==='m',hasTouch:tag==='m'});
  await ctx.addInitScript(t=>{try{localStorage.setItem('theme',t)}catch(e){}},theme);
  const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message.slice(0,120)));p.on('console',m=>{if(m.type()==='error')errs.push(m.text().slice(0,120))});
  await p.goto(base+'/',{waitUntil:'load'});await p.waitForTimeout(1600);
  const h=await p.evaluate(()=>document.documentElement.scrollHeight);
  const step=tag==='m'?1600:Math.round(vp.height*0.9);let i=0;
  for(let y=0;y<h;y+=step){await p.evaluate(v=>window.scrollTo(0,v),y);await p.waitForTimeout(1300);
    if(tag==='m'&&i%1!==0){}; await p.screenshot({path:`${out}${tag}-${String(i).padStart(2,'0')}.png`});i++;}
  const ov=await p.evaluate(()=>({sw:document.documentElement.scrollWidth,cw:document.documentElement.clientWidth}));
  console.log(tag,'height',h,'shots',i,'overflow',JSON.stringify(ov),'errors',errs);
  await ctx.close();
 }
 await b.close();})();
