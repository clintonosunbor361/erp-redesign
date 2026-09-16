// Shared NGN formatting for summaries, chart labels, and exact detail values.
const nairaFull = new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0, maximumFractionDigits: 2 });
function formatNaira(value, compact = false) {
  if (!Number.isFinite(value)) return '\u2014';
  if (!compact || Math.abs(value) < 1000) return nairaFull.format(value);
  const units = [{ size: 1e12, suffix: 'T' }, { size: 1e9, suffix: 'B' }, { size: 1e6, suffix: 'M' }, { size: 1e3, suffix: 'K' }];
  let index = units.findIndex(unit => Math.abs(value) >= unit.size);
  let scaled = Number((value / units[index].size).toFixed(2));
  if (Math.abs(scaled) >= 1000 && index > 0) { index--; scaled = Number((value / units[index].size).toFixed(2)); }
  return (value < 0 ? '-' : '') + '\u20a6' + Math.abs(scaled).toLocaleString('en-NG', { maximumFractionDigits: 2 }) + units[index].suffix;
}
