function getWordForm(count, words) {
  let value = count;
  value = Math.abs(value) % 100;
  const number = value % 10;
  if (value > 10 && value < 20) return words[2];
  if (number > 1 && number < 5) return words[1];
  if (number === 1) return words[0];
  return words[2];
}

export default getWordForm;
