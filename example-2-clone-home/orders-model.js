/* Pure order helpers shared by the workspace and regression checks. */
(() => {
  const amount = order => Math.round(order.quantity * order.unitPrice * 100) / 100;
  function filter(orders, { tab = 'All orders', query = '', payment = '', period = '', today }) {
    const end = new Date(today + 'T12:00:00');
    end.setDate(end.getDate() + 7);
    return orders.filter(order => {
      const text = `${order.id} ${order.customer} ${order.item}`.toLowerCase();
      const dateMatch = !period ||
        (period === 'overdue' && order.due < today && !['Completed', 'Cancelled'].includes(order.status)) ||
        (period === 'week' && order.due >= today && new Date(order.due + 'T12:00:00') <= end) ||
        (period === 'month' && order.due.slice(0, 7) === today.slice(0, 7));
      return text.includes(query.trim().toLowerCase()) &&
        (tab === 'All orders' || order.status === tab) &&
        (!payment || order.payment === payment) && dateMatch;
    });
  }
  function csv(orders) {
    const cell = value => {
      let text = String(value);
      if (/^[\s]*[=+@-]|^[\t\r\n]/.test(text)) text = "'" + text;
      return '"' + text.replaceAll('"', '""') + '"';
    };
    return [['Order', 'Customer', 'Item', 'Quantity', 'Amount (NGN)', 'Payment', 'Status', 'Due date'],
      ...orders.map(o => [o.id, o.customer, o.item, o.quantity, amount(o), o.payment, o.status, o.due])]
      .map(row => row.map(cell).join(',')).join('\r\n');
  }
  const api = { amount, filter, csv };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else window.OrdersModel = api;
})();
