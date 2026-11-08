const { chromium } = require('D:/Projects/DAR/node_modules/playwright-core');
const out='D:/Projects/Portfolio-Studio/shots/v/';
const base='http://localhost:3300';
const ok=(c,m)=>console.log(c?'PASS':'FAIL',m);
(async()=>{
 const b=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 // 1 reduced motion
 {const ctx=await b.newContext({viewport:{width:1440,height:900},reducedMotion:'reduce'});const p=await ctx.newPage();await p.goto(base+'/');await p.waitForTimeout(500);
  const r=await p.evaluate(()=>{const el=document.querySelector('#services-h');const rev=document.querySelector('[data-reveal]:not(.is-in)');const hero=getComputedStyle(document.querySelector('.rise')).animationName;return {rev:rev?getComputedStyle(rev).opacity:'n/a',hero}});
  ok(r.rev==='1'||r.rev==='n/a','reduced motion: un-revealed content already visible '+JSON.stringify(r));
  ok(r.hero==='none','reduced motion: hero entrance animation disabled');
  await p.goto(base+'/work/dar');await p.waitForTimeout(500);
  const vid=await p.evaluate(()=>{const v=document.querySelector('video');return {paused:v.paused}});
  ok(vid.paused,'reduced motion: DAR video not autoplaying '+JSON.stringify(vid));
  await ctx.close();}
 // 2 no JS
 {const ctx=await b.newContext({viewport:{width:1440,height:900},javaScriptEnabled:false});const p=await ctx.newPage();await p.goto(base+'/');
  const r=await p.evaluate(()=>{const e=document.querySelector('#contact [data-reveal]');return getComputedStyle(e).opacity});
  ok(r==='1','no-JS: reveal content visible (opacity '+r+')');
  await ctx.close();}
 // 3 form
 {const ctx=await b.newContext({viewport:{width:1440,height:900}});const p=await ctx.newPage();await p.goto(base+'/#contact');await p.waitForTimeout(1000);
  await p.getByRole('button',{name:/Prepare my email/}).click();
  const n=await p.locator('.error').count();ok(n===4,'form: 4 errors on empty submit ('+n+')');
  const f=await p.evaluate(()=>document.activeElement&&document.activeElement.getAttribute('name'));ok(f==='name','form: focus moves to first invalid field ('+f+')');
  await p.fill('input[name=name]','Test Person');await p.fill('input[name=email]','bad');await p.selectOption('select[name=type]','Website redesign');await p.fill('textarea[name=message]','short');
  await p.getByRole('button',{name:/Prepare my email/}).click();
  ok(await p.locator('.error').count()===2,'form: invalid email and short message flagged');
  await p.fill('input[name=email]','test@example.com');await p.fill('textarea[name=message]','We need a redesign of our restaurant website in Arabic and English.');
  let mailto=null;await p.route('mailto:*',r=>r.abort());
  p.on('framenavigated',()=>{});
  await p.getByRole('button',{name:/Prepare my email/}).click();await p.waitForTimeout(600);
  const txt=await p.locator('[role=status]').innerText();
  ok(/Nothing has been sent yet/.test(txt)&&!/Thank you/.test(txt),'form: honest message, no false success');
  await p.locator('#contact').screenshot({path:out+'contact-state.png'});
  await ctx.close();}
 // 4 mobile menu + keyboard
 {const ctx=await b.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});const p=await ctx.newPage();await p.goto(base+'/');
  await p.getByRole('button',{name:'Menu'}).click();await p.waitForTimeout(300);
  ok(await p.locator('dialog[open]').count()===1,'mobile: menu dialog opens');
  await p.screenshot({path:out+'menu-m.png'});
  await p.keyboard.press('Escape');await p.waitForTimeout(300);
  ok(await p.locator('dialog[open]').count()===0,'mobile: Escape closes menu');
  const foc=await p.evaluate(()=>document.activeElement.textContent);ok(foc.trim()==='Menu','mobile: focus returns to Menu button ('+foc.trim()+')');
  await p.getByRole('button',{name:'Menu'}).click();await p.getByRole('link',{name:'Work'}).first().click();await p.waitForTimeout(800);
  ok(await p.locator('dialog[open]').count()===0,'mobile: link closes menu');
  await ctx.close();}
 {const ctx=await b.newContext({viewport:{width:1440,height:900}});const p=await ctx.newPage();await p.goto(base+'/');
  await p.keyboard.press('Tab');await p.keyboard.press('Tab');await p.waitForTimeout(200);
  await p.screenshot({path:out+'focus-d.png',clip:{x:0,y:0,width:1440,height:120}});
  const ol=await p.evaluate(()=>getComputedStyle(document.activeElement).outlineStyle);ok(ol==='solid','keyboard: visible focus outline');
  await ctx.close();}
 // 5 links & hero stage
 {const ctx=await b.newContext({viewport:{width:1440,height:900}});const p=await ctx.newPage();await p.goto(base+'/');
  await p.getByRole('button',{name:'Zaytoun',exact:true}).click();await p.waitForTimeout(900);
  const name=await p.locator('[aria-live=polite] p').first().innerText();ok(name==='Zaytoun','hero stage: choosing Zaytoun brings it forward ('+name+')');
  await p.screenshot({path:out+'hero-zaytoun.png'});
  const hrefs=await p.$$eval('a[href^="http"]',a=>[...new Set(a.map(x=>x.href))]);console.log('external links:',hrefs.join(' '));
  const bad=[];for(const slug of ['dar','aurelle','zaytoun','caucasus-sweets-home']){const r=await p.goto(base+'/work/'+slug);if(r.status()!==200)bad.push(slug);}
  ok(bad.length===0,'case study routes 200 '+bad.join());
  await p.goto(base+'/work/dar');await p.waitForTimeout(800);await p.screenshot({path:out+'case-dar-top.png'});
  const h=await p.evaluate(()=>document.documentElement.scrollHeight);for(let y=0;y<h;y+=500){await p.evaluate(v=>window.scrollTo(0,v),y);await p.waitForTimeout(120);}
  await p.evaluate(()=>window.scrollTo(0,0));await p.waitForTimeout(500);await p.screenshot({path:out+'case-dar-full.png',fullPage:true});
  await ctx.close();}
 await b.close();
})();
