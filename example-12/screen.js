/* Dashboard composition: layout and content live here; shared markup lives in UI. */
(() => {
  const UI = window.FinSetUI;
  const { Button, Dropdown, FilterControls, StandardCard, ChartCard } = UI;
  const accounts = [['all', 'All accounts'], ['visa', 'Visa •3254'], ['mastercard', 'Mastercard •2154']];
  const arrow = (id, label) => Button({ variant: 'round', icon: 'arrow', attributes: { id, 'aria-label': label } });
  const sidebar = UI.Sidebar({
    brandHtml: `<a class="brand" href="./index.html" aria-label="FinSet home">${FinSetAssets.brand}<span class="nav-copy">FinSet</span></a>`,
    toggleHtml: Button({ variant: 'sidebar-toggle', icon: 'left', attributes: { id: 'collapse', 'aria-label': 'Collapse sidebar', 'aria-expanded': 'true', 'aria-controls': 'sidebar' } }),
    groups: [{ label: 'Main navigation', items: [
      ['dashboard', 'Dashboard', 'grid'], ['transactions', 'Transactions', 'receipt'], ['wallet', 'Wallet', 'wallet'], ['goals', 'Goals', 'target'], ['budget', 'Budget', 'coins'], ['analytics', 'Analytics', 'chart'], ['settings', 'Settings', 'settings']
    ].map(([key, label, icon]) => ({ href: '#' + key, label, icon, active: key === 'dashboard' })) }],
    footerHtml: `<div class="sidebar-bottom"><nav aria-label="Support">${UI.SidebarItem({ href: '#help', label: 'Help', icon: 'help' })}${UI.SidebarItem({ href: '#logout', label: 'Log out', icon: 'logout' })}</nav>${UI.SegmentedControl({ label: 'Colour theme', buttons: [
      { icon: 'sun', variant: 'selected', attributes: { id: 'lightTheme', 'aria-label': 'Light theme', 'aria-pressed': 'true' } },
      { icon: 'moon', attributes: { id: 'darkTheme', 'aria-label': 'Dark theme', 'aria-pressed': 'false' } }
    ] })}</div>`
  });
  const header = UI.PageHeader({
    id: 'dashboard', title: 'Welcome back, Adaline!', subtitle: 'It is the best time to manage your finances',
    menuHtml: Button({ variant: 'round mobile-menu', icon: 'menu', attributes: { id: 'mobileMenu', 'aria-label': 'Open navigation', 'aria-controls': 'sidebar', 'aria-expanded': 'false' } }),
    actionsHtml: Button({ variant: 'round', icon: 'search', attributes: { id: 'searchButton', 'aria-label': 'Search transactions' } })
      + Button({ variant: 'round notifications', icon: 'bell', contentHtml: '<b>3</b>', attributes: { id: 'notifications', 'aria-label': 'Notifications' } })
      + Button({ variant: 'profile', attributes: { id: 'profile' }, contentHtml: `<span class="avatar" aria-hidden="true">${FinSetAssets.avatar}</span><span><strong>Adaline Lively</strong><small>adalineel@gmail.com</small></span>` })
  });
  const toolbar = FilterControls({ className: 'toolbar', contentHtml:
    FilterControls({ className: 'month-control', contentHtml: `<span class="round calendar" data-icon="calendar">${UI.Icon('calendar')}</span>` + Dropdown({ id: 'month', label: 'Reporting month', options: [['jul', 'This month'], ['jun', 'Last month']] }) })
    + `<div class="widget-actions">${Button({ variant: 'outline', icon: 'grid', iconWrapper: true, label: 'Manage widgets', attributes: { id: 'manageWidgets' } })}${Button({ variant: 'primary', icon: 'plus', iconWrapper: true, label: 'Add new widget', attributes: { id: 'addWidget' } })}</div>`
  });
  const kpis = [
    { title: 'Total balance', valueId: 'balance', detailLabel: 'View total balance', trend: '↑ 12.1%' },
    { title: 'Income', valueId: 'income', detailLabel: 'View income', trend: '↑ 6.3%' },
    { title: 'Expense', valueId: 'expense', detailLabel: 'View expenses', trend: '↑ 2.4%', tone: 'negative' },
    { title: 'Total savings', valueId: 'savings', detailLabel: 'View savings', trend: '↑ 12.1%' }
  ].map(UI.KPICard).join('');
  const flow = ChartCard({ title: 'Money flow', className: 'money-flow', attributes: { 'data-widget': 'flow', id: 'analytics' },
    actionsHtml: FilterControls({ className: 'chart-controls', contentHtml: '<div class="legend"><span><i></i>Income</span><span><i></i>Expense</span></div>'
      + Dropdown({ id: 'flowAccount', label: 'Money flow account', options: accounts })
      + Dropdown({ id: 'year', label: 'Chart period', options: [['year', 'This year'], ['quarter', 'Last 3 months']] }) }),
    contentHtml: '<div class="flow-chart"><div id="axis" class="axis" aria-hidden="true"></div><div class="chart-scroll"><div class="plot"><svg id="flowSvg" viewBox="0 0 700 125" preserveAspectRatio="none" aria-hidden="true"></svg><div id="monthTargets"></div><div id="monthLabels"></div></div></div><div id="flowTooltip" role="tooltip" hidden></div></div>'
  });
  const budget = ChartCard({ title: 'Budget', className: 'budget', attributes: { 'data-widget': 'budget', id: 'budget' }, actionsHtml: arrow('budgetDetails', 'View budget'),
    contentHtml: '<div class="budget-body"><div id="budgetLegend"></div><div class="donut"><svg id="budgetSvg" viewBox="0 0 180 180" role="img" aria-label="Monthly budget by category"></svg><div><small>Total for month</small><strong></strong></div></div></div>'
  });
  const transactions = StandardCard({ title: 'Recent transactions', className: 'transactions card--table', attributes: { 'data-widget': 'transactions', id: 'transactions' },
    actionsHtml: FilterControls({ contentHtml: Dropdown({ id: 'transactionAccount', label: 'Filter transaction account', options: accounts }) + Button({ variant: 'small-button', label: 'See all ', iconAfter: 'right', iconWrapper: true, attributes: { id: 'seeAll' } }) }),
    contentHtml: UI.Search({ id: 'transactionSearch', label: 'Search transactions', placeholder: 'Search payments or categories...', hidden: true })
      + UI.DataTable({ columns: ['Date', 'Amount', 'Payment name', 'Method', 'Category'], bodyId: 'transactionRows' })
  });
  const goals = StandardCard({ title: 'Saving goals', className: 'goals', attributes: { 'data-widget': 'goals', id: 'goals' }, actionsHtml: arrow('goalsDetails', 'View saving goals'), contentHtml: '<div id="goalList"></div>' });
  const netWorth = StandardCard({ title: 'Net worth', className: 'net-worth', attributes: { 'data-widget': 'networth', hidden: true }, actionsHtml: arrow('networthDetails', 'View net worth'), contentHtml: '<strong id="networthValue"></strong><p>Balance + savings · no liabilities entered</p>' });
  document.body.insertAdjacentHTML('afterbegin', `<div class="app">${sidebar}<main id="main">${header}${toolbar}<section class="kpis" aria-label="Financial overview">${kpis}</section><div class="dashboard-grid">${flow}${budget}${transactions}${goals}${netWorth}</div></main></div>`
    + Button({ variant: 'backdrop', attributes: { id: 'backdrop', 'aria-label': 'Close navigation', hidden: true } })
    + UI.Modal({ id: 'dialog', titleId: 'dialogTitle', bodyId: 'dialogBody', closeId: 'closeDialog' })
    + '<div id="toast" role="status"></div>');
})();
