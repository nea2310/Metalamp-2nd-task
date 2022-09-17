export default function prepareOptions(options) {
  const {
    rating,
  } = options;

  const ratingChecked = (rating < 0 || rating > 5) ? 0 : rating;

  return {
    ratingChecked,
  };
}
