export default function isNumber(value) {
  const valid = typeof value === 'number' || (typeof value === 'string' && (!Number.isNaN(+value)));
  return valid ? value : 0;
}
