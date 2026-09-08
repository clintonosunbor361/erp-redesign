const dialog = document.querySelector('#detailDialog');
function showDetail(title, content) {
  document.querySelector('#dialogTitle').textContent = title;
  document.querySelector('#dialogContent').innerHTML = content;
  dialog.showModal();
}
document.querySelector('#closeDialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) { const r = dialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close(); } });
const periods = {
  current: { revenue: '₦24.8m', orders: '386', units: '1,248', stock: 12, categories: ['574', '399', '275'], months: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'], sales: [14.2, 18.6, 16.4, 20.1, 21.6, 24.8], targets: [18, 20, 20, 22, 24, 26], growth: '14.8%' },
  previous: { revenue: '₦21.6m', orders: '343', units: '1,153', stock: 9, categories: ['530', '369', '254'], months: ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'], sales: [12.7, 14.2, 18.6, 16.4, 20.1, 21.6], targets: [16, 18, 20, 20, 22, 24], growth: '7.5%' }
};
function renderPeriod(key) {
  const data = periods[key];
  for (const id of ['revenue', 'orders', 'units']) document.getElementById(id).textContent = data[id];
  document.querySelector('#stock').innerHTML = `${data.stock} <span>SKUs</span>`;
  document.querySelector('#ringTotal').textContent = data.units;
  ['dresses', 'coords', 'essentials'].forEach((id, index) => document.getElementById(id).textContent = data.categories[index]);
  document.querySelector('#revenueTrend').textContent = `↗ ${data.growth}`;
  document.querySelector('#growthText').textContent = `${data.growth} growth this month`;
  document.querySelector('.chart-footer small').textContent = `Your ${key === 'current' ? 'September' : 'August'} collection is finding its people.`;
  document.querySelectorAll('.metric .badge')[1].textContent = key === 'current' ? '↗ 12.4%' : '↗ 9.6%';
  document.querySelectorAll('.metric .badge')[2].textContent = key === 'current' ? '↗ 8.2%' : '↗ 6.5%';
  document.querySelector('#salesChart').innerHTML = data.months.map((month, i) => `<div class="bar-group" tabindex="0" role="img" aria-label="${month}: net sales ₦${data.sales[i]} million, target ₦${data.targets[i]} million" title="${month}: Sales ₦${data.sales[i]}m / Target ₦${data.targets[i]}m"><div class="bars"><div class="bar actual" style="height:${data.sales[i] / 30 * 100}%"></div><div class="bar" style="height:${data.targets[i] / 30 * 100}%"></div></div><span class="month">${month}</span></div>`).join('');
}
document.querySelector('#period').addEventListener('change', event => renderPeriod(event.target.value));
document.querySelector('#exportButton').addEventListener('click', () => window.print());
document.querySelector('#notificationButton').addEventListener('click', () => showDetail('Needs your attention', '<ul><li><strong>12 variants running low.</strong> Review sizes and colours before the next restock.</li><li><strong>24 orders awaiting dispatch.</strong> The next courier pickup is at 3 pm.</li><li><strong>Quality check:</strong> 80 garments are awaiting approval for the Autumn / Winter collection.</li></ul>'));
const productionDetail = '<p>Autumn / Winter 2026 launches on 28 September.</p><ul><li>120 units in cutting</li><li>240 units in sewing</li><li>40 units in finishing</li><li>80 units in quality check</li><li>320 units ready for launch</li></ul><p>Total collection: 800 units.</p>';
document.querySelector('#collectionButton').addEventListener('click', () => showDetail('Autumn / Winter ’26', productionDetail));
document.querySelector('#helpButton').addEventListener('click', () => showDetail('Explore Atelier', '<p>This fashion ERP design concept uses illustrative data.</p><p>Switch the reporting period to compare sales, explore production using the collection card, or use the arrow at the top to print your report.</p>'));
const details = {
  overview: ['Brand overview', '<p>September at a glance: ₦24.8m in net sales, 386 orders fulfilled, and 1,248 garments sold.</p><p>Autumn / Winter launch: 28 September. 320 of 800 units are ready.</p>'],
  collection: ['Collections', '<ul><li><strong>Everyday Edit:</strong> linen sets, relaxed shirts and tailored trousers.</li><li><strong>Occasionwear:</strong> sculpted dresses and evening separates.</li><li><strong>Autumn / Winter ’26:</strong> 800 units planned, launching 28 September.</li></ul>'],
  orders: ['Orders awaiting dispatch', '<ul><li>AT-1048 · Linen co-ord, Sand / M · Paid · Packing</li><li>AT-1049 · Wrap dress, Olive / L · Paid · Ready for courier</li><li>AT-1050 · Tailored trousers, Black / S · Paid · Picking</li></ul><p>Showing 3 illustrative orders of 24 awaiting dispatch.</p>'],
  production: ['Production overview', productionDetail],
  inventory: ['Inventory attention', '<ul><li>Linen co-ord · Sand / M — 4 available</li><li>Wrap dress · Olive / L — 6 available</li><li>Tailored trousers · Black / S — 3 available</li></ul><p>Showing 3 of 12 variants below the 10-unit reorder point.</p>'],
  customers: ['Customer overview', '<p>Understand your customers through order history, preferred sizes and repeat purchases.</p><p>Example customer: Ada Williams · Preferred size M · 4 orders · Last purchase: Linen co-ord.</p>'],
  finance: ['Finance overview', '<p>September net sales: <strong>₦24.8 million.</strong></p><p>Net sales reflect merchandise sales after discounts and returns. Payment reconciliation, expenses and supplier invoices would be managed here.</p>']
};
document.querySelectorAll('.sidebar nav a').forEach(link => link.addEventListener('click', event => {
  event.preventDefault();
  const key = link.getAttribute('href').slice(1);
  if (key === 'analytics') { document.querySelector('main').scrollIntoView({ behavior: 'smooth' }); return; }
  const [title, content] = details[key];
  showDetail(title, content);
}));
renderPeriod('current');
