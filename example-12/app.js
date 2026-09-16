const UI = window.FinSetUI;
const icon = UI.Icon;
const $ = s => document.querySelector(s);
const esc = UI.escape;
const usd = v => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(v);
const figure = v => usd(v).replace(/(\.\d{2})$/, '<span>$1</span>');
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
const incomeHistory = [10000, 11000, 10000, 14000, 13000, 8000, 8500];
const expenseHistory = [8500, 13000, 9000, 12500, 12500, 6076, 6222];
const summaries = { jul: { balance: 15700, income: 8500, expense: 6222, savings: 32913 }, jun: { balance: 14005, income: 8000, expense: 6076, savings: 29360 } };
const priorJune = { balance: 12800, income: 7600, expense: 5900, savings: 27000 };
const budgets = [['Cafe & Restaurants', 2250, 'var(--color-primary)'], ['Entertainment', 1500, 'var(--color-budget-entertainment)'], ['Investments', 1000, 'var(--color-budget-investments)'], ['Food & Groceries', 500, 'var(--color-budget-groceries)'], ['Health & Beauty', 300, 'var(--color-budget-health)'], ['Traveling', 400, 'var(--color-budget-travel)']];
const goals = [{ name: 'MacBook Pro', target: 1650, percent: 25 }, { name: 'New car', target: 60000, percent: 42 }, { name: 'New house', target: 150000, percent: 3 }];
const payments = [['25', '12:30', 10, 'YouTube', 'visa', 'Subscription', '▶', 'var(--color-merchant-youtube)', 'var(--color-white)'], ['26', '15:00', 150, 'Reserved', 'mastercard', 'Shopping', 'R', 'var(--color-white)', 'var(--color-merchant-ink)'], ['27', '9:00', 80, 'Yaposhka', 'mastercard', 'Cafe & Restaurants', 'Y', 'var(--color-merchant-yaposhka-bg)', 'var(--color-merchant-yaposhka)'], ['23', '10:15', 12, 'Spotify', 'visa', 'Entertainment', '♪', 'var(--color-merchant-spotify)', 'var(--color-merchant-ink)'], ['22', '16:45', 95, 'Whole Foods', 'mastercard', 'Food & Groceries', 'W', 'var(--color-merchant-grocery-bg)', 'var(--color-merchant-grocery)'], ['21', '11:20', 45, 'City Fitness', 'visa', 'Health & Beauty', 'F', 'var(--color-track)', 'var(--color-primary)']];
const widgetNames = { flow: 'Money flow', budget: 'Budget', transactions: 'Recent transactions', goals: 'Saving goals', networth: 'Net worth' };
const period = () => $('#month').value;
const dialogController = UI.bindModal({ dialog: $('#dialog'), title: $('#dialogTitle'), body: $('#dialogBody'), close: $('#closeDialog') });
function show(title, html) { dialogController.open(title, html); }
let toastTimer;
function toast(message) { $('#toast').textContent = message; $('#toast').classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => $('#toast').classList.remove('show'), 3000); }
const list = UI.DetailList;
function renderSummary() { const data = summaries[period()], previous = period() === 'jul' ? summaries.jun : priorJune; Object.entries(data).forEach(([key, value]) => { const el = $('#' + key); el.innerHTML = figure(value); const delta = (value / previous[key] - 1) * 100, badge = el.nextElementSibling.querySelector('.trend'); badge.textContent = (delta >= 0 ? '↑ ' : '↓ ') + Math.abs(delta).toFixed(1) + '%'; badge.className = 'trend ' + ((key === 'expense' ? delta <= 0 : delta >= 0) ? 'positive' : 'negative'); }); $('#networthValue').textContent = usd(data.balance + data.savings); }
function flowData() { let data = months.slice(0, period() === 'jul' ? 7 : 6).map((name, i) => ({ name, income: incomeHistory[i], expense: expenseHistory[i] })); if ($('#year').value === 'quarter')
    data = data.slice(-3); const fraction = $('#flowAccount').value === 'all' ? 1 : $('#flowAccount').value === 'visa' ? .7 : .3; return data.map(d => ({ ...d, income: Math.round(d.income * fraction), expense: Math.round(d.expense * fraction) })); }
function hideTooltip() { $('#flowTooltip').hidden = true; $('.plot').classList.remove('focused'); document.querySelectorAll('.month-bars').forEach(el => el.classList.remove('active')); }
function renderFlow() { hideTooltip(); const data = flowData(), max = 15000, width = 700 / data.length, y = v => 125 - v / max * 125; $('#axis').innerHTML = [15000, 10000, 5000, 0].map(v => `<span style="top:${y(v)}px">${v ? '$' + (v / 1000).toFixed(0) + ',000' : '$0'}</span>`).join(''); $('#flowSvg').innerHTML = [0, 5000, 10000, 15000].map(v => `<line class="chart-grid" x1="0" x2="700" y1="${y(v)}" y2="${y(v)}"/>`).join('') + data.map((d, i) => { const x = i * width + width * .16, w = width * .3; return `<g class="month-bars" data-month="${i}"><rect class="income-bar" x="${x}" y="${y(d.income)}" width="${w}" height="${125 - y(d.income)}" rx="9"/><rect class="expense-bar" x="${x + w + 3}" y="${y(d.expense)}" width="${w}" height="${125 - y(d.expense)}" rx="9"/></g>`; }).join(''); $('#monthLabels').innerHTML = data.map(d => `<span>${d.name}</span>`).join(''); $('#monthTargets').innerHTML = data.map((d, i) => UI.Button({ attributes: { 'data-month': i, 'aria-label': d.name + ': income ' + usd(d.income) + ', expenses ' + usd(d.expense) + ', net ' + usd(d.income - d.expense) } })).join(''); $('#monthTargets').querySelectorAll('button').forEach(button => { function activate() { hideTooltip(); const i = Number(button.dataset.month), d = data[i]; $('.plot').classList.add('focused'); $('#flowSvg').querySelector(`[data-month="${i}"]`).classList.add('active'); const tooltip = $('#flowTooltip'); tooltip.innerHTML = `<strong>${d.name} · ${$('#flowAccount').selectedOptions[0].textContent}</strong><div><span>Income</span><b>${usd(d.income)}</b></div><div><span>Expense</span><b>${usd(d.expense)}</b></div><div><span>Net flow</span><b>${usd(d.income - d.expense)}</b></div>`; tooltip.hidden = false; const bounds = $('.flow-chart').getBoundingClientRect(), r = button.getBoundingClientRect(); tooltip.style.left = Math.max(0, Math.min(r.left - bounds.left, bounds.width - tooltip.offsetWidth)) + 'px'; } button.onmouseenter = activate; button.onfocus = activate; button.onclick = activate; button.onmouseleave = hideTooltip; button.onblur = hideTooltip; }); }
function budgetData() { return budgets.map(([name, amount, color]) => ({ name, amount: period() === 'jul' ? amount : Math.round(amount * 5600 / 5950), color })); }
function budgetDetails(index) { const data = budgetData(), total = data.reduce((s, d) => s + d.amount, 0); show(index === undefined ? 'Monthly budget' : data[index].name, list((index === undefined ? data : [data[index]]).map(d => [d.name, usd(d.amount) + ' · ' + Math.round(d.amount / total * 100) + '%'])) + '<p>Planned allocations for ' + (period() === 'jul' ? 'July' : 'June') + '. Actual expenses are shown separately in Money flow.</p>'); }
function renderBudget() { const data = budgetData(), total = data.reduce((s, d) => s + d.amount, 0), circ = 2 * Math.PI * 70; let offset = 0; $('#budgetLegend').innerHTML = data.map((d, i) => UI.Button({ variant: 'budget-legend-row', attributes: { 'data-budget': i, style: '--color:' + d.color }, contentHtml: '<i></i>' + esc(d.name) })).join(''); $('#budgetSvg').innerHTML = data.map((d, i) => { const len = d.amount / total * circ, svg = `<circle class="ring-segment" cx="90" cy="90" r="70" transform="rotate(-90 90 90)" style="--color:${d.color}" stroke-dasharray="${Math.max(1, len - 9)} ${circ - Math.max(1, len - 9)}" stroke-dashoffset="${-offset - 4.5}" data-budget="${i}"><title>${d.name}: ${usd(d.amount)}</title></circle>`; offset += len; return svg; }).join(''); $('.donut strong').innerHTML = figure(total); $('#budgetSvg').setAttribute('aria-label', `Monthly budget ${usd(total)}. Category details available in the legend.`); }
function filteredPayments() { const account = $('#transactionAccount').value, q = $('#transactionSearch').value.trim().toLowerCase(); return payments.filter(r => (account === 'all' || r[4] === account) && (r[3] + ' ' + r[5]).toLowerCase().includes(q)); }
function renderTransactions() {
    $('#transactionRows').innerHTML = UI.DataTable.rows(filteredPayments().slice(0, 3), [
        { value: r => r[0] + ' ' + (period() === 'jul' ? 'Jul' : 'Jun') + ' ' + r[1] },
        { className: 'amount', value: r => '− ' + usd(r[2]).replace('.00', '') },
        { renderHtml: r => '<div class="payment-name"><span class="payment-mark" style="--brand-bg:' + r[7] + ';--brand-color:' + r[8] + '">' + esc(r[6]) + '</span>' + esc(r[3]) + '</div>' },
        { value: r => r[4] === 'visa' ? 'VISA •3254' : 'Mastercard •2154' },
        { value: r => r[5] }
    ], 'No matching transactions.');
}
function goalDetails(index) { const selected = index === undefined ? goals : [goals[index]]; show(index === undefined ? 'Saving goals' : selected[0].name, selected.map(g => `<div class="goal-detail"><h3>${g.name}</h3>${list([['Saved', usd(g.target * g.percent / 100)], ['Target', usd(g.target)], ['Progress', g.percent + '%'], ['Still to save', usd(g.target * (1 - g.percent / 100))]])}</div>`).join('') + '<p>Goals show your current earmarked savings, independent of the reporting month.</p>'); }
function renderGoals() { $('#goalList').innerHTML = goals.map((g, i) => UI.Button({ variant: 'goal', attributes: { 'data-goal': i, 'aria-label': g.name + ', ' + g.percent + '% of ' + usd(g.target) + ' saved' }, contentHtml: '<span class="goal-heading"><span>' + esc(g.name) + '</span><span>' + usd(g.target).replace('.00', '') + '</span></span><span class="goal-track"><span style="width:' + g.percent + '%">' + g.percent + '%</span></span>' })).join(''); }
function render() { renderSummary(); renderFlow(); renderBudget(); renderTransactions(); }
$('#month').onchange = render;
$('#flowAccount').onchange = renderFlow;
$('#year').onchange = renderFlow;
$('#transactionAccount').onchange = renderTransactions;
$('#transactionSearch').oninput = renderTransactions;
$('#budgetDetails').onclick = () => budgetDetails();
$('#goalsDetails').onclick = () => goalDetails();
$('#networthDetails').onclick = () => show('Net worth', list([['Available balance', usd(summaries[period()].balance)], ['Total savings', usd(summaries[period()].savings)], ['Total assets', usd(summaries[period()].balance + summaries[period()].savings)]]) + '<p>No liabilities have been entered in this preview.</p>');
document.addEventListener('click', e => { const budget = e.target.closest('[data-budget]'), goal = e.target.closest('[data-goal]'), detail = e.target.closest('[data-detail]'); if (budget)
    budgetDetails(Number(budget.dataset.budget)); if (goal)
    goalDetails(Number(goal.dataset.goal)); if (detail) {
    const key = detail.dataset.detail;
    show(detail.getAttribute('aria-label').replace('View ', '').replace(/^./, c => c.toUpperCase()), list([['July', usd(summaries.jul[key])], ['June', usd(summaries.jun[key])]]) + '<p>Illustrative financial summary. Recent transactions show a sample of account activity.</p>');
} });
$('#seeAll').onclick = () => { const rows = filteredPayments(); show('Transactions', rows.length ? list(rows.map(r => [r[0] + ' ' + (period() === 'jul' ? 'Jul' : 'Jun') + ' · ' + r[3] + ' · ' + (r[4] === 'visa' ? 'Visa' : 'Mastercard'), '−' + usd(r[2])])) : '<p>No transactions found. Try another search or account.</p>'); };
function reveal(name) { const card = $(`[data-widget="${name}"]`); card.hidden = false; return card; }
$('#searchButton').onclick = () => { reveal('transactions'); $('.transaction-search').hidden = false; $('#transactionSearch').focus(); $('#transactions').scrollIntoView({ behavior: 'smooth', block: 'nearest' }); };
function manageWidgets(addOnly = false) { const cards = [...document.querySelectorAll('[data-widget]')], hidden = cards.filter(c => c.hidden); if (addOnly) {
    show('Add a widget', hidden.length ? '<p>Choose a widget to add to your dashboard.</p><div class="widget-options">' + hidden.map(c => UI.Button({ variant: 'outline', icon: 'plus', label: widgetNames[c.dataset.widget], attributes: { 'data-add': c.dataset.widget } })).join('') + '</div>' : '<p>All available widgets are already on your dashboard. Use Manage widgets to change visibility.</p>');
    return;
} show('Manage widgets', '<p>Choose what appears on your dashboard.</p><form id="widgetForm"><div class="widget-options">' + cards.map(c => '<label>' + UI.Input({ type: 'checkbox', attributes: { name: 'widget', value: c.dataset.widget, checked: !c.hidden } }) + esc(widgetNames[c.dataset.widget]) + '</label>').join('') + '</div><p id="widgetError" role="status"></p>' + UI.Button({ variant: 'primary', label: 'Save layout', attributes: { type: 'submit' } }) + '</form>'); $('#widgetForm').onsubmit = e => { e.preventDefault(); const selected = new FormData(e.currentTarget).getAll('widget'); if (!selected.length) {
    $('#widgetError').textContent = 'Keep at least one widget visible.';
    return;
} cards.forEach(c => c.hidden = !selected.includes(c.dataset.widget)); $('.dashboard-grid').classList.toggle('customized', selected.length !== 4 || selected.includes('networth')); $('#dialog').close(); toast('Dashboard layout updated'); }; }
$('#manageWidgets').onclick = () => manageWidgets();
$('#addWidget').onclick = () => manageWidgets(true);
$('#dialogBody').addEventListener('click', e => { const button = e.target.closest('[data-add]'); if (button) {
    reveal(button.dataset.add);
    $('.dashboard-grid').classList.add('customized');
    $('#dialog').close();
    toast(widgetNames[button.dataset.add] + ' added');
} });
function theme(dark) { document.body.classList.toggle('dark', dark); $('#lightTheme').classList.toggle('selected', !dark); $('#darkTheme').classList.toggle('selected', dark); $('#lightTheme').setAttribute('aria-pressed', String(!dark)); $('#darkTheme').setAttribute('aria-pressed', String(dark)); try {
    localStorage.setItem('finset-theme', dark ? 'dark' : 'light');
}
catch { } }
$('#lightTheme').onclick = () => theme(false);
$('#darkTheme').onclick = () => theme(true);
try {
    theme(localStorage.getItem('finset-theme') === 'dark');
}
catch { }
const mobile = matchMedia('(max-width:560px)');
const { menu } = UI.bindSidebar({ app: $('.app'), sidebar: $('#sidebar'), main: $('#main'), toggle: $('#collapse'), trigger: $('#mobileMenu'), backdrop: $('#backdrop'), mobileQuery: mobile });
const information = { wallet: ['Your wallet', () => list([['Visa •3254', usd(summaries[period()].balance * .7)], ['Mastercard •2154', usd(summaries[period()].balance * .3)]]) + '<p>Balances and chart activity use a 70% / 30% illustrative account allocation.</p>'], settings: ['Settings', () => '<p>Currency: USD · Language: English</p><p>Use the sun and moon controls in the sidebar to change your theme.</p>'], help: ['Welcome to FinSet', () => '<p>Compare your income and expenses, explore your budget, and keep track of saving goals.</p><p>Use the month selector for June and July sample data. Chart bars support hover, keyboard focus, and touch. Manage widgets to personalize your dashboard.</p><p>This standalone preview uses illustrative data. Layout changes reset on reload.</p>'], logout: ['Preview account', () => '<p>You are viewing a local demo. No account is signed in.</p>'] };
document.querySelectorAll('.sidebar nav a').forEach(a => { a.title = a.textContent.trim(); a.setAttribute('aria-label', a.title); a.onclick = e => { const key = a.hash.slice(1); if (mobile.matches)
    menu(false); if (information[key]) {
    e.preventDefault();
    show(information[key][0], information[key][1]());
    return;
} const widget = { transactions: 'transactions', goals: 'goals', budget: 'budget', analytics: 'flow' }[key]; if (widget)
    reveal(widget); document.querySelectorAll('.sidebar nav a').forEach(link => { link.classList.toggle('active', link === a); link.removeAttribute('aria-current'); }); a.setAttribute('aria-current', 'page'); }; });
$('#profile').onclick = () => show('Adaline Lively', '<p>adalineel@gmail.com</p><p>Personal finance workspace · USD</p>');
$('#notifications').onclick = () => show('Notifications', list([['Monthly review', 'July summary is ready'], ['New car goal', '42% saved'], ['Budget reminder', 'Review your dining allocation']]));
document.addEventListener('keydown', e => { if (e.key === 'Escape')
    hideTooltip(); });
menu(false);
renderGoals();
render();
