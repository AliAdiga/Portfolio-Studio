import { RevealRescan } from "./RevealRescan";

/**
 * Scroll reveal controller. Runs as a small inline script at the end of the body, before React
 * hydrates, so there is no window where below-the-fold content is hidden but nothing will show it.
 *
 * Rules:
 *  - Elements already in (or above) the viewport are shown instantly. Nothing above the fold waits.
 *  - Elements below the fold get data-rv="0" and are revealed (opacity plus 16px, ~480ms) when they come
 *    within 15% of the viewport, shortly before they are seen. Each is revealed once.
 *  - A large scroll jump (anchor link, Back/Forward restoration, End key) instantly shows everything in or above
 *    the new viewport, so destinations are never blank.
 *  - Reduced motion, a missing IntersectionObserver or any script error leaves all content visible, because
 *    the hidden state is only ever applied by this script.
 *  - A failsafe reveals anything near the viewport after two seconds.
 */
const script = `(function(){try{
var d=document.documentElement;
if(!('IntersectionObserver' in window)||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
function vh(){return window.innerHeight||d.clientHeight}
var io=new IntersectionObserver(function(es){for(var i=0;i<es.length;i++){var e=es[i];if(e.isIntersecting){e.target.setAttribute('data-rv','1');io.unobserve(e.target)}}},{rootMargin:'0px 0px 15% 0px',threshold:0});
function init(){var els=document.querySelectorAll('[data-reveal]:not([data-rv])');for(var i=0;i<els.length;i++){var el=els[i];var r=el.getBoundingClientRect();if(r.top<vh()){el.setAttribute('data-rv','2')}else{el.setAttribute('data-rv','0');io.observe(el)}}}
function jump(){var els=document.querySelectorAll('[data-rv="0"]');var h=vh()*1.15;for(var i=0;i<els.length;i++){var r=els[i].getBoundingClientRect();if(r.top<h){els[i].setAttribute('data-rv','2');io.unobserve(els[i])}}}
window.__reveal={init:init,jump:jump};
init();
var last=window.scrollY,tick=false;
window.addEventListener('scroll',function(){if(tick)return;tick=true;requestAnimationFrame(function(){tick=false;var y=window.scrollY;if(Math.abs(y-last)>vh()*0.6)jump();last=y})},{passive:true});
window.addEventListener('hashchange',function(){requestAnimationFrame(jump)});
window.addEventListener('pageshow',function(){requestAnimationFrame(jump)});
document.addEventListener('DOMContentLoaded',function(){init();requestAnimationFrame(jump)});
setTimeout(jump,60);
setTimeout(function(){var els=document.querySelectorAll('[data-rv="0"]');for(var i=0;i<els.length;i++){var r=els[i].getBoundingClientRect();if(r.top<vh()*1.3)els[i].setAttribute('data-rv','1')}},2000);
}catch(e){}})();`;

export function RevealScript() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: script }} />
      <RevealRescan />
    </>
  );
}
