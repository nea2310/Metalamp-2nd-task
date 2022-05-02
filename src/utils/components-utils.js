/* eslint-disable import/no-unresolved */
/* eslint-disable global-require */
/* eslint-disable valid-typeof */
function checkType(type, value, defaultValue) {
  return typeof value === type ? value : defaultValue;
}

function isInList(list, value, defaultValue) {
  return list.includes(value) ? value : defaultValue;
}

function isNumber(value) {
  const valid = typeof value === 'number' || (typeof value === 'string' && (!Number.isNaN(+value)));
  return valid ? value : 0;
}

function isImage(path) {
  const result = /^assets\/images\//.test(path);
  return result ? path : require('@com/feature/image/default.svg');
}

export {
  checkType, isInList, isNumber, isImage,
};
