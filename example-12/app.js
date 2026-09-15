const kpis = [
  ['Total Balance', '₦482,500', '↗ 8.2%', 'from last week', false, 'wallet'],
  ['Spent this Month', '₦146,200', '↗ 5.3%', 'vs last month', false, 'chart-no-axes-combined'],
  ['Upcoming Payments', '₦336,300', '● 3 due this week', '', true, 'calendar-days'],
  ['Total Savings', '₦680,000', '↗ 6.8%', 'from last month', false, 'piggy-bank']
];
const categories = [['Food','60.12%','₦182,500','#2ca4ed'],['Shopping','20.12%','₦82,500','#16b86a'],['Bills','23.12%','₦52,500','#a16bf2'],['Subscriptions','14.72%','₦32,500','#ff443c']];
const transactions = [['Netflix','GTBank Visa · 1234','Streaming','Oct 18, 2026','-₦1,500',''],['Uber','Access Bank Visa · 5678','Transportation','Oct 15, 2026','-₦3,200','purple'],['Zoom','Zenith Bank Visa · 9012','Software','Oct 1, 2026','-₦17,000','green']];

document.querySelector('#kpis').innerHTML = kpis.map(k => `<article class="kpi"><div><span>${k[0]}</span><i data-lucide="${k[5]}"></i></div><strong>${k[1]}</strong><small><b class="${k[4] ? 'orange' : ''}">${k[2]}</b>${k[3]}</small></article>`).join('');
document.querySelector('#categories').innerHTML = categories.map(c => `<div class="category"><span><i style="background:${c[3]}"></i>${c[0]} <small>${c[1]}</small></span><strong>${c[2]}</strong></div>`).join('');

function render(q = '') {
  const filtered = transactions.filter(t => t.join(' ').toLowerCase().includes(q.toLowerCase()));
  document.querySelector('#transactions').innerHTML = filtered.map((t, i) => `<div class="transaction"><div class="merchant"><b style="background:${i === 1 ? '#111' : i === 2 ? '#168be0' : '#e50914'}">${t[0].slice(0, 2)}</b><span><strong>${t[0]}</strong><small>${t[1]}</small></span></div><span class="tag ${t[5]}">${t[2]}</span><span>${t[3]}</span><strong>${t[4]}</strong></div>`).join('');
  document.querySelector('#empty').hidden = filtered.length > 0;
}
render();
document.querySelector('#search').addEventListener('input', e => render(e.target.value));
document.addEventListener('keydown', e => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); document.querySelector('#search').focus(); } });
const toggle = document.querySelector('#themeToggle');
if (localStorage.getItem('cardon-theme') === 'dark') document.body.classList.add('dark');
toggle.addEventListener('click', () => { document.body.classList.toggle('dark'); localStorage.setItem('cardon-theme', document.body.classList.contains('dark') ? 'dark' : 'light'); });
if (window.lucide) window.lucide.createIcons();
