const { chromium } = require('D:/Projects/DAR/node_modules/playwright-core');
const base='http://localhost:3600';const out='D:/Projects/Portfolio-Studio/shots/t/';
const ok=(c,m)=>console.log(c?'PASS':'FAIL',m);
(async()=>{
 const b=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 const ctx=await b.newContext({viewport:{width:1440,height:900}});const p=await ctx.newPage();
 await p.goto(base+'/');await p.waitForTimeout(1200);
 const names=await p.$$eval('[style*="view-transition-name"]',e=>e.map(x=>x.style.viewTransitionName));
 ok(new Set(names).size===names.length&&names.length===4,'unique shared-element names on home: '+names.join(','));
 await p.evaluate(()=>document.querySelector('#aurelle').scrollIntoView());await p.waitForTimeout(1500);
 const f=await p.locator('#aurelle .browser [data-cursor]').first();const bb=await f.boundingBox();
 await p.mouse.move(bb.x+bb.width/2,bb.y+bb.height/2);await p.waitForTimeout(500);
 const lab=await p.evaluate(()=>{const l=document.querySelector('.cursor-label');return {on:l.classList.contains('is-on'),t:l.textContent}});
 ok(lab.on&&lab.t==='View','cursor label shows "View" over project preview '+JSON.stringify(lab));
 await p.screenshot({path:out+'cursor.png'});
 // click through to case study (full navigation => view transition)
 await p.evaluate(()=>document.querySelector('#aurelle .btn-light').scrollIntoView({block:'end'}));await p.waitForTimeout(600);await p.locator('#aurelle .btn-light').click();await p.waitForLoadState('load');await p.waitForTimeout(1200);
 ok(/\/work\/aurelle/.test(p.url()),'case study link navigates: '+p.url());
 const nm=await p.evaluate(()=>document.querySelector('.browser').style.viewTransitionName);ok(nm==='case-aurelle','case-study hero carries matching transition name ('+nm+')');
 // theme toggle persists
 await p.getByRole('button',{name:'Dark theme'}).click();await p.waitForTimeout(300);
 ok(await p.evaluate(()=>document.documentElement.dataset.theme==='dark'),'theme toggle sets dark');
 await p.reload();await p.waitForTimeout(500);ok(await p.evaluate(()=>document.documentElement.dataset.theme==='dark'),'dark theme persists after reload');
 // marquee pause
 await p.goto(base+'/');await p.getByRole('button',{name:'Pause marquee'}).click();
 ok(await p.evaluate(()=>getComputedStyle(document.querySelector('.marquee-track')).animationPlayState==='paused'),'marquee pause works');
 await p.goto(base+'/work/zaytoun');await p.waitForTimeout(1500);
 const h=await p.evaluate(()=>document.documentElement.scrollHeight);for(let y=0;y<h;y+=500){await p.evaluate(v=>window.scrollTo(0,v),y);await p.waitForTimeout(150);}
 await p.evaluate(()=>window.scrollTo(0,0));await p.waitForTimeout(800);await p.screenshot({path:out+'case-zaytoun-full.png',fullPage:true});
 await ctx.close();await b.close();})();
