const { chromium } = require('D:/Projects/DAR/node_modules/playwright-core');
const out='D:/Projects/Portfolio-Studio/shots/';
const jobs=[
 ['dar-home','http://localhost:3101/en',null],
 ['dar-explorer','http://localhost:3101/en/projects/abdoun-residence?room=kitchen&view=wide#explore',null],
 ['aurelle-home','http://localhost:3102/',null],
 ['aurelle-women','http://localhost:3102/women.html',null],
 ['caucasus-home','http://localhost:3103/en/',null],
 ['caucasus-menu','http://localhost:3103/en/products.html',null],
];
(async()=>{
 const b=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 for(const [name,url] of jobs){
  for(const [tag,vp,mob] of [['d',{width:1440,height:900},false],['m',{width:390,height:844},true]]){
   const ctx=await b.newContext({viewport:vp,deviceScaleFactor:mob?2:1,isMobile:mob,hasTouch:mob});
   const p=await ctx.newPage();
   try{
    await p.goto(url,{waitUntil:'load',timeout:90000});
    await p.waitForTimeout(6000);
    await p.screenshot({path:`${out}${name}-${tag}.png`});
    console.log('ok',name,tag,await p.title());
   }catch(e){console.log('ERR',name,tag,e.message.slice(0,120));}
   await ctx.close();
  }
 }
 await b.close();
})();
