import FilterForm from './filter-form';

function renderFilterForms(selector) {
  const filterForms = document.querySelectorAll(selector);
  filterForms.forEach((filterForm) => new FilterForm(selector, filterForm));
}
renderFilterForms('.js-filter-form');
