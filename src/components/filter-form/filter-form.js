import './filter-form.scss';
class FilterForm {
  constructor(elemName, elem) {
    this.elemName = elemName.replace(/^.js-/, '');
    this.wrapper = elem;
    this.render();
    this.toggleForm();
    this.hideForm();
  }

  getElem(selector, wrapper = this.wrapper) {
    return wrapper.
      querySelector('.' + this.elemName + '__' + selector);
  }

  render() {
    this.btn = this.getElem('show-filter');
    this.form = this.getElem('wrapper');
  }


  toggleForm() {
    this.btn.addEventListener("click", () => {
      this.form.classList.toggle(`${this.elemName}__wrapper_hidden`);
      this.wrapper.classList.toggle(`${this.elemName}_hidden`);
    });
  }

  hideForm() {
    let breakPoint = 575;
    window.addEventListener('resize', () => {
      if (window.innerWidth <= breakPoint) {
        this.form.classList.add(`${this.elemName}__wrapper_hidden`);
        this.wrapper.classList.add(`${this.elemName}_hidden`);
      } else {
        this.form.classList.remove(`${this.elemName}__wrapper_hidden`);
        this.wrapper.classList.remove(`${this.elemName}_hidden`);
      }
    });



    window.addEventListener('load', () => {
      if (window.innerWidth <= breakPoint) {
        this.form.classList.add(`${this.elemName}__wrapper_hidden`);
        this.wrapper.classList.add(`${this.elemName}_hidden`);
      }
    });
  }
}

function renderFilterForms(selector) {
  let filterForms = document.querySelectorAll(selector);
  for (let filterForm of filterForms) {
    new FilterForm(selector, filterForm);
  }
}
renderFilterForms('.js-filter-form');

