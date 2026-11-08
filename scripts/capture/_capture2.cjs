const { chromium } = require('D:/Projects/DAR/node_modules/playwright-core');
const out='D:/Projects/Portfolio-Studio/shots/';
const jobs=[
 ['dar-home','http://localhost:3101/en','dar'],
 ['dar-explorer','http://localhost:3101/en/projects/abdoun-residence?room=kitchen&view=wide#explore','dar'],
 ['zaytoun-app-home','http://localhost:3104/',null],
 ['zaytoun-app-menu','http://localhost:3104/menu',null],
 ['zaytoun-app-reserve','http://localhost:3104/reserve',null],
];
(async()=>{
 const b=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 for(const [name,url,kind] of jobs){
  for(const [tag,vp,mob] of [['d',{width:1440,height:900},false],['m',{width:390,height:844},true]]){
   const ctx=await b.newContext({viewport:vp,deviceScaleFactor:mob?2:1,isMobile:mob,hasTouch:mob});
   const p=await ctx.newPage();
   try{
    await p.goto(url,{waitUntil:'load',timeout:240000});
    await p.addStyleTag({content:'nextjs-portal,[data-nextjs-toast]{display:none!important}'});
    await p.waitForTimeout(kind==='dar'?5000:9000);
    await p.screenshot({path:`${out}${name}-${tag}.png`});
    console.log('ok',name,tag);
   }catch(e){console.log('ERR',name,tag,e.message.slice(0,120));}
   await ctx.close();
  }
 }
 await b.close();
})();
