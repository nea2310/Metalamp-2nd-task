import './filter-form.scss';

class FilterForm {
  constructor(elemName, elem) {
    this.elemName = elemName.replace(/^.js-/, '');
    this.breakPoint = 575;
    this.wrapper = elem;
    this.handleToggle = this.handleToggle.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.handleLoad = this.handleLoad.bind(this);
    this.render();
    this.toggleForm();
    this.hideForm();
  }

  getElem(selector, wrapper = this.wrapper) {
    return wrapper
      .querySelector(`.${this.elemName}__${selector}`);
  }

  render() {
    this.btn = this.getElem('show-filter');
    this.form = this.getElem('wrapper');
  }

  handleToggle() {
    this.form.classList.toggle(`${this.elemName}__wrapper_hidden`);
    this.wrapper.classList.toggle(`${this.elemName}_hidden`);
  }

  handleResize() {
    if (window.innerWidth <= this.breakPoint) {
      this.form.classList.add(`${this.elemName}__wrapper_hidden`);
      this.wrapper.classList.add(`${this.elemName}_hidden`);
    } else {
      this.form.classList.remove(`${this.elemName}__wrapper_hidden`);
      this.wrapper.classList.remove(`${this.elemName}_hidden`);
    }
  }

  handleLoad() {
    if (window.innerWidth <= this.breakPoint) {
      this.form.classList.add(`${this.elemName}__wrapper_hidden`);
      this.wrapper.classList.add(`${this.elemName}_hidden`);
    }
  }

  toggleForm() {
    this.btn.addEventListener('click', this.handleToggle);
  }

  hideForm() {
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('load', this.handleLoad);
  }
}

function renderFilterForms(selector) {
  const filterForms = document.querySelectorAll(selector);
  filterForms.forEach((filterForm) => new FilterForm(selector, filterForm));
}
renderFilterForms('.js-filter-form');
