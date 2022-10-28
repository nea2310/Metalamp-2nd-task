function getDateString(date, isSplitByDot = true) {
  const day = String(date.getDate());
  const month = String(date.getMonth() + 1);
  const dd = day.length === 1 ? `0${day}` : day;
  const mm = month.length === 1 ? `0${month}` : month;
  const yyyy = String(date.getFullYear());
  return isSplitByDot ? `${dd}.${mm}.${yyyy}` : `${yyyy}-${mm}-${dd}`;
}

export default getDateString;
