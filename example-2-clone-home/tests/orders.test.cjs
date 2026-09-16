const assert = require('node:assert/strict');
const { test } = require('node:test');
const { filter, amount, csv } = require('../orders-model.js');
const base = { id:'SO-10', customer:'Acme Ltd', item:'Consulting', quantity:3, unitPrice:120000.10, status:'Processing', payment:'Part paid', due:'2026-09-15' };
const rows = [base,
  {...base,id:'SO-11',status:'Completed'},
  {...base,id:'SO-12',status:'Cancelled'},
  {...base,id:'SO-13',due:'2026-09-16',payment:'Paid'},
  {...base,id:'SO-14',due:'2026-09-23'},
  {...base,id:'SO-15',due:'2026-09-24'},
  {...base,id:'SO-16',due:'2026-10-01',customer:'Beacon',item:'Office chairs'}];
const find = options => filter(rows,{today:'2026-09-16',...options}).map(o=>o.id);
test('search covers customer, order number and item without case or whitespace sensitivity',()=>{
  assert.deepEqual(find({query:' beacon '}),['SO-16']);
  assert.deepEqual(find({query:'so-14'}),['SO-14']);
  assert.deepEqual(find({query:'CHAIRS'}),['SO-16']);
  assert.deepEqual(find({query:'does not exist'}),[]);
});
test('status, payment and text filters combine',()=>{
  assert.deepEqual(find({tab:'Processing',payment:'Paid',query:'acme'}),['SO-13']);
  assert.deepEqual(find({tab:'Completed',payment:'Paid'}),[]);
});
test('overdue excludes closed orders and orders due today',()=>{
  assert.deepEqual(find({period:'overdue'}),['SO-10']);
});
test('seven-day range includes today and the boundary, excluding later dates',()=>{
  assert.deepEqual(find({period:'week'}),['SO-13','SO-14']);
  assert.equal(find({period:'month'}).length,6);
});
test('amounts retain precision and large naira totals',()=>{
  assert.equal(amount(base),360000.3);
  assert.equal(amount({...base,quantity:250,unitPrice:1200000}),300000000);
});
test('CSV escapes customer text and neutralises spreadsheet formulas',()=>{
  const result=csv([{...base,customer:'Acme, "West"',item:'=HYPERLINK("test")'}]);
  assert.ok(result.includes('"Acme, ""West"""'));
  assert.ok(result.includes('"\'=HYPERLINK(""test"")"'));
  assert.ok(result.includes('"360000.3"'));
});
