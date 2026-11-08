const { chromium } = require('D:/Projects/DAR/node_modules/playwright-core');
const fs=require('fs');
const dir='D:/Projects/Portfolio-Studio/shots/vid2/';fs.mkdirSync(dir,{recursive:true});
async function rec(name,vp,fn){
  const b=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
  const ctx=await b.newContext({viewport:vp,recordVideo:{dir:dir+name,size:vp}});
  const p=await ctx.newPage();
  try{await fn(p)}catch(e){console.log(name,'ERR',e.message.slice(0,150))}
  await ctx.close();await b.close();console.log('done',name);
}
const smooth=async(p,total,steps,ms)=>{for(let i=0;i<steps;i++){await p.mouse.wheel(0,total/steps);await p.waitForTimeout(ms)}};
(async()=>{
 await rec('aurelle',{width:1280,height:800},async p=>{
  await p.goto('http://localhost:3102/',{waitUntil:'load',timeout:90000});await p.waitForTimeout(4500);
  const labels=await p.$$eval('button',b=>b.map(x=>x.getAttribute('aria-label')||x.innerText).filter(Boolean));console.log(labels.slice(0,20).join('|'));
  for(let i=0;i<3;i++){const n=p.locator('button[aria-label*="ext" i]').first();if(await n.count())await n.click();await p.waitForTimeout(2200);}
 });
 await rec('caucasus',{width:1280,height:800},async p=>{
  await p.goto('http://localhost:3103/en/',{waitUntil:'load',timeout:60000});await p.waitForTimeout(2500);
  await smooth(p,2600,26,220);await p.waitForTimeout(600);
 });
 await rec('zaytoun',{width:390,height:844},async p=>{
  await p.goto('http://localhost:3104/',{waitUntil:'load',timeout:240000});await p.waitForTimeout(4000);
  await p.mouse.wheel(0,500);await p.waitForTimeout(900);
  await p.getByText('Menu',{exact:true}).last().click();await p.waitForTimeout(1500);
  await smooth(p,700,10,220);await p.waitForTimeout(500);
  await p.getByText('Reserve',{exact:true}).last().click();await p.waitForTimeout(1800);
 });
})();
