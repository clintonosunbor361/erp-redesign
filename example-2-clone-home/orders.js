/* Orders workspace uses the existing shell, currency formatter and UI primitives. */
(() => {
  if (!document.body.classList.contains('theme-blue')) return;
  const { escape: esc, Button, StatusBadge } = SiohiomaUI;
  const storageKey = 'siohioma-blue-orders-v1';
  const statuses = ['New', 'Processing', 'Ready', 'Completed', 'Cancelled'];
  const payments = ['Paid', 'Part paid', 'Unpaid'];
  const samples = [
    ['Apex Office Supplies','Office chairs',12,85000,'Processing','Part paid','2026-09-22'],
    ['Nneka Okafor','Website maintenance',1,450000,'New','Unpaid','2026-09-24'],
    ['Greenleaf Hotels','Cotton towels',80,6500,'Ready','Paid','2026-09-18'],
    ['Tunde Bakare','Wireless headsets',6,78000,'Processing','Paid','2026-09-20'],
    ['Bloom Events','Event catering',1,1800000,'New','Part paid','2026-09-28'],
    ['Westbridge Ltd','Business laptops',4,1250000,'Completed','Paid','2026-09-12'],
    ['Ada Williams','Desk organisers',10,12500,'Ready','Unpaid','2026-09-19'],
    ['Cedar Health','Cleaning supplies',24,18500,'Processing','Part paid','2026-09-14'],
    ['Brightline Studio','Brand identity package',1,950000,'Completed','Paid','2026-09-10'],
    ['Daniel Musa','Packaging boxes',200,1800,'New','Unpaid','2026-09-26'],
    ['Northstar Retail','Display shelving',8,220000,'Processing','Paid','2026-10-02'],
    ['Harbour Logistics','Safety equipment',30,42000,'Cancelled','Unpaid','2026-09-09'],
    ['Olumide James','Consulting session',3,65000,'Completed','Paid','2026-09-08'],
    ['Oak & Co.','Printed stationery',100,3500,'Ready','Part paid','2026-09-21']
  ].map((r,i) => ({id:`SO-${1048-i}`,customer:r[0],item:r[1],quantity:r[2],unitPrice:r[3],status:r[4],payment:r[5],due:r[6],created:`2026-09-${String(16-Math.floor(i/2)).padStart(2,'0')}`,notes:'Confirm the delivery or service schedule with the customer.'}));
  const validOrder = o => o && typeof o.id==='string' && typeof o.customer==='string' && typeof o.item==='string' && Number.isFinite(o.quantity) && o.quantity>0 && Number.isFinite(o.unitPrice) && o.unitPrice>=0 && statuses.includes(o.status) && payments.includes(o.payment) && /^\d{4}-\d{2}-\d{2}$/.test(o.due) && /^\d{4}-\d{2}-\d{2}$/.test(o.created);
  let orders = samples;
  try { const saved=JSON.parse(localStorage.getItem(storageKey)); if(Array.isArray(saved)&&saved.every(validOrder)) orders=saved; } catch {}
  let tab='All orders', query='', payment='', period='', page=1, pageSize=10;
  const selected=new Set();
  const money=value=>formatNaira(value);
  const date=value=>new Date(value+'T12:00:00').toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'});
  const today=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;};
  const amount=OrdersModel.amount;
  const badge=(label)=>StatusBadge({label,tone:({'Paid':'completed','Completed':'completed','Part paid':'pending','Unpaid':'pending','Processing':'processing','New':'new','Ready':'ready','Cancelled':'cancelled'})[label]});
  const button=(label,action,primary=false)=>Button({label,className:`order-button${primary?' primary':''}`,attributes:`data-action="${action}"`});
  const view=document.createElement('section');
  view.className='orders-page'; view.id='orders'; view.hidden=true;
  view.innerHTML=`<div class="orders-heading"><div><div class="orders-breadcrumb">Workspace / Orders</div><h1>Orders</h1><p>Manage customer orders from request to completion.</p></div><div class="orders-actions">${button('Export orders','export')}${button('+ Create order','create',true)}</div></div>
    <section class="panel orders-panel" aria-label="Customer orders">
      <div class="orders-tabs" role="tablist" aria-label="Order status"></div>
      <div class="orders-filters"><label class="order-search"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="7.5"/><path d="m16 16 5 5"/></svg><input type="search" aria-label="Search orders" placeholder="Search order, customer or item…"></label><label><span class="sr-only">Payment status</span><select data-filter="payment"><option value="">All payments</option>${payments.map(p=>`<option>${p}</option>`).join('')}</select></label><label><span class="sr-only">Due date</span><select data-filter="period"><option value="">Any due date</option><option value="overdue">Overdue</option><option value="week">Due in 7 days</option><option value="month">Due this month</option></select></label>${button('Clear filters','clear')}</div>
      <div class="orders-bulk" hidden><span></span>${button('Export selected','export-selected')}${button('Clear selection','deselect')}</div>
      <div class="orders-table-wrap"><table class="orders-table"><caption class="sr-only">Customer orders. Open an order to view or update its details.</caption><thead><tr><th><input type="checkbox" aria-label="Select all orders on this page"></th><th>Order / Customer</th><th>Items</th><th class="amount-cell">Amount</th><th>Payment</th><th>Status</th><th>Due date</th><th><span class="sr-only">Details</span></th></tr></thead><tbody></tbody></table></div>
      <div class="orders-empty" hidden><h2>No orders found</h2><p>Try another search or clear your filters.</p>${button('Clear filters','clear')}</div>
      <div class="orders-pagination"><span class="orders-count" role="status"></span><div><label>Rows <select aria-label="Orders per page"><option>10</option><option>20</option></select></label>${button('Previous','previous')}<span class="orders-page-number"></span>${button('Next','next')}</div></div>
    </section><p class="orders-demo-note">Sample workspace · Changes are saved in this browser.</p>`;
  document.querySelector('.main').append(view);
  document.querySelector('.sidebar nav').setAttribute('aria-label','Main navigation');
  const dialog=document.createElement('dialog');
  dialog.className='order-dialog'; dialog.setAttribute('aria-labelledby','order-dialog-title');
  document.body.append(dialog);
  const notice=document.createElement('div');notice.className='orders-notice';notice.setAttribute('role','status');document.body.append(notice);
  let noticeTimer;
  function announce(message){notice.textContent=message;notice.classList.add('show');clearTimeout(noticeTimer);noticeTimer=setTimeout(()=>notice.classList.remove('show'),3500);}
  function save(){try{localStorage.setItem(storageKey,JSON.stringify(orders));return true;}catch{announce('Saved for this session. Browser storage is unavailable.');return false;}}
  function filtered(){return OrdersModel.filter(orders,{tab,query,payment,period,today:today()});}
  function render(){
    const rows=filtered();const pages=Math.max(1,Math.ceil(rows.length/pageSize));page=Math.min(page,pages);
    const visible=rows.slice((page-1)*pageSize,page*pageSize);
    view.querySelector('.orders-tabs').innerHTML=['All orders',...statuses].map(s=>`<button type="button" role="tab" aria-selected="${s===tab}" aria-controls="orders-results" tabindex="${s===tab?0:-1}" data-tab="${s}">${s}<span>${s==='All orders'?orders.length:orders.filter(o=>o.status===s).length}</span></button>`).join('');
    view.querySelector('tbody').innerHTML=visible.map(o=>`<tr><td><input type="checkbox" data-select="${esc(o.id)}" aria-label="Select ${esc(o.id)}" ${selected.has(o.id)?'checked':''}></td><td data-label="Order / Customer"><button class="order-link" data-open="${esc(o.id)}">#${esc(o.id)}</button><span class="order-customer">${esc(o.customer)}</span></td><td data-label="Items"><span class="order-item">${esc(o.item)}</span><small>${o.quantity} ${o.quantity===1?'unit':'units'}</small></td><td class="amount-cell" data-label="Amount">${money(amount(o))}</td><td data-label="Payment">${badge(o.payment)}</td><td data-label="Status">${badge(o.status)}</td><td data-label="Due date">${date(o.due)}${o.due<today()&&!['Completed','Cancelled'].includes(o.status)?'<small class="order-overdue">Overdue</small>':''}</td><td><button class="order-open" data-open="${esc(o.id)}" aria-label="View order ${esc(o.id)}">↗</button></td></tr>`).join('');
    const all=view.querySelector('thead input');all.checked=visible.length>0&&visible.every(o=>selected.has(o.id));all.indeterminate=!all.checked&&visible.some(o=>selected.has(o.id));all.disabled=!visible.length;
    view.querySelector('.orders-empty').hidden=rows.length>0;
    view.querySelector('.orders-count').textContent=rows.length?`Showing ${(page-1)*pageSize+1}–${Math.min(page*pageSize,rows.length)} of ${rows.length} orders`:'0 orders';
    view.querySelector('.orders-page-number').textContent=`${page} / ${pages}`;
    view.querySelector('[data-action="previous"]').disabled=page===1;view.querySelector('[data-action="next"]').disabled=page===pages;
    view.querySelector('.orders-bulk').hidden=!selected.size;view.querySelector('.orders-bulk span').textContent=`${selected.size} selected`;
    view.querySelector('.orders-table-wrap').id='orders-results';
  }
  function reset(){tab='All orders';query='';payment='';period='';page=1;selected.clear();view.querySelector('input[type="search"]').value='';view.querySelectorAll('[data-filter]').forEach(el=>el.value='');render();}
  function exportRows(rows){
    if(!rows.length){announce('No orders to export.');return;}
    const csv=OrdersModel.csv(rows);
    const url=URL.createObjectURL(new Blob(['\ufeff'+csv],{type:'text/csv;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='orders.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);announce(`${rows.length} orders exported.`);
  }
  const dialogHead=(title,subtitle)=>`<div class="order-dialog-heading"><div><h2 id="order-dialog-title">${esc(title)}</h2><p>${esc(subtitle)}</p></div><button class="order-open" data-close aria-label="Close order details">×</button></div>`;
  function openDetails(id){
    const o=orders.find(o=>o.id===id);if(!o)return;
    dialog.classList.remove('create-dialog');
    dialog.innerHTML=dialogHead('#'+o.id,`Created ${date(o.created)}`)+`<div class="order-detail-body"><div class="order-detail-status">${badge(o.status)}${badge(o.payment)}</div><section><h3>Customer</h3><p>${esc(o.customer)}</p></section><section><h3>Order summary</h3><div class="order-line-item"><div><strong>${esc(o.item)}</strong><small>${o.quantity} × ${money(o.unitPrice)}</small></div><strong>${money(amount(o))}</strong></div><div class="order-total"><span>Total</span><strong>${money(amount(o))}</strong></div></section><section><h3>Schedule</h3><dl><div><dt>Order placed</dt><dd>${date(o.created)}</dd></div><div><dt>Due date</dt><dd>${date(o.due)}</dd></div></dl></section><form id="order-update"><h3>Manage order</h3><label>Order status<select name="status">${statuses.map(s=>`<option ${s===o.status?'selected':''}>${s}</option>`).join('')}</select></label><label>Payment status<select name="payment">${payments.map(s=>`<option ${s===o.payment?'selected':''}>${s}</option>`).join('')}</select></label><label>Notes<textarea name="notes" maxlength="1000" rows="3">${esc(o.notes||'')}</textarea></label><button class="order-button primary" type="submit">Save changes</button></form></div>`;
    dialog.querySelector('form').addEventListener('submit',e=>{e.preventDefault();const fields=new FormData(e.target);o.status=fields.get('status');o.payment=fields.get('payment');o.notes=fields.get('notes');const persisted=save();render();dialog.close();if(persisted)announce('Order updated.');});
    dialog.showModal();
  }
  function openCreate(){
    dialog.classList.add('create-dialog');
    dialog.innerHTML=dialogHead('Create order','Add a product or service order.')+`<form class="order-detail-body" id="order-create"><label>Customer name<input name="customer" required maxlength="100" placeholder="Person or company" autocomplete="off"></label><label>Product or service<input name="item" required maxlength="140" placeholder="Item description"></label><div class="order-form-grid"><label>Quantity<input name="quantity" type="number" min="1" max="1000000" step="1" value="1" required></label><label>Unit price (₦)<input name="unitPrice" type="number" min="0.01" max="100000000000" step="0.01" required placeholder="0.00"></label></div><label>Due date<input name="due" type="date" required value="${today()}"></label><label>Payment status<select name="payment">${['Unpaid','Part paid','Paid'].map(s=>`<option>${s}</option>`).join('')}</select></label><label>Notes<textarea name="notes" rows="3" maxlength="1000" placeholder="Delivery instructions or service requirements"></textarea></label><div class="order-total"><span>Order total</span><output id="order-preview-total">${money(0)}</output></div><p class="order-form-error" role="alert"></p><button class="order-button primary" type="submit">Create order</button><p class="orders-demo-note">Saved in this browser. No customer notification is sent.</p></form>`;
    const form=dialog.querySelector('form');
    form.addEventListener('input',()=>{const fields=new FormData(form);dialog.querySelector('output').textContent=money(Number(fields.get('quantity'))*Number(fields.get('unitPrice')));});
    form.addEventListener('submit',e=>{e.preventDefault();const fields=Object.fromEntries(new FormData(form));if(!fields.customer.trim()||!fields.item.trim()){form.querySelector('.order-form-error').textContent='Enter a customer and item name.';return;}const next=Math.max(1048,...orders.map(o=>Number(o.id.replace('SO-',''))||0))+1;orders.unshift({...fields,customer:fields.customer.trim(),item:fields.item.trim(),id:`SO-${next}`,quantity:Number(fields.quantity),unitPrice:Number(fields.unitPrice),status:'New',created:today()});const persisted=save();reset();dialog.close();if(persisted)announce('Order created.');});
    dialog.showModal();
  }
  view.addEventListener('click',e=>{
    const target=e.target.closest('button');if(!target)return;
    if(target.dataset.tab){tab=target.dataset.tab;page=1;selected.clear();render();view.querySelector(`[data-tab="${tab}"]`).focus();}
    if(target.dataset.open)openDetails(target.dataset.open);
    switch(target.dataset.action){case 'create':openCreate();break;case 'export':exportRows(filtered());break;case 'export-selected':exportRows(orders.filter(o=>selected.has(o.id)));break;case 'deselect':selected.clear();render();break;case 'clear':reset();break;case 'previous':page--;render();break;case 'next':page++;render();break;}
  });
  view.querySelector('.orders-tabs').addEventListener('keydown',e=>{const tabs=[...view.querySelectorAll('[data-tab]')];const index=tabs.indexOf(document.activeElement);if(index<0)return;let next;if(e.key==='ArrowRight')next=(index+1)%tabs.length;else if(e.key==='ArrowLeft')next=(index+tabs.length-1)%tabs.length;else if(e.key==='Home')next=0;else if(e.key==='End')next=tabs.length-1;else return;e.preventDefault();tabs[next].click();});
  view.querySelector('input[type="search"]').addEventListener('input',e=>{query=e.target.value;page=1;selected.clear();render();});
  view.addEventListener('change',e=>{
    if(e.target.matches('[data-filter]')){payment=view.querySelector('[data-filter="payment"]').value;period=view.querySelector('[data-filter="period"]').value;page=1;selected.clear();}
    if(e.target.matches('[aria-label="Orders per page"]')){pageSize=Number(e.target.value);page=1;}
    if(e.target.dataset.select){e.target.checked?selected.add(e.target.dataset.select):selected.delete(e.target.dataset.select);}
    if(e.target.matches('thead input'))filtered().slice((page-1)*pageSize,page*pageSize).forEach(o=>e.target.checked?selected.add(o.id):selected.delete(o.id));
    render();
  });
  dialog.addEventListener('click',e=>{if(e.target.closest('[data-close]'))dialog.close();if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
  const dashboard=document.querySelector('.dashboard');
  const mobileOrder=document.querySelector('.mobile-tabs a[href="#transactions"]');mobileOrder.href='#orders';mobileOrder.querySelector('span').textContent='Orders';
  const originalTitle=document.title;
  function route(){
    const active=location.hash==='#orders';view.hidden=!active;dashboard.hidden=active;document.body.classList.toggle('orders-active',active);document.title=active?'Orders · Siohioma':originalTitle;
    if(dialog.open)dialog.close();
    document.querySelectorAll('.sidebar nav a,.mobile-tabs a').forEach(a=>{const matches=a.hash===(active?'#orders':location.hash||'#overview');a.classList.toggle('active',matches);if(matches)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
    if(active)render();
  }
  // The existing KPI drill-down routes to this full workspace in the blue theme.
  document.querySelector('[data-detail="orders"]').addEventListener('click',e=>{e.stopImmediatePropagation();location.hash='orders';},{capture:true});
  window.addEventListener('hashchange',route);route();
})();
