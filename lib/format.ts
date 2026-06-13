export function usdCompact(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 2
  }).format(value);
}
export function numberFmt(value: number) {
  return new Intl.NumberFormat('en-US').format(value);
}
