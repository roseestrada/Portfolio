'use strict';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const A='assets/';
// Curated projects. Each category shows the specific artwork relevant to it.
const projects=[
 {id:'sora',title:'SORA SIPS',category:['Branding & Identity'],cover:'sora-brand.webp',images:['sora-brand.webp','sora-packaging.webp','sora-mascot.webp','sora-menu.webp'],description:'A complete milk tea brand identity, including brand board, packaging and merchandise, mascot sticker collection, and menu.'},
 {id:'horizons',title:'HORIZONS — Travel Agency',category:['Branding & Identity'],cover:'horizons-brand.webp',images:['horizons-brand.webp','horizons-merch.webp','horizons-ad.webp'],description:'A travel agency identity featuring its brand system, branded merchandise and advertising campaign.'},
 {id:'pixelcore',title:'PIXELCORE — Creative Outsourcing',category:['Branding & Identity'],cover:'pixelcore-brand.webp',images:['pixelcore-brand.webp','pixelcore-packaging.webp','pixelcore-ad.webp'],description:'A warm cream-and-nude creative agency identity with packaging design and services advertising.'},
 {id:'zagu-illustrated',title:'ZAGU — Illustrated Social Media Collection',category:['Social Media & Advertising'],cover:'zagu-illustrated-cover.webp',images:['zagu-bucket-list.webp','zagu-friendship-day.webp','zagu-add-ons.webp','zagu-stop-hop-collect.webp','zagu-matcha-latte.webp','zagu-cookies-cream.webp'],description:'Six illustrated Zagu social media and advertising creatives, presented together as one collection.'},
 {id:'zagu-social',title:'ZAGU — Fidget Clicker Campaign',category:['Social Media & Advertising'],cover:'zagu-clicker-launch.webp',images:['zagu-clicker-collectibles.webp','zagu-clicker-mystery.webp','zagu-clicker-mango.webp','zagu-clicker-buko-pandan.webp','zagu-clicker-watermelon.webp','zagu-clicker-ube.webp','zagu-clicker-strawberry.webp','zagu-clicker-click-your-flavor.webp'],description:'Zagu Fidget Clicker campaign visuals, flavor variants and collectible promotion.'},
 {id:'horizons-ad',title:'HORIZONS — Travel Advertisement',category:['Social Media & Advertising'],cover:'horizons-ad.webp',images:['horizons-ad.webp'],description:'A travel agency promotional advertisement highlighting bookings, reservations, tours and travel services.'},
 {id:'pixelcore-ad',title:'PIXELCORE — Services Advertisement',category:['Social Media & Advertising'],cover:'pixelcore-ad.webp',images:['pixelcore-ad.webp'],description:'A services advertisement featuring graphic design, branding, UI/UX, motion graphics and marketing creatives.'},
 {id:'sora-packaging',title:'SORA SIPS — Packaging & Merchandise',category:['Packaging & Merchandise'],cover:'sora-packaging.webp',images:['sora-packaging.webp'],description:'SORA SIPS merchandise, including T-shirt, tote, tumbler, cap and mascot keychain.'},
 {id:'horizons-packaging',title:'HORIZONS — Branded Merchandise',category:['Packaging & Merchandise'],cover:'horizons-merch.webp',images:['horizons-merch.webp'],description:'Horizons branded polo, tote, tumbler, cap and luggage tag.'},
 {id:'pixelcore-packaging',title:'PIXELCORE — Packaging Design',category:['Packaging & Merchandise'],cover:'pixelcore-packaging.webp',images:['pixelcore-packaging.webp'],description:'PixelCore packaging applications including rectangular box, square box and paper bag.'},
 {id:'pixelcore-ui',title:'PIXELCORE — Website UI/UX',category:['Web & UI/UX Design'],cover:'pixelcore-ui.webp',images:['pixelcore-ui.webp','pixelcore-wireframe.webp'],description:'A responsive creative outsourcing website concept with desktop and mobile interface designs, alongside the website wireframes.',concept:true},
 {id:'horizons-ui',title:'HORIZONS — Travel Website UI/UX',category:['Web & UI/UX Design'],cover:'horizons-ui.webp',images:['horizons-ui.webp','horizons-wireframe.webp'],description:'A travel agency website concept covering destinations, packages, company information and contact, supported by structured wireframes.',concept:true},
 {id:'sora-ui',title:'SORA SIPS — Mobile App UI/UX',category:['Web & UI/UX Design'],cover:'sora-ui.webp',images:['sora-ui.webp','sora-wireframe.webp'],description:'A milk tea ordering mobile app concept with onboarding, menu browsing, product customization, cart, checkout and order tracking screens.',concept:true},
 {id:'fashion-ui',title:'FASHION — E-Commerce Website UI/UX',category:['Web & UI/UX Design'],cover:'fashion-ui-cover.webp',images:['fashion-ui-cover.webp','fashion-ui-home.webp','fashion-ui-pages.webp','fashion-ui-presentation.webp','fashion-wireframe.webp'],description:'A responsive fashion and lifestyle shopping website concept featuring product discovery, collections, promotional sections and wireframe layouts.',concept:true},
 {id:'coffee-ui',title:'COFFEE SHOP — E-Commerce Mobile App',category:['Web & UI/UX Design'],cover:'coffee-ui-cover.webp',images:['coffee-ui-cover.webp','coffee-ui-mockup.webp','coffee-ui-screens.webp','coffee-ui-devices.webp','coffee-wireframe.webp'],description:'A coffee ordering mobile app concept with product discovery, coffee details, favorites, account settings and wireframe presentations.',concept:true},
 {id:'kalo-gold-apparel',title:'KALO GOLD — Hawaii T-Shirt Collection',category:['Apparel & Creative Design'],cover:'kalo-gold-cover.webp',images:['kalo-gold-design-1.webp','kalo-gold-design-2.webp','kalo-gold-design-3.webp','kalo-gold-design-4.webp'],description:'Hawaii-inspired Kalo Gold T-shirt graphics and apparel presentations, featuring heritage, tropical landscapes and bold visual storytelling.'},
 {id:'concepcion-apparel',title:'CONCEPCION ILOILO — T-Shirt & Hoodie Collection',category:['Apparel & Creative Design'],cover:'concepcion-cover.webp',images:['concepcion-design-3.webp','concepcion-design-4.webp','concepcion-design-1.webp','concepcion-design-2.webp'],description:'A Concepcion, Iloilo apparel collection with coastal-inspired T-shirt graphics, ecotourism designs and a hoodie presentation.'}
];
const categories=['Branding & Identity','Social Media & Advertising','Packaging & Merchandise','Web & UI/UX Design','Apparel & Creative Design'];
const grid=$('#projectGrid'),filters=$('#filters'),empty=$('#emptyMessage');
function makeImage(src,alt='',lazy=true){const img=document.createElement('img');img.src=A+src;img.alt=alt;img.loading=lazy?'lazy':'eager';img.onerror=()=>{img.style.opacity='.2';img.alt='Image unavailable: '+src};return img}
function renderProjects(category='Branding & Identity'){
 grid.replaceChildren();filters.querySelectorAll('button').forEach(b=>{const active=b.dataset.category===category;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active))});
 const items=projects.filter(p=>p.category.includes(category));empty.hidden=items.length!==0;
 items.forEach((p,i)=>{const card=document.createElement('article');card.className='project-card reveal visible';card.tabIndex=0;card.setAttribute('role','button');card.setAttribute('aria-label','Open '+p.title);const art=document.createElement('div');art.className='project-art';art.append(makeImage(p.cover,p.title));const meta=document.createElement('div');meta.className='project-meta';const left=document.createElement('div');const h=document.createElement('h3');h.textContent=p.title;const d=document.createElement('p');d.textContent=p.category.join(' / ');left.append(h,d);const arrow=document.createElement('span');arrow.textContent='↗';meta.append(left,arrow);card.append(art,meta);card.addEventListener('click',()=>openProject(p));card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openProject(p)}});grid.append(card)})
}
categories.forEach(c=>{const b=document.createElement('button');b.className='filter';b.textContent=c;b.dataset.category=c;b.setAttribute('aria-pressed','false');b.addEventListener('click',()=>renderProjects(c));filters.append(b)});renderProjects();
const dialog=$('#projectDialog');
function openProject(p){const target=$('#dialogContent');target.replaceChildren();const head=document.createElement('div');head.className='dialog-head';const label=document.createElement('p');label.className='eyebrow';label.textContent=p.category.join(' / ');const title=document.createElement('h2');title.textContent=p.title;const desc=document.createElement('p');desc.textContent=p.description;head.append(label,title,desc);if(p.concept){const note=document.createElement('p');note.className='project-disclaimer';const strong=document.createElement('strong');strong.textContent='Portfolio concept project. ';note.append(strong,document.createTextNode('This is a sample UI/UX project created for portfolio demonstration purposes. Images used within the interface designs were sourced from Pinterest for visual presentation only. The project is not affiliated with the original image owners.'));head.append(note)}const gallery=document.createElement('div');gallery.className='dialog-gallery';p.images.forEach((src,i)=>gallery.append(makeImage(src,`${p.title} — artwork ${i+1}`)));target.append(head,gallery);dialog.showModal();dialog.scrollTop=0}
$('#closeDialog').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});
const themeBtn=$('#themeToggle');let theme='light';try{theme=localStorage.getItem('rose-theme')||'light'}catch(e){}function setTheme(next){theme=next;document.documentElement.dataset.theme=next;themeBtn.setAttribute('aria-pressed',String(next==='dark'));themeBtn.setAttribute('aria-label',`Switch to ${next==='dark'?'light':'dark'} mode`);try{localStorage.setItem('rose-theme',next)}catch(e){}}setTheme(theme==='dark'?'dark':'light');themeBtn.addEventListener('click',()=>setTheme(theme==='dark'?'light':'dark'));
const menu=$('#menuToggle'),nav=$('#navLinks');menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.textContent=open?'✕':'☰'});$$('.nav-links a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.textContent='☰'}));
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;const hero=$('#home'),trail=$('#trailLayer');let lastX=-1000,lastY=-1000,lastT=0,trailIndex=0;const trailImages=projects.flatMap(p=>p.images);
hero.addEventListener('pointermove',e=>{if(reduced||e.pointerType!=='mouse'||innerWidth<651||e.target.closest('a,button'))return;const r=hero.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top,t=performance.now();if(Math.hypot(x-lastX,y-lastY)<36||t-lastT<65)return;lastX=x;lastY=y;lastT=t;const img=makeImage(trailImages[trailIndex++%trailImages.length],'',false);img.className='trail-card';img.style.left=x+'px';img.style.top=y+'px';img.style.setProperty('--rot',`${Math.random()*28-14}deg`);trail.append(img);while(trail.children.length>13)trail.firstElementChild.remove();setTimeout(()=>img.remove(),1350)});hero.addEventListener('pointerleave',()=>{lastX=-1000;lastY=-1000});
const mobile=$('#heroMobile');projects.slice(0,3).forEach(p=>mobile.append(makeImage(p.cover,p.title)));
// Borderless, accessible, infinitely cycling creative-tool logo carousel.
const software=[
 ['adobephotoshop','Adobe Photoshop','31A8FF','Ps'],
 ['adobeillustrator','Adobe Illustrator','FF9A00','Ai'],
 ['adobedimension','Adobe Dimension','C99FFF','Dn'],
 ['canva','Canva','00C4CC','C'],
 ['figma','Figma','F24E1E','F'],
 ['framer','Framer','0055FF','Fr'],
 ['wordpress','WordPress','21759B','W']
];
const track=$('#toolsTrack');
function toolItem([slug,name,color,fallback]){
 const el=document.createElement('div');el.className='tool';
 const logo=document.createElement('img');logo.className='tool-logo';logo.alt='';logo.loading='lazy';logo.src=slug==='adobedimension'?'assets/tool-logos/adobe-dimension.svg':`https://cdn.simpleicons.org/${slug}/${color}`;
 logo.onerror=()=>{logo.src=`assets/tool-logos/${slug}.svg`;logo.onerror=()=>{logo.remove();const mark=document.createElement('strong');mark.className='tool-fallback';mark.textContent=fallback;el.prepend(mark)}};
 const label=document.createElement('span');label.textContent=name;el.append(logo,label);return el;
}
software.forEach(item=>track.append(toolItem(item)));
// Clone the sequence for seamless motion; clones are not announced by screen readers.
software.forEach(item=>{const el=toolItem(item);el.setAttribute('aria-hidden','true');track.append(el)});
const carousel=$('#toolsTrack');let paused=false,position=0,lastFrame=0;
function cycleWidth(){return carousel.scrollWidth/2}
function animateTools(now){if(!lastFrame)lastFrame=now;const dt=Math.min(40,now-lastFrame);lastFrame=now;if(!paused&&!reduced&&cycleWidth()>0){position=(position+dt*.035)%cycleWidth();carousel.scrollLeft=position}requestAnimationFrame(animateTools)}
carousel.addEventListener('mouseenter',()=>paused=true);carousel.addEventListener('mouseleave',()=>paused=false);
carousel.addEventListener('focusin',()=>paused=true);carousel.addEventListener('focusout',()=>paused=false);
carousel.addEventListener('scroll',()=>{if(paused)position=carousel.scrollLeft%Math.max(1,cycleWidth())},{passive:true});
function stepTools(dir){paused=true;position=(position+dir*220+cycleWidth())%cycleWidth();carousel.scrollTo({left:position,behavior:reduced?'instant':'smooth'});}
$('#toolsPrev').addEventListener('click',()=>stepTools(-1));$('#toolsNext').addEventListener('click',()=>stepTools(1));
requestAnimationFrame(animateTools);
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.1});$$('.reveal').forEach(el=>observer.observe(el));$('#year').textContent=new Date().getFullYear();

// Gemini-powered portfolio assistant (API key remains on the server).
const chatToggle=document.getElementById('chatToggle');
const chatPanel=document.getElementById('chatPanel');
const chatClose=document.getElementById('chatClose');
const chatForm=document.getElementById('chatForm');
const chatInput=document.getElementById('chatInput');
const chatMessages=document.getElementById('chatMessages');
const chatSubmit=document.getElementById('chatSubmit');
const chatHistory=[];
function openChat(open){chatPanel.hidden=!open;chatToggle.setAttribute('aria-expanded',String(open));if(open)chatInput.focus();else chatToggle.focus()}
chatToggle.addEventListener('click',()=>openChat(chatPanel.hidden));
chatClose.addEventListener('click',()=>openChat(false));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!chatPanel.hidden)openChat(false)});
function chatBubble(message,role){const item=document.createElement('div');item.className='chat-bubble '+role;item.textContent=message;chatMessages.append(item);chatMessages.scrollTop=chatMessages.scrollHeight;return item}
chatForm.addEventListener('submit',async e=>{
 e.preventDefault();const message=chatInput.value.trim();if(!message||chatSubmit.disabled)return;
 chatInput.value='';chatBubble(message,'user');chatHistory.push({role:'user',text:message});
 const pending=chatBubble('Thinking…','assistant');chatSubmit.disabled=true;chatInput.disabled=true;
 try{
  const res=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({messages:chatHistory.slice(-12)})});
  const data=await res.json();if(!res.ok)throw new Error(data.error||'Chat unavailable');
  pending.textContent=data.reply;chatHistory.push({role:'model',text:data.reply});
 }catch(err){pending.textContent='Chat is unavailable right now. Please use the Contact section to get in touch.';console.warn('Chat:',err.message)}
 finally{chatSubmit.disabled=false;chatInput.disabled=false;chatInput.focus()}
});
