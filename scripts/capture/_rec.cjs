const { chromium } = require('D:/Projects/DAR/node_modules/playwright-core');
(async()=>{
 const b=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 const ctx=await b.newContext({viewport:{width:1280,height:800},recordVideo:{dir:'D:/Projects/Portfolio-Studio/shots/vid',size:{width:1280,height:800}}});
 const p=await ctx.newPage();
 await p.goto('http://localhost:3101/en/projects/abdoun-residence?room=living&view=wide#explore',{waitUntil:'load',timeout:120000});
 await p.addStyleTag({content:'nextjs-portal{display:none!important}'});
 await p.waitForTimeout(2500);
 const names=await p.getByRole('button').allInnerTexts();
 console.log(names.join(' | '));
 for(const n of ['Kitchen','Bedroom','Bathroom','Living room','Golden hour','Blue hour']){
  const l=p.getByRole('button',{name:n}).first();
  try{ if(await l.count()){ await l.click({timeout:3000}); await p.waitForTimeout(1800);} else console.log('missing',n);}catch(e){console.log('fail',n)}
 }
 await ctx.close(); await b.close();
})();
