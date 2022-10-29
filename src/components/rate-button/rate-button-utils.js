export default function prepareOptions(options) {
  const {
    rating,
  } = options;

  const categories = [
    {
      rateValue: 5,
      index: 'отлично',
      isChecked: false,
    },
    {
      rateValue: 4,
      index: 'хорошо',
      isChecked: false,
    },
    {
      rateValue: 3,
      index: 'удовлетворительно',
      isChecked: false,
    },
    {
      rateValue: 2,
      index: 'плохо',
      isChecked: false,
    },
    {
      rateValue: 1,
      index: 'очень плохо',
      isChecked: false,
    }];

  const categoriesChecked = categories.map((item) => {
    const category = item;
    if (category.rateValue === rating) {
      category.isChecked = true;
    } return category;
  });

  return {
    elementName: 'rate-button',
    categoriesChecked,
  };
}
