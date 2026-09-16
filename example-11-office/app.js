const icons={
  revenue:'<path d="M4 18V9m5 9V5m5 13v-6m5 6V3"/>',
  orders:'<path d="M5 7h14l2 14H3L5 7Zm3 1V6a4 4 0 0 1 8 0v2"/>',
  clients:'<circle cx="9" cy="8" r="3"/><path d="M3 20a6 6 0 0 1 12 0m2-15a3 3 0 0 1 0 6m1 4a5 5 0 0 1 3 5"/>',
  average:'<path d="M4 16 9 11l3 3 8-8"/><path d="M15 6h5v5"/>'
};
const kpis=[
  {label:'Total Revenue',value:'₦84.6m',change:'+12.4%',note:'from last month',icon:'revenue'},
  {label:'Total Orders',value:'1,248',change:'+8.1%',note:'from last month',icon:'orders'},
  {label:'Active Clients',value:'386',change:'+6.7%',note:'from last month',icon:'clients'},
  {label:'Average Order',value:'₦67,820',change:'-2.3%',note:'from last month',icon:'average',negative:true}
];
const orders=[
  {name:'Amina Bello',email:'amina@maison.co',id:'#DK-10428',items:3,amount:'₦485,000',status:'Completed',date:'Sep 15, 2026',initials:'AB'},
  {name:'Tunde Adebayo',email:'tunde@north.ng',id:'#DK-10427',items:2,amount:'₦320,000',status:'Processing',date:'Sep 14, 2026',initials:'TA'},
  {name:'Nneka Okafor',email:'nneka@studio.africa',id:'#DK-10426',items:5,amount:'₦780,000',status:'Completed',date:'Sep 13, 2026',initials:'NO'},
  {name:'David Mensah',email:'david@arc.com',id:'#DK-10425',items:1,amount:'₦165,000',status:'Pending',date:'Sep 12, 2026',initials:'DM'}
];
document.querySelector('#kpiGrid').innerHTML=kpis.map(item=>`<article class="kpi-card"><div class="kpi-top"><span>${item.label}</span><i class="kpi-icon"><svg viewBox="0 0 24 24">${icons[item.icon]}</svg></i></div><strong class="kpi-value">${item.value}</strong><div class="kpi-foot"><b class="${item.negative?'negative':''}">${item.change}</b><span>${item.note}</span></div></article>`).join('');
function renderOrders(query=''){
  const q=query.trim().toLowerCase();
  const filtered=orders.filter(item=>Object.values(item).some(value=>String(value).toLowerCase().includes(q)));
  document.querySelector('#ordersBody').innerHTML=filtered.map(item=>`<tr><td><div class="client-cell"><i class="client-avatar">${item.initials}</i><span><strong>${item.name}</strong><small>${item.email}</small></span></div></td><td>${item.id}</td><td>${item.items}</td><td class="amount">${item.amount}</td><td><span class="status ${item.status.toLowerCase()}">${item.status}</span></td><td>${item.date}</td></tr>`).join('');
  document.querySelector('#emptyState').hidden=filtered.length>0;
}
const values=[22,31,28,45,41,58,73],labels=['Mar','Apr','May','Jun','Jul','Aug','Sep'];
function renderLineChart(count=7){
  const data=values.slice(-count),names=labels.slice(-count),width=700,height=182,max=80;
  const points=data.map((value,index)=>`${index*(width/(data.length-1))},${height-value/max*height}`).join(' ');
  const area=`0,${height} ${points} ${width},${height}`;
  document.querySelector('#lineChart').innerHTML=`<svg viewBox="0 0 ${width} ${height}" preserveAspectRatio="none"><defs><linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#23a968" stop-opacity=".22"/><stop offset="1" stop-color="#23a968" stop-opacity="0"/></linearGradient></defs>${[0,1,2,3,4].map(i=>`<line class="grid-line" x1="0" x2="${width}" y1="${i*height/4}" y2="${i*height/4}"/>`).join('')}<polygon class="area-fill" points="${area}"/><polyline class="sales-line" points="${points}"/>${data.map((value,index)=>`<circle class="chart-dot" cx="${index*(width/(data.length-1))}" cy="${height-value/max*height}" r="4"><title>${names[index]}: ₦${value}m</title></circle>`).join('')}</svg><div class="x-labels">${names.map(name=>`<span>${name}</span>`).join('')}</div>`;
}
renderOrders();renderLineChart();
document.querySelector('#searchInput').addEventListener('input',event=>renderOrders(event.target.value));
document.addEventListener('keydown',event=>{if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='k'){event.preventDefault();document.querySelector('#searchInput').focus()}});
document.querySelector('#chartRange').addEventListener('change',event=>renderLineChart(event.target.selectedIndex?6:7));
document.querySelectorAll('.primary-nav a,.secondary-nav a').forEach(link=>link.addEventListener('click',()=>{document.querySelectorAll('.primary-nav a,.secondary-nav a').forEach(item=>item.classList.remove('active'));link.classList.add('active');closeMenu()}));
const themeToggle=document.querySelector('#themeToggle');
if(localStorage.getItem('office-theme')==='dark')document.body.classList.add('dark');
function syncTheme(){const dark=document.body.classList.contains('dark');themeToggle.setAttribute('aria-checked',String(dark));localStorage.setItem('office-theme',dark?'dark':'light')}
themeToggle.addEventListener('click',()=>{document.body.classList.toggle('dark');syncTheme()});syncTheme();
const sidebar=document.querySelector('#sidebar'),backdrop=document.querySelector('#backdrop');
function closeMenu(){sidebar.classList.remove('open');backdrop.hidden=true}
document.querySelector('#menuButton').addEventListener('click',()=>{sidebar.classList.add('open');backdrop.hidden=false});backdrop.addEventListener('click',closeMenu);
