const products=[
  ["👕","Premium T-Shirt","Completed"],["♠","Playstation 5","Pending"],["♟","Hoodie Gonibong","Pending"],
  ["▣","iPhone 15 Pro Max","Completed"],["☕","Lotse","Completed"],["◉","Starbucks","Completed"],["👕","Tinek Detstar T-Shirt","Completed"]
];
const heights=[[88,72],[58,83],[79,64],[73,54],[94,76],[84,69]];
const list=document.querySelector("#transactionList");
function renderTransactions(q=""){
  const filtered=products.filter(p=>p.join(" ").toLowerCase().includes(q.toLowerCase()));
  list.innerHTML=filtered.map(p=>`<div class="transaction"><span class="product-icon">${p[0]}</span><span class="transaction-copy"><strong>${p[1]}</strong><small>Jul 12th 2024</small></span><span class="transaction-status"><strong>${p[2]}</strong><small>0JWEJS7ISNC</small></span></div>`).join("")||'<p style="color:#888;font-size:11px">No matching transactions.</p>';
}
document.querySelector("#revenueChart").innerHTML=heights.map(h=>`<span class="bar-pair"><i style="height:${h[0]}%"></i><i style="height:${h[1]}%"></i></span>`).join("");
document.querySelector("#search").addEventListener("input",e=>renderTransactions(e.target.value));
document.querySelectorAll(".sidebar nav a").forEach(a=>a.addEventListener("click",()=>{document.querySelectorAll(".sidebar nav a").forEach(x=>{x.classList.remove("active");x.removeAttribute("aria-current")});a.classList.add("active");a.setAttribute("aria-current","page");closeMobileSidebar();if(mobileQuery.matches)document.querySelector("#mainContent").focus({preventScroll:true})}));
const app=document.querySelector('.app');
const sidebar=document.querySelector('.sidebar');
const sidebarToggle=document.querySelector('.sidebar-toggle');
const mobileMenu=document.querySelector('.mobile-menu');
const mobileQuery=matchMedia('(max-width:760px)');
let collapsed=false;
function syncSidebar(){
 const expanded=mobileQuery.matches?sidebar.classList.contains('open'):!collapsed;
 sidebarToggle.setAttribute('aria-expanded',String(expanded));
 sidebarToggle.setAttribute('aria-label',mobileQuery.matches?'Close menu':expanded?'Collapse sidebar':'Expand sidebar');
 sidebarToggle.title=sidebarToggle.getAttribute('aria-label');
 mobileMenu.setAttribute('aria-expanded',String(sidebar.classList.contains('open')));
 mobileMenu.setAttribute('aria-controls','sidebar');
 const open=mobileQuery.matches&&sidebar.classList.contains('open');
 document.body.classList.toggle('drawer-open',open);
 document.querySelector('.drawer-backdrop').hidden=!open;
 document.querySelector('.main').inert=open;
 document.querySelector('.mobile-tabs').inert=open;
 sidebar.inert=mobileQuery.matches&&!open;
 document.querySelector('.mobile-more').setAttribute('aria-expanded',String(open));
 if(open){sidebar.setAttribute('role','dialog');sidebar.setAttribute('aria-modal','true');sidebar.setAttribute('aria-label','Navigation')}else{sidebar.removeAttribute('role');sidebar.removeAttribute('aria-modal');sidebar.removeAttribute('aria-label')}

}
function closeMobileSidebar(){sidebar.classList.remove('open');syncSidebar()}
sidebarToggle.addEventListener('click',()=>{
 if(mobileQuery.matches){closeMobileSidebar();mobileMenu.focus();return}
 collapsed=!collapsed;app.classList.toggle('sidebar-collapsed',collapsed);syncSidebar();
});
function openMobileSidebar(){sidebar.classList.add('open');syncSidebar();sidebarToggle.focus()}
mobileMenu.addEventListener('click',openMobileSidebar);
document.querySelector('.mobile-more').addEventListener('click',openMobileSidebar);
document.querySelector('.drawer-backdrop').addEventListener('click',()=>{closeMobileSidebar();mobileMenu.focus()});
document.querySelectorAll('.mobile-tabs a').forEach(link=>link.addEventListener('click',()=>{document.querySelectorAll('.mobile-tabs a').forEach(a=>{a.classList.toggle('active',a===link);a.removeAttribute('aria-current')});link.setAttribute('aria-current','location')}));
sidebar.addEventListener('keydown',event=>{if(!mobileQuery.matches||!sidebar.classList.contains('open')||event.key!=='Tab')return;const focusable=[...sidebar.querySelectorAll('a[href],button')];const first=focusable[0],last=focusable.at(-1);if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}});

mobileQuery.addEventListener('change',()=>{closeMobileSidebar()});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&mobileQuery.matches&&sidebar.classList.contains('open')){closeMobileSidebar();mobileMenu.focus()}});
syncSidebar();
document.querySelector("#exportPdf").addEventListener("click",()=>{const t=document.querySelector("#toast");t.classList.add("show");setTimeout(()=>{t.classList.remove("show");window.print()},600)});
renderTransactions();

const sectionTooltip=document.createElement('div');
sectionTooltip.className='sidebar-tooltip';
sectionTooltip.id='sidebar-section-tooltip';
sectionTooltip.setAttribute('role','tooltip');
sectionTooltip.hidden=true;
document.body.append(sectionTooltip);
let tooltipLink=null;
function hideSectionTooltip(){
 if(tooltipLink)tooltipLink.removeAttribute('aria-describedby');
 tooltipLink=null;
 sectionTooltip.classList.remove('visible');
 sectionTooltip.hidden=true;
}
function showSectionTooltip(link){
 if(mobileQuery.matches||!collapsed)return;
 hideSectionTooltip();
 tooltipLink=link;
 sectionTooltip.textContent=link.getAttribute('aria-label');
 sectionTooltip.hidden=false;
 link.setAttribute('aria-describedby',sectionTooltip.id);
 const rect=link.getBoundingClientRect();
 sectionTooltip.style.left=Math.min(rect.right+22,window.innerWidth-sectionTooltip.offsetWidth-8)+'px';
 sectionTooltip.style.top=Math.max(8,Math.min(rect.top+(rect.height-sectionTooltip.offsetHeight)/2,window.innerHeight-sectionTooltip.offsetHeight-8))+'px';
 sectionTooltip.classList.add('visible');
}
document.querySelectorAll('.sidebar nav a').forEach(link=>{
 link.removeAttribute('title');
 link.addEventListener('mouseenter',()=>showSectionTooltip(link));
 link.addEventListener('mouseleave',hideSectionTooltip);
 link.addEventListener('focus',()=>showSectionTooltip(link));
 link.addEventListener('blur',hideSectionTooltip);
 link.addEventListener('click',hideSectionTooltip);
});
sidebarToggle.addEventListener('click',hideSectionTooltip);
window.addEventListener('resize',hideSectionTooltip);
window.addEventListener('scroll',hideSectionTooltip,true);
document.addEventListener('keydown',event=>{if(event.key==='Escape')hideSectionTooltip()});
