/* Run with npm test. --visual also compares the original Windows/Chromium PNGs.
 * PLAYWRIGHT_MODULE optionally points to an existing playwright-core install. */
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright-core');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const directory = path.resolve(__dirname, '..');
const screenshots = process.argv.includes('--visual');
const cases = [['desktop',1200,900,false],['wide',1448,1086,false],['tablet',900,900,false],['mobile',390,844,false],['dark',1200,900,true]];

async function verifyVisuals(page) {
  await page.evaluate(() => document.fonts.ready);
  for (const [name,width,height,dark] of cases) {
    await page.setViewportSize({width,height});
    await page.evaluate(value => document.body.classList.toggle('dark',value),dark);
    await page.mouse.move(0,0);
    // Screenshot capture also finishes transitions before measuring layout.
    const png = await page.screenshot({fullPage:true,animations:'disabled'});
    const actual = await page.evaluate(() => {
      const selectors=['.app','.sidebar','main','h1','.kpi','.card','.round','.primary','select','th','td','.goal-track'];
      return Object.fromEntries(selectors.map(selector=>[selector,[...document.querySelectorAll(selector)].map(el=>{
        const r=el.getBoundingClientRect(),s=getComputedStyle(el);
        return {x:r.x,y:r.y,width:r.width,height:r.height,font:s.font,fontSize:s.fontSize,borderRadius:s.borderRadius,background:s.backgroundColor,padding:s.padding,gap:s.gap};
      })]));
    });
    const expected=JSON.parse(fs.readFileSync(path.join(__dirname,'baselines',name+'.json')));
    assert.deepEqual(actual,expected,name+' computed layout differs from the approved baseline');
    if(screenshots) assert.ok(png.equals(fs.readFileSync(path.join(__dirname,'baselines',name+'.png'))),name+' screenshot differs from the approved baseline');
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    console.log(name+': original geometry'+(screenshots?' and pixels':'')+' preserved');
  }
}

async function verifyInteractions(page) {
  await page.setViewportSize({width:1200,height:900});
  await page.click('#lightTheme');
  assert.equal(await page.locator('#transactionRows tr').count(),3);
  await page.selectOption('#month','jun');
  assert.equal(await page.locator('#income').textContent(),'$8,000.00');
  assert.equal(await page.locator('.month-bars').count(),6);
  await page.selectOption('#year','quarter');
  assert.equal(await page.locator('.month-bars').count(),3);
  await page.selectOption('#flowAccount','visa');
  await page.locator('#monthTargets button').last().focus();
  assert.match(await page.locator('#flowTooltip').textContent(),/\$5,600.00/);
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('#flowTooltip').isVisible(),false);
  await page.selectOption('#transactionAccount','mastercard');
  assert.equal(await page.locator('#transactionRows tr').count(),3);
  await page.click('#searchButton');
  await page.fill('#transactionSearch','Reserved');
  assert.equal(await page.locator('#transactionRows tr').count(),1);
  await page.fill('#transactionSearch','No matching merchant');
  assert.match(await page.locator('#transactionRows').textContent(),/No matching transactions/);
  await page.click('#seeAll');
  assert.match(await page.locator('#dialogBody').textContent(),/No transactions found/);
  await page.click('#closeDialog');
  await page.fill('#transactionSearch','');
  for(const selector of ['[data-detail="balance"]','#budgetDetails','#budgetLegend button:first-child','#goalsDetails','#goalList button:first-child','#notifications','#profile']){
    await page.click(selector);
    assert.equal(await page.locator('#dialog').evaluate(el=>el.open),true);
    assert.ok((await page.locator('#dialogBody').textContent()).length>0);
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('#dialog').evaluate(el=>el.open),false);
  }
  await page.click('#addWidget');await page.click('[data-add="networth"]');
  assert.equal(await page.locator('[data-widget="networth"]').isVisible(),true);
  await page.click('#manageWidgets');
  for(const checkbox of await page.locator('#widgetForm input').all()) await checkbox.uncheck();
  await page.locator('#widgetForm button').click();
  assert.match(await page.locator('#widgetError').textContent(),/at least one/);
  await page.check('#widgetForm input[value="transactions"]');
  await page.locator('#widgetForm button').click();
  assert.equal(await page.locator('#budget').isVisible(),false);
  await page.click('.sidebar a[href="#budget"]');
  assert.equal(await page.locator('#budget').isVisible(),true);
  await page.click('#collapse');assert.equal(await page.locator('.app').evaluate(el=>el.classList.contains('collapsed')),true);
  await page.click('#collapse');assert.equal(await page.locator('.app').evaluate(el=>el.classList.contains('collapsed')),false);
  await page.click('#darkTheme');await page.reload();
  assert.equal(await page.locator('body').evaluate(el=>el.classList.contains('dark')),true);
  await page.setViewportSize({width:390,height:844});
  await page.click('#mobileMenu');assert.equal(await page.locator('#main').evaluate(el=>el.inert),true);
  await page.locator('#collapse').focus();await page.keyboard.press('Escape');
  assert.equal(await page.locator('#sidebar').evaluate(el=>el.inert),true);
  assert.equal(await page.locator('#mobileMenu').evaluate(el=>el===document.activeElement),true);
  console.log('Filters, tooltip, search, dialogs, widget form, themes, collapse and mobile drawer passed');
}

async function verifyReusability(page) {
  await page.setViewportSize({width:1200,height:900});
  await page.click('#lightTheme');
  const result=await page.evaluate(()=>{
    const css=document.documentElement.style;
    css.setProperty('--color-primary','#2468dd');
    css.setProperty('--radius-card','31px');
    css.setProperty('--space-unit','1.25px');
    css.setProperty('--font-size-unit','1.1px');
    const read=(selector,property)=>getComputedStyle(document.querySelector(selector))[property];
    return {button:read('.primary','backgroundColor'),nav:read('.sidebar nav a.active','backgroundColor'),bar:read('.income-bar','fill'),ring:read('.ring-segment','stroke'),goal:read('.goal-track>span','backgroundColor'),cards:[...document.querySelectorAll('.card')].map(el=>getComputedStyle(el).borderRadius),kpi:read('.kpi','borderRadius'),gap:read('.dashboard-grid','gap'),padding:read('.card','padding'),heading:read('.card h2','fontSize')};
  });
  for(const key of ['button','nav','bar','ring','goal']) assert.equal(result[key],'rgb(36, 104, 221)',key+' failed to consume the primary token');
  assert.ok(result.cards.every(radius=>radius==='31px'));assert.equal(result.kpi,'31px');
  assert.equal(result.gap,'15px');assert.equal(result.padding,'20px');assert.equal(result.heading,'15.4px');
  await page.evaluate(()=>document.documentElement.removeAttribute('style'));
  // Mount a second card, modal and tab set with entirely different IDs.
  await page.evaluate(()=>{
    const UI=FinSetUI;
    document.body.insertAdjacentHTML('beforeend','<div id="reuseFixture">'+UI.StandardCard({title:'Inventory',contentHtml:UI.Search({id:'inventorySearch',label:'Find inventory',placeholder:'Search inventory'})+UI.DataTable({columns:['Product','Stock'],bodyId:'inventoryRows',rowsHtml:UI.DataTable.rows([{name:'Suit',stock:10}],[{value:r=>r.name},{value:r=>r.stock}])})})+UI.Tabs({id:'inventory',label:'Inventory view',items:[{label:'All',contentHtml:'All products'},{label:'Low stock',contentHtml:'Low stock products'}]})+UI.Modal({id:'inventoryModal',titleId:'inventoryTitle',bodyId:'inventoryBody',closeId:'inventoryClose'})+'</div>');
    UI.bindTabs(document.querySelector('#reuseFixture'));
    UI.bindModal({dialog:document.querySelector('#inventoryModal'),title:document.querySelector('#inventoryTitle'),body:document.querySelector('#inventoryBody'),close:document.querySelector('#inventoryClose')}).open('Product details',UI.DetailList([['Product','Suit']]));
  });
  assert.equal(await page.locator('#inventoryModal').evaluate(el=>el.open),true);
  assert.equal(await page.locator('#inventoryBody').evaluate(el=>getComputedStyle(el).fontSize),'13px');
  await page.click('#inventoryClose');
  await page.locator('#inventory-tab-0').focus();await page.keyboard.press('ArrowRight');
  assert.equal(await page.locator('#inventory-tab-1').getAttribute('aria-selected'),'true');
  assert.equal(await page.locator('#inventory-panel-1').isVisible(),true);
  assert.equal(await page.locator('#inventory-panel-0').isVisible(),false);
  await page.locator('#inventory-tab-0').click();
  assert.equal(await page.locator('#inventory-panel-0').isVisible(),true);
  console.log('Global token propagation and components mounted with new IDs passed');
}

(async()=>{
  const browser=await chromium.launch({headless:true});
  try {
    const page=await browser.newPage();const errors=[];
    page.on('pageerror',error=>errors.push(error.message));
    await page.goto(pathToFileURL(path.join(directory,'index.html')).href);
    await verifyVisuals(page);await verifyInteractions(page);await verifyReusability(page);
    assert.deepEqual(errors,[]);console.log('All checks passed; no runtime errors.');
  } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1});
