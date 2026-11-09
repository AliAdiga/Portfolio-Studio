import { HeroStage } from "./HeroStage";

/**
 * Hero intro gate. The <head> script (layout.tsx) sets html[data-hero-intro] only for a first, motion-friendly
 * visit to the home page; the CSS then holds the opening in its starting pose with a 3-second failsafe delay.
 * This script runs right after the markup: once the DAR cover is decoded it shortens that delay so the reveal
 * starts (about a second long), removes the flag when the animation ends, and records that it has played for
 * this browser session. If anything here fails, the opening simply completes by itself after the failsafe.
 */
const intro = `(function(){try{
var d=document.documentElement;if(!d.hasAttribute('data-hero-intro'))return;
var img=document.getElementById('hero-first'),started=false;
function go(){if(started)return;started=true;try{sessionStorage.setItem('ss-hero','1')}catch(e){}d.style.setProperty('--hero-delay','80ms')}
function done(){d.removeAttribute('data-hero-intro');d.style.removeProperty('--hero-delay')}
document.addEventListener('animationend',function(e){if(e.animationName==='hero-open'||e.animationName==='hero-open-m')done()});
if(img&&!(img.complete&&img.naturalWidth>0)&&img.decode){img.decode().then(go,go)}else{go()}
setTimeout(go,1800);setTimeout(done,6000);
}catch(e){}})();`;

export function Hero() {
  return (
    <section className="hero relative overflow-x-clip" aria-labelledby="hero-h">
      <div className="hero-wash" aria-hidden="true" />
      <div className="relative pt-4 md:pt-6">
        <HeroStage />
      </div>
      <script dangerouslySetInnerHTML={{ __html: intro }} />
    </section>
  );
}
