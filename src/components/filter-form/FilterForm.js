import DateDropDown from '../date-dropdown/DateDropdown';
import DropDown from '../dropdown/Dropdown';
import CheckList from '../checklist/CheckList';
import RangeSlider from '../range-slider/RangeSlider';

class FilterForm {
  constructor(element, elementName = 'filter-form') {
    this.elementName = elementName;
    this.breakPoint = 575;
    this.wrapper = element;
    this._handleFilterFormClickButton = this._handleFilterFormClickButton.bind(this);
    this._handleFilterFormResizeWindow = this._handleFilterFormResizeWindow.bind(this);
    this._handleFilterFormLoadWindow = this._handleFilterFormLoadWindow.bind(this);
    this._render();
    this._bindEventListeners();
  }

  _render() {
    this.button = this._getElement('show-filter');
    this.form = this._getElement('wrapper');

    const dateDropDownElement = this.wrapper.querySelector('.js-date-dropdown');
    const dropDownElements = this.wrapper.querySelectorAll('.js-dropdown');
    const rangeSlider = this.wrapper.querySelector('.js-range-slider');
    const checkListElements = this.wrapper.querySelectorAll('.js-checklist');

    this.dateDropDown = new DateDropDown(dateDropDownElement);
    dropDownElements.forEach((element) => new DropDown(element));
    this.rangeSlider = new RangeSlider(rangeSlider);
    checkListElements.forEach((element) => new CheckList(element));
  }

  _bindEventListeners() {
    this.button.addEventListener('click', this._handleFilterFormClickButton);
    window.addEventListener('resize', this._handleFilterFormResizeWindow);
    window.addEventListener('load', this._handleFilterFormLoadWindow);
  }

  _handleFilterFormClickButton() {
    this.form.classList.toggle(`${this.elementName}__wrapper_hidden`);
    this.wrapper.classList.toggle(`${this.elementName}_hidden`);
  }

  _handleFilterFormResizeWindow() {
    if (window.innerWidth <= this.breakPoint) {
      this._hideForm();
    } else {
      this.form.classList.remove(`${this.elementName}__wrapper_hidden`);
      this.wrapper.classList.remove(`${this.elementName}_hidden`);
    }
  }

  _handleFilterFormLoadWindow() {
    if (window.innerWidth <= this.breakPoint) {
      this._hideForm();
    }
  }

  _hideForm() {
    this.form.classList.add(`${this.elementName}__wrapper_hidden`);
    this.wrapper.classList.add(`${this.elementName}_hidden`);
  }

  _getElement(selector, wrapper = this.wrapper) {
    return wrapper.querySelector(`.${this.elementName}__${selector}`);
  }
}

export default FilterForm;
