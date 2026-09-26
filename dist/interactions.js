export function initInteractions({canAnimate}) {
  const visuals=[...document.querySelectorAll('.software-visual,.systems-image,.philosophy-map,.mini-illustration')];
  const hardware=document.querySelector('.systems-image');
  const descriptions={compute:'Compute power for your AI models.',memory:'Fast memory for active workloads.',storage:'Your models and data, stored locally.',network:'Secure connections across your infrastructure.'};
  const componentButtons=[...hardware.querySelectorAll('[data-component]')];
  const componentNote=hardware.querySelector('.schematic-note');
  componentButtons.forEach(button=>button.addEventListener('click',()=>{
    const selected=button.getAttribute('aria-pressed')!=='true';
    componentButtons.forEach(node=>node.setAttribute('aria-pressed',String(selected&&node===button)));
    hardware.dataset.activeComponent=selected?button.dataset.component:'';
    componentNote.textContent=selected?descriptions[button.dataset.component]:'One architecture. Every component connected.';
  }));
  if('IntersectionObserver' in window) {
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>entry.target.classList.toggle('is-in-view',entry.isIntersecting)),{threshold:.08});
    visuals.forEach(el=>observer.observe(el));
  } else visuals.forEach(el=>el.classList.add('is-in-view'));

  const finePointer=matchMedia('(hover: hover) and (pointer: fine)');
  const cursor=document.createElement('div');
  cursor.className='cursor-orbit';
  cursor.setAttribute('aria-hidden','true');
  document.body.append(cursor);
  let frame=0,x=0,y=0,targetX=0,targetY=0,visible=false,activeSurface=null;
  const enabled=()=>finePointer.matches&&canAnimate();
  function hide() {
    visible=false;
    cursor.classList.remove('is-visible','is-pressed');
    activeSurface?.classList.remove('pointer-active');
    activeSurface=null;
    cancelAnimationFrame(frame);
    frame=0;
  }
  function render() {
    frame=0;
    if(!enabled()) { hide(); return; }
    x+=(targetX-x)*.22;
    y+=(targetY-y)*.22;
    cursor.style.transform=`translate3d(${x-14}px,${y-14}px,0)`;
    if(Math.abs(targetX-x)+Math.abs(targetY-y)>.1) frame=requestAnimationFrame(render);
  }
  document.addEventListener('pointermove',event=>{
    if(event.pointerType!=='mouse'||!enabled()) { hide(); return; }
    const target=event.target;
    // Keep the native pointer, and leave text-entry fields and native dialogs clear.
    if(target.closest('input,textarea,select,dialog')) { hide(); return; }
    targetX=Math.max(24,Math.min(document.documentElement.clientWidth-24,event.clientX));
    targetY=Math.max(24,Math.min(innerHeight-24,event.clientY));
    if(!visible) { x=targetX;y=targetY;visible=true;cursor.classList.add('is-visible'); }
    cursor.classList.toggle('is-interactive',!!target.closest('a,button,[role="tab"]'));
    const surface=target.closest('.software-visual,.systems-image,.solution-card');
    if(surface!==activeSurface) {activeSurface?.classList.remove('pointer-active');activeSurface=surface;}
    if(surface) {
      const rect=surface.getBoundingClientRect();
      surface.style.setProperty('--pointer-x',`${event.clientX-rect.left}px`);
      surface.style.setProperty('--pointer-y',`${event.clientY-rect.top}px`);
      surface.classList.add('pointer-active');
    }
    if(!frame) frame=requestAnimationFrame(render);
  },{passive:true});
  document.addEventListener('pointerdown',()=>{if(visible)cursor.classList.add('is-pressed')},{passive:true});
  document.addEventListener('pointerup',()=>cursor.classList.remove('is-pressed'),{passive:true});
  document.documentElement.addEventListener('pointerleave',hide);
  document.addEventListener('keydown',event=>{if(event.key==='Tab')hide()});
  window.addEventListener('blur',hide);
  window.addEventListener('scroll',hide,{passive:true});
  window.addEventListener('resize',hide,{passive:true});
  document.addEventListener('visibilitychange',()=>{document.body.classList.toggle('page-hidden',document.hidden);hide()});
  document.addEventListener('map:motionchange',()=>{if(!enabled())hide()});
  finePointer.addEventListener('change',hide);
}
