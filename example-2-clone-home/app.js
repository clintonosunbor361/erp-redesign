const dashboardData={moneyFlow:[['Jan',180000,120000],['Feb',210000,150000],['Mar',195000,135000],['Apr',240000,165000],['May',225000,160000],['Jun',260000,180000],['Jul',200000,100000]],previousNetIncome:435000,orders:{launched:233,ongoing:23,sold:226},returns:32000};
dashboardData.income=dashboardData.moneyFlow.reduce((sum,row)=>sum+row[1],0);
dashboardData.expenses=dashboardData.moneyFlow.reduce((sum,row)=>sum+row[2],0);
dashboardData.netIncome=dashboardData.income-dashboardData.expenses;
dashboardData.totalOrders=Object.values(dashboardData.orders).reduce((sum,value)=>sum+value,0);
dashboardData.netChange=(dashboardData.netIncome-dashboardData.previousNetIncome)/dashboardData.previousNetIncome*100;
if(new URLSearchParams(location.search).get('theme')==='blue'){
 document.body.classList.add('theme-blue');
 const navigation=document.querySelector('.sidebar nav[aria-label="Fashion CRM"]');
 const sidebarItems=[
  ['#overview','Dashboard'],
  ['#orders','Orders'],
  ['#clients','Customers'],
  ['#collections','Inventory'],
  ['#reports','Analytics']
 ].map(([href,label])=>{
  const link=navigation.querySelector(`a[href="${href}"]`);
  link.querySelector('.nav-text').textContent=label;
  link.setAttribute('aria-label',label);
  link.title=label;
  if(label==='Inventory'){
   link.href='#inventory';
   link.querySelector('.nav-icon').innerHTML='<path d="m12 3 9 5v9l-9 5-9-5V8l9-5Zm-9 5 9 5 9-5M12 13v9M7.5 5.5l9 5"/>';
  }
  if(label==='Analytics')link.href='#statistics';
  return link;
 });
 navigation.replaceChildren(...sidebarItems);
 const workspaceNavigation=document.querySelector('.sidebar nav[aria-label="Workspace settings"]');
 const teamLink=workspaceNavigation.querySelector('a[href="#security"]');
 teamLink.querySelector('.nav-text').textContent='Team space';
 teamLink.setAttribute('aria-label','Team space');
 teamLink.title='Team space';
 teamLink.querySelector('.nav-icon').innerHTML=navigation.querySelector('a[href="#clients"] .nav-icon').innerHTML;
 const sidebarFooter=document.createElement('div');
 sidebarFooter.className='sidebar-footer';
 sidebarFooter.append(workspaceNavigation);
 sidebarFooter.insertAdjacentHTML('beforeend','<div class="sidebar-profile" role="group" aria-label="Deji&amp;Kola, CEO" title="Deji&amp;Kola · CEO"><span class="sidebar-avatar" aria-hidden="true">DK</span><div class="sidebar-profile-copy"><strong>Deji&amp;Kola</strong><small>CEO</small></div></div>');
 document.querySelector('.sidebar').append(sidebarFooter);
 document.querySelector('.sidebar .divider').remove();
 document.querySelector('.sidebar .menu-label').remove();
 const revenueCard=document.querySelector('.dashboard-grid>.revenue');
 if(revenueCard&&window.FinSetUI){
  const legacyHtml=revenueCard.innerHTML;
  const flowData=dashboardData.moneyFlow.map(row=>[row[0],row[1]/300000*100,row[2]/300000*100]);
  const actionsHtml='<div class="money-legend"><span><i></i>Income</span><span><i></i>Expense</span></div><select aria-label="Money flow account"><option>All accounts</option></select><select aria-label="Money flow period"><option>This year</option></select>';
  const flowHtml='<div class="money-flow-chart"><div class="money-axis"><span>₦300k</span><span>₦200k</span><span>₦100k</span><span>₦0</span></div><div class="money-plot"><div class="money-bars">'+flowData.map(row=>`<span><i style="--bar:${row[1]}%"></i><i style="--bar:${row[2]}%"></i></span>`).join('')+'</div><div class="money-months">'+flowData.map(row=>`<span>${row[0]}</span>`).join('')+'</div></div></div><div class="legacy-revenue-engine" hidden>'+legacyHtml+'</div>';
  const shell=document.createElement('template');
  shell.innerHTML=FinSetUI.ChartCard({title:'Money flow',className:'panel revenue money-flow',attributes:{id:'statistics'},actionsHtml,contentHtml:flowHtml});
  revenueCard.replaceWith(shell.content.firstElementChild);
 }
 const incomeCard=document.querySelector('[data-detail="income"]')?.closest('.metric');
 if(incomeCard){incomeCard.querySelector('[data-naira]').dataset.naira=dashboardData.netIncome;incomeCard.querySelector('small').innerHTML=`↗ +${dashboardData.netChange.toFixed(1)}% <i>vs previous period</i>`}
 const ordersCard=document.querySelector('[data-detail="orders"]')?.closest('.metric');
 if(ordersCard)ordersCard.querySelector('h2').textContent=dashboardData.totalOrders;
 [['income','wallet'],['returns','return'],['orders','bag']].forEach(([key,icon])=>{
  const card=document.querySelector(`[data-detail="${key}"]`)?.closest('.metric');
  if(!card)return;
  card.dataset.kpi=key;
  const mark=document.createElement('span');
  mark.className='kpi-icon';
  mark.setAttribute('aria-hidden','true');
  mark.innerHTML=FinSetUI.Icon(icon);
  card.querySelector('p').prepend(mark);
 });
}
const products=[
  ["👕","Premium T-Shirt","Completed"],["♠","Playstation 5","Pending"],["♟","Hoodie Gonibong","Pending"],
  ["▣","iPhone 15 Pro Max","Completed"],["☕","Lotse","Completed"],["◉","Starbucks","Completed"],["👕","Tinek Detstar T-Shirt","Completed"]
];
const heights=[[88,72],[58,83],[79,64],[73,54],[94,76],[84,69]];
const transactionDetails=[['Jul 12, 2024','₦48,000','Apparel'],['Jul 12, 2024','₦42,000','Electronics'],['Jul 11, 2024','₦32,500','Apparel'],['Jul 10, 2024','₦58,000','Electronics'],['Jul 9, 2024','₦18,000','Food & Drink'],['Jul 8, 2024','₦12,500','Food & Drink'],['Jul 7, 2024','₦45,000','Apparel']];
const list=document.querySelector("#transactionList");
function renderTransactions(q=""){
  const filtered=products.filter(p=>p.join(" ").toLowerCase().includes(q.toLowerCase()));
  list.innerHTML=filtered.slice(0,5).map(p=>{const detail=transactionDetails[products.indexOf(p)];const status=document.body.classList.contains('theme-blue')?SiohiomaUI.StatusBadge({label:p[2]}):'';return `<div class="transaction"><span class="transaction-name"><i class="product-icon">${p[0]}</i><strong>${p[1]}</strong>${status}</span><strong class="transaction-amount">${detail[1]}</strong><span class="transaction-category">${detail[2]}</span><span class="transaction-date">${detail[0]}</span></div>`}).join("")||'<p style="color:#888;font-size:11px">No matching transactions.</p>';
}
document.querySelectorAll('[data-naira]').forEach(el => {
 const value=Number(el.dataset.naira);
 el.innerHTML='<span class="currency-symbol">&#8358;</span>'+formatNaira(value,Math.abs(value)>10000000).replace('\u20a6','');
 el.setAttribute('aria-label',formatNaira(value));
 el.title=formatNaira(value);
});

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

const kpiGroup=document.querySelector('.summary-grid');
const kpiCards=[...kpiGroup.querySelectorAll('.kpi-card')];
const defaultKpi=document.body.classList.contains('theme-blue')?null:kpiCards[0];
const supportsKpiHover=window.matchMedia('(hover: hover) and (pointer: fine)');
function highlightKpi(card=defaultKpi){
 kpiCards.forEach(kpi=>kpi.classList.toggle('is-highlighted',kpi===card));
}
kpiCards.forEach(card=>{
 card.addEventListener('pointerenter',()=>{if(supportsKpiHover.matches)highlightKpi(card)});
 card.addEventListener('focusin',()=>highlightKpi(card));
});
kpiGroup.addEventListener('pointerleave',()=>{if(supportsKpiHover.matches)highlightKpi()});
kpiGroup.addEventListener('focusout',event=>{if(!kpiGroup.contains(event.relatedTarget))highlightKpi()});
if(document.body.classList.contains('theme-blue'))highlightKpi();

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

const cardDetails=document.querySelector('#cardDetails');
const detailCopy={
 income:['Net Income',`<p><strong>${formatNaira(dashboardData.netIncome)}</strong> net income, up ${dashboardData.netChange.toFixed(1)}% from the previous period.</p><p>The full view will show payment history and income sources.</p>`],
 returns:['Total Return',`<p><strong>${formatNaira(32000)}</strong> in returns, down 24% from last month.</p><p>The full view will show returned orders, refund amounts, and return reasons.</p>`],
 orders:['Total Orders','<p><strong>482 orders</strong> placed this period.</p><p>The full view will let you filter orders by customer, product, and fulfilment status.</p>'],
 revenue:['Money flow',`<p><strong>${formatNaira(dashboardData.income)}</strong> income and <strong>${formatNaira(dashboardData.expenses)}</strong> expenses across seven months.</p><p>Net income is <strong>${formatNaira(dashboardData.netIncome)}</strong>.</p>`],
 sales:['Total Sales Report',`<p><strong>${dashboardData.orders.launched}</strong> launched, <strong>${dashboardData.orders.ongoing}</strong> ongoing, and <strong>${dashboardData.orders.sold}</strong> sold.</p><p>These add up to <strong>${dashboardData.totalOrders}</strong> total orders.</p>`],
 transactions:['Transactions','<p>Review the recent transactions listed on this dashboard.</p><p>The full history will support date, payment-status, and customer filters.</p>']
};
document.querySelectorAll('[data-detail]').forEach(button=>button.addEventListener('click',()=>{
 const [title,content]=detailCopy[button.dataset.detail];
 document.querySelector('#detailTitle').textContent=title;
 document.querySelector('#detailContent').innerHTML=content+'<p class="preview-note">Preview only. A dedicated details page will be added later.</p>';
 cardDetails.showModal();
}));
document.querySelector('#closeDetails').addEventListener('click',()=>cardDetails.close());

// Fit full KPI amounts inside equal-width cards without clipping.
function fitKpiAmounts(){
 document.querySelectorAll('.summary-grid [data-naira]').forEach(el=>{
  el.style.fontSize='';
  const size=parseFloat(getComputedStyle(el).fontSize);
  if(el.scrollWidth>el.clientWidth&&el.clientWidth>0)el.style.fontSize=(size*el.clientWidth/el.scrollWidth)+'px';
 });
}
const kpiResizeObserver=new ResizeObserver(fitKpiAmounts);
document.querySelectorAll('.summary-grid .metric').forEach(el=>kpiResizeObserver.observe(el));
if(document.fonts)document.fonts.ready.then(fitKpiAmounts);
fitKpiAmounts();
