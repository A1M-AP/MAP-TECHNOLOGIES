// Compact disclosure with native radio controls, keyboard navigation and a select fallback.
export function initLanguagePicker(selector) {
  const control=selector.closest('.language-control');
  const trigger=control.querySelector('.language-trigger');
  const panel=control.querySelector('.language-panel');
  const options=[...panel.querySelectorAll('input[name="site-language"]')];
  const badge=trigger.querySelector('.language-code');
  function close(restoreFocus=false) {
    panel.hidden=true;
    trigger.setAttribute('aria-expanded','false');
    if(restoreFocus)trigger.focus();
  }
  function open(focus=false) {
    panel.hidden=false;
    trigger.setAttribute('aria-expanded','true');
    if(focus)(options.find(option=>option.checked)||options[0]).focus();
  }
  function sync() {
    const code=document.documentElement.lang.toUpperCase();
    if(badge.textContent!==code)badge.textContent=code;
    options.forEach(option=>option.checked=option.value===selector.value);
  }
  trigger.hidden=false;
  selector.hidden=true;
  trigger.addEventListener('click',event=>panel.hidden?open(event.detail===0):close());
  trigger.addEventListener('keydown',event=>{
    if(event.key==='ArrowDown'||event.key==='ArrowUp'){event.preventDefault();open(true);}
  });
  options.forEach(option=>option.addEventListener('change',()=>{
    if(!option.checked)return;
    selector.value=option.value;
    selector.dispatchEvent(new Event('change',{bubbles:true}));
    close(true);
  }));
  control.addEventListener('keydown',event=>{
    if(event.key==='Escape'&&!panel.hidden){event.preventDefault();event.stopPropagation();close(true);}
  });
  control.addEventListener('focusout',event=>{
    // A pointer on a label can briefly clear focus before activating its radio.
    if(event.relatedTarget&&!control.contains(event.relatedTarget))close();
  });
  window.addEventListener('blur',()=>close());
  document.addEventListener('pointerdown',event=>{if(!control.contains(event.target))close();});
  document.querySelector('.menu-toggle').addEventListener('click',()=>close());
  document.addEventListener('map:languagechange',sync);
  sync();
}
