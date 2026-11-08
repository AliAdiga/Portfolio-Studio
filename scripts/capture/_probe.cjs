const { chromium } = require('D:/Projects/DAR/node_modules/playwright-core');
(async()=>{
 const b = await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 for (const u of ['https://caucasus-sweets-home.vercel.app/','https://aurelle-perfume-ashen.vercel.app','https://zaytoun-restaurant.vercel.app','https://dar-architecture.vercel.app/']) {
  const p = await b.newPage();
  try { const r = await p.goto(u,{waitUntil:'load',timeout:30000}); console.log(u, r.status(), await p.title()); } catch(e){ console.log(u,'ERR',e.message.slice(0,100)); }
  await p.close();
 }
 await b.close();
})();
