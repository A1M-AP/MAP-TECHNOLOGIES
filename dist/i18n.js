import {italian} from './translations.js';
import {chooseLanguage} from './locale-policy.js';
let language='en';
export const getLanguage=()=>language;
export function t(text, params={}) {
  let value=language==='it' ? (italian[text] ?? text) : text;
  for(const [key,replacement] of Object.entries(params)) value=value.replaceAll(`{${key}}`,replacement);
  return value;
}

export function initLanguage() {
  const selector=document.querySelector('#language-select');
  const originalText=new WeakMap(),originalAttributes=new WeakMap();
  const reverse=new Map(Object.entries(italian).map(([en,it])=>[it,en]));
  const attributeNames=['aria-label','title','alt','placeholder','content'];
  const excluded='script,style,svg,.floating-code,[data-no-i18n],input,textarea';
  let choice='auto',country=null;
  try {const saved=localStorage.getItem('map-language');if(['it','en'].includes(saved))choice=saved;} catch {}
  // Option values are stable service identifiers, independent of their displayed language.
  document.querySelectorAll('#project-interest option').forEach(option=>option.value=option.textContent);
  const normalize=value=>reverse.get(value) ?? value;
  function translateValue(current,record) {
    const source=record && current===record.rendered ? record.source : normalize(current);
    return {source,rendered:t(source)};
  }
  function translatePage() {
    observer.disconnect();
    const walker=document.createTreeWalker(document.documentElement,NodeFilter.SHOW_TEXT);
    let node;
    while((node=walker.nextNode())) {
      if(!node.parentElement||node.parentElement.closest(excluded)||!node.textContent.trim())continue;
      const raw=node.textContent;
      const record=translateValue(raw.trim(),originalText.get(node));
      originalText.set(node,record);
      const next=raw.replace(raw.trim(),record.rendered);
      if(raw!==next)node.textContent=next;
    }
    document.querySelectorAll('[aria-label],[title],[alt],[placeholder],meta[content]').forEach(el=>{
      if(el.closest('[data-no-i18n]'))return;
      const records=originalAttributes.get(el)||{};
      for(const name of attributeNames)if(el.hasAttribute(name)) {
        const current=el.getAttribute(name);
        records[name]=translateValue(current,records[name]);
        if(records[name].rendered!==current)el.setAttribute(name,records[name].rendered);
      }
      originalAttributes.set(el,records);
    });
    document.documentElement.lang=language;
    document.documentElement.dataset.languageMode=choice;
    selector.value=choice;
    observer.observe(document.documentElement,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:attributeNames});
  }
  const observer=new MutationObserver(translatePage);
  function apply() {
    language=chooseLanguage({saved:choice,country,browserLanguage:navigator.language});
    translatePage();
    document.dispatchEvent(new Event('map:languagechange'));
  }
  selector.value=choice;
  selector.addEventListener('change',()=>{
    choice=selector.value;
    try {if(choice==='auto')localStorage.removeItem('map-language');else localStorage.setItem('map-language',choice);} catch {}
    apply();
  });
  apply();
  // No IP address is requested, returned or stored: only Cloudflare's country code.
  const controller=new AbortController();
  const timeout=setTimeout(()=>controller.abort(),1800);
  fetch('/api/locale',{signal:controller.signal,cache:'no-store',credentials:'same-origin'})
    .then(response=>response.ok?response.json():null)
    .then(result=>{country=result?.country??null;if(choice==='auto')apply();})
    .catch(()=>{})
    .finally(()=>clearTimeout(timeout));
}
