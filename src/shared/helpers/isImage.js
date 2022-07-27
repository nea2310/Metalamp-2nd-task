/* eslint-disable import/no-unresolved */
/* eslint-disable global-require */
export default function isImage(path) {
  const result = /^assets\/images\//.test(path);
  return result ? path : require('@com/feature/image/default.svg');
}
