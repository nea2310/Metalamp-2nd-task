function getDatePlusShift(shift, shiftType = 'day') {
  let newDateString;

  switch (shiftType) {
    case 'day':
      newDateString = new Date().setDate(new Date().getDate() + shift);
      break;

    case 'year':
      newDateString = new Date().setFullYear(new Date().getFullYear() + shift);
      break;

    default:
      newDateString = null;
  }
  return newDateString ? new Date(newDateString) : new Date();
}

export default getDatePlusShift;
