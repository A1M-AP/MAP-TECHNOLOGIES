const network = `<svg viewBox="0 0 600 620" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="halo"><stop stop-color="#005b88" stop-opacity=".17"/><stop offset="1" stop-color="#050505" stop-opacity="0"/></radialGradient></defs><circle cx="300" cy="310" r="290" fill="url(#halo)"/><g class="network-body"><path class="network-hex" d="M300 60 517 185V435L300 560 83 435V185Z"/><path class="network-hex" d="M300 100 482 205V415L300 520 118 415V205Z"/><g class="network-edge"><path d="M300 60V210L220 265 83 185M517 185 380 265 300 210M380 265 390 350 517 435M390 350 300 410V560M300 410 215 350 83 435M215 350 220 265M220 265 300 310 380 265M300 310V410M215 350 300 310 390 350M118 205 180 225 220 265M482 205 430 240 380 265M118 415 165 350 215 350M482 415 440 400 390 350M300 100 350 170 380 265M300 520 260 450 300 410"/></g><path class="network-pulse" d="M300 60V210L220 265 300 310 390 350 517 435M83 435 215 350 300 410V560M517 185 380 265 300 310V410"/><g fill="#42bdd9">${[[300,60],[517,185],[517,435],[300,560],[83,435],[83,185],[300,210],[220,265],[380,265],[390,350],[300,410],[215,350],[300,310]].map(([x,y],i)=>`<circle class="network-node" cx="${x}" cy="${y}" r="${i>5?2.7:2}"/>`).join('')}</g></g></svg>`;
document.querySelectorAll('[data-network]').forEach(el=>el.innerHTML=network);
const menuButton=document.querySelector('.menu-toggle');const menu=document.querySelector('.mobile-menu');
function toggleMenu(open){menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?'Close navigation':'Open navigation');menu.hidden=!open;menu.inert=!open;document.body.classList.toggle('menu-open',open);document.querySelector('main').inert=open;document.querySelector('footer').inert=open}
menuButton.addEventListener('click',()=>{const open=menu.hidden;toggleMenu(open);if(open)menu.querySelector('a').focus();else menuButton.focus()});menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>toggleMenu(false)));document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!menu.hidden){toggleMenu(false);menuButton.focus()}});
import {siteConfig} from './config.js';
import {initInteractions} from './interactions.js';
import {initLanguage,t} from './i18n.js';
const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
const compactViewport=window.matchMedia('(max-width: 820px)');
const menuViewport=window.matchMedia('(max-width: 1180px)');
const lowPower=navigator.connection?.saveData || (navigator.deviceMemory && navigator.deviceMemory<4);
const video=document.querySelector('.hero-film');
const motionButton=document.querySelector('.film-toggle');
let motionPaused=false;
let heroVisible=true;
function updateMotion(){
  const disable=reducedMotion.matches||motionPaused;
  document.body.classList.toggle('motion-paused',disable);
  document.dispatchEvent(new Event('map:motionchange'));
  motionButton.setAttribute('aria-label',motionPaused?'Play ambient animation':'Pause ambient animation');
  motionButton.title=motionButton.getAttribute('aria-label');
  motionButton.innerHTML=`<span aria-hidden="true">${motionPaused?'▷':'Ⅱ'}</span>`;
  if(!disable&&!compactViewport.matches&&!lowPower&&heroVisible&&!document.hidden){if(!video.src)video.src=video.dataset.src;video.play().catch(()=>{video.style.opacity='0'})}else video.pause();
  if(reducedMotion.matches||compactViewport.matches||lowPower)video.style.opacity='0';else video.style.opacity='';
}
motionButton.hidden=false;motionButton.addEventListener('click',()=>{motionPaused=!motionPaused;updateMotion()});
reducedMotion.addEventListener('change',updateMotion);compactViewport.addEventListener('change',updateMotion);menuViewport.addEventListener('change',()=>{if(!menuViewport.matches)toggleMenu(false)});document.addEventListener('visibilitychange',updateMotion);
if('IntersectionObserver' in window){new IntersectionObserver(entries=>{heroVisible=entries[0].isIntersecting;updateMotion()},{threshold:.05}).observe(document.querySelector('.hero'))}else updateMotion();
video.addEventListener('error',()=>{video.hidden=true});

// Progressive enhancement: the full page remains readable with JavaScript disabled.
if('IntersectionObserver' in window&&!reducedMotion.matches){
  document.body.classList.add('motion-ready');
  const reveals=new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting){e.target.classList.remove('pending');reveals.unobserve(e.target)}},{threshold:.07,rootMargin:'0px 0px 30px 0px'});
  document.querySelectorAll('.reveal').forEach(el=>{if(el.getBoundingClientRect().top>window.innerHeight)el.classList.add('pending');reveals.observe(el)});
}
function wireTabs(container,onSelect){const tabs=[...container.querySelectorAll('[role="tab"]')];function select(tab,focus=false){tabs.forEach(t=>{const active=t===tab;t.setAttribute('aria-selected',String(active));t.tabIndex=active?0:-1});onSelect(tab);if(focus)tab.focus()}tabs.forEach((tab,index)=>{tab.addEventListener('click',()=>select(tab));tab.addEventListener('keydown',e=>{let next;if(e.key==='ArrowRight'||e.key==='ArrowDown')next=(index+1)%tabs.length;if(e.key==='ArrowLeft'||e.key==='ArrowUp')next=(index+tabs.length-1)%tabs.length;if(e.key==='Home')next=0;if(e.key==='End')next=tabs.length-1;if(next!==undefined){e.preventDefault();select(tabs[next],true)}})})}
wireTabs(document.querySelector('.ai-tabs'),tab=>{document.querySelectorAll('.comparison-body [role="tabpanel"]').forEach(panel=>panel.hidden=panel.id!==tab.getAttribute('aria-controls'))});
const phases=[
 ['Start with the right questions.','We review your workflows, data and goals to identify where AI can create practical value—and what your infrastructure needs to support it.','ASSESSMENT'],
 ['Design the whole system.','We define the models, infrastructure and connections your solution needs, with security, maintainability and future growth in mind.','ARCHITECTURE'],
 ['Invest in what you actually need.','We select compute, memory and storage around real workloads, expected capacity and your budget. Every component has a purpose.','HARDWARE'],
 ['Bring intelligence online.','We configure models, access controls and the runtime environment, then validate performance on representative tasks.','AI DEPLOYMENT'],
 ['Make AI part of your workflow.','We connect AI to your software, data and everyday processes, with clear permissions and human oversight where needed.','INTEGRATION'],
 ['Keep making it better.','We measure quality, latency and resource use, then refine the system as your workloads and priorities evolve.','OPTIMIZATION']
];
wireTabs(document.querySelector('.process-tabs'),tab=>{const index=Number(tab.dataset.phase);const panel=document.querySelector('#phase-panel');panel.setAttribute('aria-labelledby',tab.id);panel.querySelector('.phase-display').textContent=String(index+1).padStart(2,'0');panel.querySelector('h3').textContent=phases[index][0];panel.querySelector('p').textContent=phases[index][1];panel.querySelector('.phase-word').textContent=phases[index][2]});

const projectDialog=document.querySelector('#project-dialog');const solutionDialog=document.querySelector('#solution-dialog');const privacyDialog=document.querySelector('#privacy-dialog');
let returnFocus=null;
function openDialog(dialog,trigger){returnFocus=trigger||document.activeElement;toggleMenu(false);dialog.showModal()}
document.querySelectorAll('dialog').forEach(dialog=>{dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});dialog.addEventListener('close',()=>{if(returnFocus?.isConnected&&!returnFocus.closest('[hidden]'))returnFocus.focus();else menuButton.focus()})});
function openProject(interest='',trigger){document.querySelector('#project-interest').value=interest||'Let’s explore together';document.querySelector('#form-status').textContent='';openDialog(projectDialog,trigger)}
document.querySelectorAll('[data-project]').forEach(button=>button.addEventListener('click',()=>openProject(button.dataset.project,button)));
document.querySelectorAll('[data-privacy]').forEach(button=>button.addEventListener('click',()=>openDialog(privacyDialog,button)));
const solutionDetails={
 'Private AI':['Deploy capable AI models in an environment you control. We help you choose the models, hardware and access policies that fit your business.',['Local language models','Private knowledge assistants','Retrieval over your documents','Controlled access & deployment']],
 'Custom Software':['Turn your real workflows into focused, dependable software. We design and develop the tools your team needs, from the interface to the integrations behind it.',['Windows applications','Internal business tools','Custom integrations','Purpose-built interfaces']],
 'AI Workstations':['Choose hardware for the models and workloads you intend to run. We balance compute, memory, power and upgrade options before you invest.',['GPU system design','Workload assessment','AI workstation configuration','Local AI servers']],
 'Business Automation':['Connect the tools you already use and reduce repetitive work. We design automations with clear rules, traceable steps and meaningful human oversight.',['Workflow mapping','System integrations','Document processing','AI-assisted operations']],
 'Mobile Applications':['Create clear, purposeful mobile experiences for your customers and teams. We build iOS and Android applications around real use cases.',['iOS applications','Android applications','Interface design','Backend integrations']],
 'Web Platforms':['Build a web presence or digital platform that serves a clear purpose. We bring together interface design, software architecture and responsive development.',['Modern websites','Custom web applications','Business platforms','API integrations']],
 'IT Architecture':['Connect software, networks and infrastructure into a coherent system. We help you plan a foundation that supports both today’s operations and tomorrow’s needs.',['Technology assessment','Network architecture','Private infrastructure','Deployment planning']]
};
let chosenSolution='';
document.querySelectorAll('[data-solution]').forEach(button=>button.addEventListener('click',()=>{chosenSolution=button.dataset.solution;const [description,features]=solutionDetails[chosenSolution];document.querySelector('#solution-title').textContent=chosenSolution;document.querySelector('#solution-description').textContent=description;const list=document.querySelector('#solution-features');list.replaceChildren(...features.map(text=>{const li=document.createElement('li');li.textContent=text;return li}));openDialog(solutionDialog,button)}));
document.querySelector('#solution-project').addEventListener('click',()=>{const trigger=returnFocus;solutionDialog.close();openProject(chosenSolution,trigger)});
function updateContactLanguage(){
  if(!siteConfig.contactEmail)return;
  document.querySelector('#submit-project').innerHTML=t('Prepare email')+' <span aria-hidden="true">↗</span>';
  document.querySelector('#form-note').textContent=t('Your email app will open a draft to {email}. Review it before sending. This website does not store your enquiry.',{email:siteConfig.contactEmail});
  document.querySelector('#privacy-form-copy').textContent=t('Project details remain in your browser until you choose to prepare an email. Your email app opens a draft to MAP Technologies for you to review and send. The website does not store your enquiry.');
}
document.addEventListener('map:languagechange',updateContactLanguage);
updateContactLanguage();
document.querySelector('#project-form').addEventListener('submit',e=>{e.preventDefault();const data=new FormData(e.currentTarget);const body=`${t('MAP TECHNOLOGIES — PROJECT BRIEF')}\n\n${t('Name')}: ${data.get('name')}\nEmail: ${data.get('email')}\n${t('Interest')}: ${t(data.get('interest'))}\n\n${t('Project')}\n${data.get('message')}\n`;const status=document.querySelector('#form-status');if(siteConfig.contactEmail){window.location.href=`mailto:${encodeURIComponent(siteConfig.contactEmail)}?subject=${encodeURIComponent(t('MAP project enquiry — ')+t(data.get('interest')))}&body=${encodeURIComponent(body)}`;status.textContent='Your email draft is ready to review in your email app. Nothing has been sent by this website.'}else{const url=URL.createObjectURL(new Blob([body],{type:'text/plain;charset=utf-8'}));const link=document.createElement('a');link.href=url;link.download='MAP-project-brief.txt';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);status.textContent='Your project brief has been saved. It has not been sent to MAP.'}});

// Signal propagation follows the SVG connections. Touch and keyboard use the same nodes.
const nodeMessages={Software:'Software connects your everyday work.',Hardware:'Hardware gives intelligence a foundation.',AI:'AI turns information into useful outcomes.',Data:'Your data brings context to the system.',Infrastructure:'Infrastructure connects every layer.',People:'People give technology its purpose.'};
const map=document.querySelector('.philosophy-map');let signalTimer;
function signal(node){clearTimeout(signalTimer);map.classList.add('is-signaling');document.querySelectorAll('.map-node').forEach(n=>n.classList.toggle('is-active',n===node));map.querySelector('.map-message').textContent=nodeMessages[node.dataset.node];const circles=[...map.querySelectorAll('.network-node')];circles.forEach((circle,i)=>{if(!reducedMotion.matches&&!motionPaused)circle.animate([{opacity:.4,r:2},{opacity:1,r:4,offset:.4},{opacity:.65,r:2.7}],{duration:900,delay:i*65})});signalTimer=setTimeout(()=>map.classList.remove('is-signaling'),1700)}
document.querySelectorAll('.map-node').forEach(node=>{node.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')signal(node)});node.addEventListener('focus',()=>signal(node));node.addEventListener('click',()=>signal(node))});
const heroArt=document.querySelector('.hero-art');let frame=null;
heroArt.addEventListener('pointermove',e=>{if(reducedMotion.matches||motionPaused||compactViewport.matches||frame)return;frame=requestAnimationFrame(()=>{const r=heroArt.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5;const y=(e.clientY-r.top)/r.height-.5;document.querySelector('.hero-network').style.transform=`translate(${x*12}px,${y*10}px)`;frame=null})});heroArt.addEventListener('pointerleave',()=>{document.querySelector('.hero-network').style.transform=''});

// Fullscreen mobile menu: contain focus while open, return it on Escape.
document.addEventListener('keydown',e=>{if(e.key!=='Tab'||menu.hidden)return;const focusables=[menuButton,...menu.querySelectorAll('a,button')];const first=focusables[0],last=focusables.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}});
document.querySelector('#year').textContent=String(new Date().getFullYear());
initInteractions({canAnimate:()=>!reducedMotion.matches&&!motionPaused&&!document.hidden});
initLanguage();
