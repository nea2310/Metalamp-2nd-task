/* eslint-disable valid-typeof */
export default function checkType(type, value, defaultValue) {
  return typeof value === type ? value : defaultValue;
}
