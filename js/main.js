gsap.registerPlugin(ScrollTrigger);

/* ─── CURSOR ─── */
const dot = document.getElementById('cur-dot');
const ring = document.getElementById('cur-ring');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{
  mx=e.clientX; my=e.clientY;
  gsap.set(dot,{x:mx,y:my});
});
(function loop(){
  rx+=(mx-rx)*.11; ry+=(my-ry)*.11;
  gsap.set(ring,{x:rx,y:ry});
  requestAnimationFrame(loop);
})();
document.querySelectorAll('a,button,[data-mag]').forEach(el=>{
  el.addEventListener('mouseenter',()=>{dot.classList.add('hov');ring.classList.add('hov')});
  el.addEventListener('mouseleave',()=>{dot.classList.remove('hov');ring.classList.remove('hov')});
});

/* ─── MAGNETIC ─── */
document.querySelectorAll('[data-mag]').forEach(el=>{
  el.addEventListener('mousemove',e=>{
    const r=el.getBoundingClientRect();
    const dx=(e.clientX-r.left-r.width/2)*.28;
    const dy=(e.clientY-r.top-r.height/2)*.28;
    gsap.to(el,{x:dx,y:dy,duration:.3,ease:'power2.out'});
  });
  el.addEventListener('mouseleave',()=>{
    gsap.to(el,{x:0,y:0,duration:.6,ease:'elastic.out(1,.5)'});
  });
});

/* ─── ORB PARALLAX ─── */
const orb=document.getElementById('orb');
document.addEventListener('mousemove',e=>{
  const dx=(e.clientX/innerWidth-.5)*24;
  const dy=(e.clientY/innerHeight-.5)*16;
  gsap.to(orb,{x:dx,y:dy,duration:1.8,ease:'power2.out'});
});

/* ─── HERO ENTRANCE ─── */
gsap.set(['#hw1','#hw2','#hw3','#hw4'],{y:'108%'});
gsap.set(['#h-tag','#h-sub','#h-act','#h-scroll'],{opacity:0,y:14});
const tl=gsap.timeline({defaults:{ease:'power4.out'}});
tl
  .to('#nav',{opacity:1,y:0,duration:.9},'.15')
  .to('#h-tag',{opacity:1,y:0,duration:.7},'.35')
  .to(['#hw1','#hw2','#hw3'],{y:'0%',duration:1.05,stagger:.1},'.5')
  .to('#hw4',{y:'0%',duration:1.15},'.85')
  .to('#h-sub',{opacity:1,y:0,duration:.7},'1.1')
  .to('#h-act',{opacity:1,y:0,duration:.7},'1.25')
  .to('#h-scroll',{opacity:1,y:0,duration:.6},'1.5');

/* ─── ARGUMENT PINNED ─── */
const slides=document.querySelectorAll('.arg__slide');
const dots=document.querySelectorAll('.arg__dot');
const argBg=document.getElementById('arg-bg');
const argCnt=document.getElementById('arg-cnt');
let cur=0;
function showSlide(i){
  if(i===cur)return;
  const prev=slides[cur];
  prev.classList.remove('on');
  prev.classList.add('off-up');
  setTimeout(()=>prev.classList.remove('off-up'),600);
  slides[i].classList.add('on');
  dots[cur].classList.remove('on');
  dots[i].classList.add('on');
  argBg.textContent=i+1;
  argCnt.textContent=(i+1<10?'0'+(i+1):i+1)+' / 04';
  cur=i;
}
ScrollTrigger.create({
  trigger:'#arg',
  start:'top top',
  end:'bottom bottom',
  onUpdate:self=>{
    const idx=Math.min(slides.length-1,Math.floor(self.progress*slides.length));
    showSlide(idx);
  }
});

/* Clickable dots */
const argEl=document.getElementById('arg');
dots.forEach((dot,i)=>{
  dot.setAttribute('role','button');
  dot.setAttribute('tabindex','0');
  dot.setAttribute('aria-label','Тезис '+(i+1));
  dot.style.cursor='pointer';
  const goToSlide=()=>{
    showSlide(i);
    const sH=argEl.offsetHeight;
    const vH=window.innerHeight;
    const target=argEl.offsetTop+(i/slides.length)*(sH-vH);
    window.scrollTo({top:Math.max(0,target),behavior:'smooth'});
  };
  dot.addEventListener('click',goToSlide);
  dot.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' ')goToSlide()});
});

/* ─── METHOD ─── */
document.querySelectorAll('.method__card').forEach((c,i)=>{
  gsap.to(c,{opacity:1,y:0,duration:.75,delay:i*.12,
    scrollTrigger:{trigger:c,start:'top 82%',toggleActions:'play none none none'}
  });
});

/* ─── PRICING ─── */
gsap.to('#pricing-intro',{opacity:1,y:0,duration:.8,
  scrollTrigger:{trigger:'#pricing-intro',start:'top 82%',toggleActions:'play none none none'}
});
document.querySelectorAll('.pricing__card').forEach((c,i)=>{
  gsap.to(c,{opacity:1,y:0,duration:.75,delay:i*.12,
    scrollTrigger:{trigger:c,start:'top 82%',toggleActions:'play none none none'}
  });
});

/* ─── CASES DRAG ─── */
const ct=document.getElementById('ctrack');
let drag=false,sx=0,sl=0;
ct.addEventListener('pointerdown',e=>{
  drag=true;sx=e.pageX-ct.offsetLeft;sl=ct.scrollLeft;
  ct.classList.add('grabbing');ct.setPointerCapture(e.pointerId);
});
ct.addEventListener('pointerup',()=>{drag=false;ct.classList.remove('grabbing')});
ct.addEventListener('pointermove',e=>{
  if(!drag)return;
  ct.scrollLeft=sl-(e.pageX-ct.offsetLeft-sx)*1.4;
});

/* ─── NOT FOR ─── */
gsap.to('.notfor__title',{opacity:1,y:0,duration:.8,
  scrollTrigger:{trigger:'.notfor__title',start:'top 82%',toggleActions:'play none none none'}
});
document.querySelectorAll('.notfor__fit').forEach((el,i)=>{
  gsap.to(el,{opacity:1,x:0,duration:.55,delay:i*.09,
    scrollTrigger:{trigger:el,start:'top 88%',toggleActions:'play none none none'}
  });
});
document.querySelectorAll('.notfor__item').forEach((el,i)=>{
  gsap.to(el,{opacity:1,x:0,duration:.55,delay:i*.09,
    scrollTrigger:{trigger:el,start:'top 88%',toggleActions:'play none none none'}
  });
});
gsap.to('.notfor__box',{opacity:1,y:0,duration:.7,
  scrollTrigger:{trigger:'.notfor__box',start:'top 85%',toggleActions:'play none none none'}
});

/* ─── ABOUT ─── */
document.querySelectorAll('.about__p').forEach((p,i)=>{
  gsap.to(p,{opacity:1,y:0,duration:.75,delay:i*.1,
    scrollTrigger:{trigger:p,start:'top 86%',toggleActions:'play none none none'}
  });
});

/* ─── CONTACT ─── */
gsap.to('#c-title',{opacity:1,y:0,duration:.9,
  scrollTrigger:{trigger:'#c-title',start:'top 80%',toggleActions:'play none none none'}
});
gsap.to('#c-sub',{opacity:1,y:0,duration:.7,delay:.15,
  scrollTrigger:{trigger:'#c-sub',start:'top 85%',toggleActions:'play none none none'}
});

/* ─── FORM ─── */
function sendForm(){
  document.getElementById('cform').style.display='none';
  document.getElementById('fok').classList.add('on');
}
window.sendForm=sendForm;

/* ─── COOKIE ─── */
(function(){
  const bar=document.getElementById('cookie-bar');
  const btn=document.getElementById('cookie-ok');
  if(localStorage.getItem('cookie_ok')){
    bar.classList.add('hidden');
  }
  btn.addEventListener('click',()=>{
    localStorage.setItem('cookie_ok','1');
    bar.classList.add('hidden');
  });
})();

/* ─── REDUCED MOTION ─── */
if(matchMedia('(prefers-reduced-motion:reduce)').matches){
  gsap.globalTimeline.timeScale(0);
  document.querySelectorAll('*').forEach(el=>{
    el.style.animationDuration='.01ms';
    el.style.transitionDuration='.01ms';
  });
}
