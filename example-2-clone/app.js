const products=[
  {icon:"shirt",name:"Premium T-Shirt",status:"Pending",month:"Jan",date:"Payment confirmation",amount:"$300.00",direction:"pending"},
  {icon:"bag",name:"Leather Mini Bag",status:"Completed",month:"Feb",date:"Today, 09:00 AM",amount:"+$5,000.00",direction:"income"},
  {icon:"dress",name:"Hoodie Gonibong",status:"Completed",month:"Mar",date:"Yesterday, 2:30 PM",amount:"-$4,000.00",direction:"expense"},
  {icon:"phone",name:"iPhone 15 Pro Max",status:"Completed",month:"Apr",date:"Apr 1, 2024",amount:"+$1,200.00",direction:"income"},
  {icon:"cup",name:"Lotse",status:"Completed",month:"May",date:"May 4, 2024",amount:"+$860.00",direction:"income"},
  {icon:"leaf",name:"Starbucks",status:"Completed",month:"Jun",date:"Jun 19, 2024",amount:"-$240.00",direction:"expense"},
  {icon:"shirt",name:"Tinek Detstar T-Shirt",status:"Completed",month:"Jul",date:"Jul 12, 2024",amount:"+$740.00",direction:"income"}
];
const chartData={
  weekly:{labels:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],values:[[58,42],[72,53],[49,61],[83,68],[76,55],[91,74],[65,48]]},
  monthly:{labels:["Jan","Feb","Mar","Apr","May","Jun","Jul"],values:[[88,72],[58,83],[79,64],[73,54],[94,76],[84,69],[90,75]]},
  quarterly:{labels:["Q1","Q2","Q3","Q4"],values:[[64,52],[82,68],[91,73],[77,65]]},
  yearly:{labels:["2021","2022","2023","2024"],values:[[55,48],[69,57],[81,66],[94,72]]}
};
const icons={shirt:"TS",bag:"BG",dress:"DR",phone:"PH",cup:"CP",leaf:"LF"};
const list=document.querySelector("#transactionList");
const transactionState=document.querySelector("#transactionState");
let searchQuery="",activeMonth="";
function setTransactionState(type,message){
  transactionState.className=`transaction-state ${type}`;
  transactionState.innerHTML=type==="loading"?'<span class="state-spinner"></span><strong>Loading transactions...</strong>':type==="error"?`<strong>Unable to load transactions</strong><small>${message||"Check your connection and try again."}</small><button type="button" id="retryTransactions">Try again</button>`:`<strong>No transactions found</strong><small>${message||"Try changing the search or chart filter."}</small>`;
  transactionState.hidden=false;list.hidden=true;
  document.querySelector("#retryTransactions")?.addEventListener("click",loadTransactions);
}
function renderTransactions(){
  const filtered=products.filter(p=>(!activeMonth||p.month===activeMonth)&&`${p.name} ${p.status} ${p.month}`.toLowerCase().includes(searchQuery.toLowerCase()));
  if(!filtered.length){setTransactionState("empty");return}
  transactionState.hidden=true;list.hidden=false;
  list.innerHTML=filtered.slice(0,5).map(p=>`<div class="transaction ${p.status==="Pending"?"needs-action":""}" data-transaction="${p.name}"><span class="product-icon icon-${p.icon}" aria-hidden="true">${icons[p.icon]}</span><span class="transaction-copy"><strong>${p.name}${p.status==="Pending"?` <b>${p.amount}</b>`:""}</strong><small>${p.date}</small></span>${p.status==="Pending"?`<span class="transaction-actions"><button class="approve-transaction" type="button" aria-label="Approve ${p.name}">✓</button><button class="dismiss-transaction" type="button" aria-label="Dismiss ${p.name}">×</button></span>`:`<strong class="transaction-amount ${p.direction}">${p.amount}</strong>`}</div>`).join("");
}
function loadTransactions(){
  setTransactionState("loading");
  window.setTimeout(()=>{try{renderTransactions()}catch(error){setTransactionState("error",error.message)}},450);
}
function renderChart(period="monthly"){
  const data=chartData[period],chart=document.querySelector("#revenueChart");
  chart.classList.remove("chart-ready");
  const totals=data.values.map(([income,expenses])=>Math.round((income+expenses)/2));
  chart.innerHTML=`<div class="chart-y-axis"><span>80k</span><span>60k</span><span>40k</span><span>20k</span><span>0</span></div><div class="chart-plot"><div class="average-line"><span>Avg. 59.1k</span></div>${totals.map((height,index)=>`<button class="bar-group ${period==="monthly"&&data.labels[index]==="May"?"featured":""}" type="button" data-label="${data.labels[index]}" aria-label="Filter transactions for ${data.labels[index]}"><span class="single-bar" style="--bar-height:${height}%"></span><small>${data.labels[index]}</small></button>`).join("")}</div>`;
  requestAnimationFrame(()=>requestAnimationFrame(()=>chart.classList.add("chart-ready")));
  chart.querySelectorAll(".bar-group").forEach(bar=>bar.addEventListener("click",()=>{
    const label=bar.dataset.label;
    chart.querySelectorAll(".bar-group").forEach(item=>item.classList.toggle("selected",item===bar));
    if(period==="monthly"){activeMonth=label;document.querySelector("#transactionFilter").textContent=`Showing ${label} transactions`;document.querySelector("#clearChartFilter").hidden=false}
    else{activeMonth="";document.querySelector("#transactionFilter").textContent=`${label} overview`;document.querySelector("#clearChartFilter").hidden=true}
    renderTransactions();
  }));
}
document.querySelector("#chartPeriod").addEventListener("change",e=>{activeMonth="";document.querySelector("#transactionFilter").textContent="Recent activity";document.querySelector("#clearChartFilter").hidden=true;renderChart(e.target.value);loadTransactions()});
document.querySelector("#clearChartFilter").addEventListener("click",()=>{activeMonth="";document.querySelectorAll(".bar-group").forEach(b=>b.classList.remove("selected"));document.querySelector("#transactionFilter").textContent="Recent activity";document.querySelector("#clearChartFilter").hidden=true;renderTransactions()});
document.querySelector("#search").addEventListener("input",e=>{searchQuery=e.target.value;renderTransactions()});
list.addEventListener("click",event=>{
  const row=event.target.closest(".transaction");
  if(!row)return;
  if(event.target.closest(".approve-transaction")){row.classList.remove("needs-action");row.querySelector(".transaction-actions").innerHTML='<strong class="action-confirmed">Approved</strong>'}
  if(event.target.closest(".dismiss-transaction")){row.classList.add("dismissed");window.setTimeout(()=>row.remove(),220)}
});
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
renderChart();
loadTransactions();

const kpiGroup = document.querySelector(".summary-grid");
const kpiCards = [...kpiGroup.querySelectorAll(".kpi-card")];
const defaultKpi = kpiCards[0];

function highlightKpi(card = defaultKpi) {
  kpiCards.forEach(kpi => kpi.classList.toggle("is-highlighted", kpi === card));
}

kpiCards.forEach(card => {
  card.addEventListener("pointerenter", () => highlightKpi(card));
  card.addEventListener("focusin", () => highlightKpi(card));
});

kpiGroup.addEventListener("pointerleave", () => highlightKpi());
kpiGroup.addEventListener("focusout", event => {
  if (!kpiGroup.contains(event.relatedTarget)) highlightKpi();
});

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
