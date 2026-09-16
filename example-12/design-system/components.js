/* Dependency-free HTML components. Text and attributes are escaped; *Html slots
 * accept trusted component output only, never untrusted record content. */
window.FinSetUI = (() => {
  const escape = value => String(value).replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[char]));
  const attrs = values => Object.entries(values).filter(([, value]) => value !== undefined && value !== null && value !== false)
    .map(([key, value]) => value === true ? ` ${key}` : ` ${key}="${escape(value)}"`).join('');
  const Icon = name => window.FinSetIcons.render(name);

  function Button({ label = '', contentHtml, variant, icon, iconAfter, iconWrapper = false, attributes = {} } = {}) {
    const symbol = name => iconWrapper ? `<span data-icon="${escape(name)}">${Icon(name)}</span>` : Icon(name);
    return `<button${attrs({ type: 'button', class: variant, ...attributes })}>${icon ? symbol(icon) : ''}${contentHtml ?? escape(label)}${iconAfter ? symbol(iconAfter) : ''}</button>`;
  }
  function Input({ type = 'text', attributes = {} } = {}) {
    return `<input${attrs({ type, ...attributes })}>`;
  }
  function Search({ id, label, placeholder, hidden = false, className = 'transaction-search' }) {
    return `<label${attrs({ class: className, hidden })}><span data-icon="search">${Icon('search')}</span>${Input({ type: 'search', attributes: { id, placeholder, 'aria-label': label } })}</label>`;
  }
  function Dropdown({ id, label, options, attributes = {} }) {
    return `<select${attrs({ id, 'aria-label': label, ...attributes })}>${options.map(([value, text]) => `<option value="${escape(value)}">${escape(text)}</option>`).join('')}</select>`;
  }
  function FilterControls({ className, contentHtml }) {
    return `<div${attrs({ class: className })}>${contentHtml}</div>`;
  }
  function SidebarItem({ href, label, icon, active = false }) {
    return `<a${attrs({ class: active ? 'active' : undefined, href, 'data-icon': icon, 'aria-current': active ? 'page' : undefined })}>${Icon(icon)}<span class="nav-copy">${escape(label)}</span></a>`;
  }
  function Sidebar({ id = 'sidebar', brandHtml, toggleHtml, groups, footerHtml }) {
    return `<aside class="sidebar" id="${escape(id)}">${brandHtml}${toggleHtml}${groups.map(group => `<nav aria-label="${escape(group.label)}">${group.items.map(SidebarItem).join('')}</nav>`).join('')}${footerHtml ?? ''}</aside>`;
  }
  function PageHeader({ id, title, subtitle, menuHtml = '', actionsHtml = '' }) {
    return `<header${attrs({ id })}><div class="welcome">${menuHtml}<div><h1>${escape(title)}</h1><p>${escape(subtitle)}</p></div></div><div class="header-actions">${actionsHtml}</div></header>`;
  }
  function StatusBadge({ label, tone = 'positive' }) {
    return `<b class="trend ${tone === 'negative' ? 'negative' : 'positive'}">${escape(label)}</b>`;
  }
  StatusBadge.update = (element, { label, tone }) => {
    element.textContent = label;
    element.className = `trend ${tone === 'negative' ? 'negative' : 'positive'}`;
  };
  function KPICard({ title, valueId, valueHtml = '', detailLabel, trend, tone = 'positive', supportingText = 'vs last month' }) {
    return `<article class="kpi"><div><h2>${escape(title)}</h2>${Button({ variant: 'round', icon: 'arrow', attributes: { 'data-detail': valueId, 'aria-label': detailLabel } })}</div><strong id="${escape(valueId)}">${valueHtml}</strong><p>${StatusBadge({ label: trend, tone })}<small>${escape(supportingText)}</small></p></article>`;
  }
  function StandardCard({ title, actionsHtml = '', contentHtml = '', className = '', attributes = {} }) {
    return `<section${attrs({ class: `card ${className}`.trim(), ...attributes })}><div class="card-head"><h2>${escape(title)}</h2>${actionsHtml}</div>${contentHtml}</section>`;
  }
  function ChartCard(options) { return StandardCard(options); }
  function DataTable({ columns, bodyId, rowsHtml = '' }) {
    return `<div class="table-scroll"><table><thead><tr>${columns.map(label => `<th>${escape(label)}</th>`).join('')}</tr></thead><tbody id="${escape(bodyId)}">${rowsHtml}</tbody></table></div>`;
  }
  DataTable.rows = (records, columns, emptyMessage = 'No records found.') => records.length
    ? records.map(record => `<tr>${columns.map(column => `<td${attrs({ class: column.className })}>${column.renderHtml ? column.renderHtml(record) : escape(column.value(record))}</td>`).join('')}</tr>`).join('')
    : `<tr><td colspan="${columns.length}" class="empty">${escape(emptyMessage)}</td></tr>`;
  function DetailList(items) {
    return `<div class="detail-list">${items.map(([label, value]) => `<div><span>${escape(label)}</span><strong>${escape(value)}</strong></div>`).join('')}</div>`;
  }
  function SegmentedControl({ label, buttons, className = 'theme-switch' }) {
    return `<div class="${escape(className)}" aria-label="${escape(label)}">${buttons.map(Button).join('')}</div>`;
  }
  // No tabbed content existed on the dashboard. This opt-in pattern reuses its
  // segmented-control appearance without replacing the theme toggle with tabs.
  function Tabs({ id, label, items, selected = 0 }) {
    return `<div class="ds-tabs" data-tabs><div class="ds-tab-list" role="tablist" aria-label="${escape(label)}">${items.map((item, i) => Button({ label: item.label, attributes: { id: `${id}-tab-${i}`, role: 'tab', 'aria-selected': String(i === selected), 'aria-controls': `${id}-panel-${i}`, tabindex: i === selected ? 0 : -1 } })).join('')}</div>${items.map((item, i) => `<div${attrs({ id: `${id}-panel-${i}`, role: 'tabpanel', 'aria-labelledby': `${id}-tab-${i}`, tabindex: 0, hidden: i !== selected })}>${item.contentHtml}</div>`).join('')}</div>`;
  }
  function Modal({ id, titleId, bodyId, closeId }) {
    return `<dialog id="${escape(id)}" aria-labelledby="${escape(titleId)}"><div class="dialog-head"><h2 id="${escape(titleId)}"></h2>${Button({ variant: 'round', icon: 'close', attributes: { id: closeId, type: 'button', 'aria-label': 'Close dialog' } })}</div><div class="modal-body" id="${escape(bodyId)}"></div></dialog>`;
  }
  function bindModal({ dialog, title, body, close }) {
    close.onclick = () => dialog.close();
    return { open(heading, contentHtml) { title.textContent = heading; body.innerHTML = contentHtml; if (!dialog.open) dialog.showModal(); }, close() { dialog.close(); } };
  }
  function bindSidebar({ app, sidebar, main, toggle, trigger, backdrop, mobileQuery }) {
    let collapsed = false;
    function menu(open) {
      sidebar.classList.toggle('open', open);
      sidebar.inert = mobileQuery.matches && !open;
      main.inert = open;
      backdrop.hidden = !open;
      document.body.classList.toggle('menu-open', open);
      trigger.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', mobileQuery.matches ? 'Close navigation' : collapsed ? 'Expand sidebar' : 'Collapse sidebar');
      if (open) {
        sidebar.setAttribute('role', 'dialog'); sidebar.setAttribute('aria-modal', 'true'); sidebar.setAttribute('aria-label', 'Navigation'); toggle.focus();
      } else { sidebar.removeAttribute('role'); sidebar.removeAttribute('aria-modal'); sidebar.removeAttribute('aria-label'); }
    }
    trigger.onclick = () => menu(true);
    toggle.onclick = () => {
      if (mobileQuery.matches) { menu(false); trigger.focus(); }
      else { collapsed = !collapsed; app.classList.toggle('collapsed', collapsed); toggle.setAttribute('aria-expanded', String(!collapsed)); toggle.setAttribute('aria-label', collapsed ? 'Expand sidebar' : 'Collapse sidebar'); toggle.innerHTML = Icon(collapsed ? 'right' : 'left'); }
    };
    backdrop.onclick = () => { menu(false); trigger.focus(); };
    mobileQuery.addEventListener('change', () => menu(false));
    sidebar.addEventListener('keydown', event => {
      if (!mobileQuery.matches || !sidebar.classList.contains('open')) return;
      if (event.key === 'Escape') { menu(false); trigger.focus(); }
      if (event.key === 'Tab') {
        const focusable = [...sidebar.querySelectorAll('a,button')].filter(el => el.getClientRects().length);
        if (event.shiftKey && document.activeElement === focusable[0]) { event.preventDefault(); focusable.at(-1).focus(); }
        else if (!event.shiftKey && document.activeElement === focusable.at(-1)) { event.preventDefault(); focusable[0].focus(); }
      }
    });
    return { menu };
  }
  function bindTabs(root = document) {
    function select(tab, focus = false) {
      const group = tab.closest('[data-tabs]');
      group.querySelectorAll('[role=tab]').forEach(item => {
        const selected = item === tab;
        item.setAttribute('aria-selected', String(selected)); item.tabIndex = selected ? 0 : -1;
        document.getElementById(item.getAttribute('aria-controls')).hidden = !selected;
      });
      if (focus) tab.focus();
    }
    root.addEventListener('click', event => { const tab = event.target.closest('[data-tabs] [role=tab]'); if (tab) select(tab); });
    root.addEventListener('keydown', event => {
      const tab = event.target.closest('[data-tabs] [role=tab]');
      if (!tab || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      const tabs = [...tab.closest('[role=tablist]').querySelectorAll('[role=tab]')], i = tabs.indexOf(tab);
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (i + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
      event.preventDefault(); select(tabs[next], true);
    });
  }
  return { escape, attrs, Icon, Button, Input, Search, Dropdown, FilterControls, SidebarItem, Sidebar, PageHeader, StatusBadge, KPICard, StandardCard, Panel: StandardCard, ChartCard, DataTable, DetailList, SegmentedControl, Tabs, Modal, bindModal, bindSidebar, bindTabs };
})();
