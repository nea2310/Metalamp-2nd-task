import getElement from '../../shared/utils/getElement';
import getElements from '../../shared/utils/getElements';
import getWordForm from '../../shared/utils/getWordForm';
import './dropdown.scss';

class DropDown {
  constructor(element, elementName = 'dropdown') {
    this.elementName = elementName;
    this.wrapper = element;

    this._bindEventListeners();
    this._render();
  }

  static _reduceCategory(categoriesOfType) {
    return categoriesOfType
      .reduce((sum, category) => category.currentCount + sum, 0);
  }

  /* Для события mousedown действием по-умолчанию является установка фокуса.
  Если отменить событие mousedown, то фокусирования не произойдёт =>
  при клике одновременно с ним не сработает фокус и выпадающий список раскроется */
  static _handleDropDownMousedownInput(event) {
    event.preventDefault();
  }

  setData(data) {
    data.forEach((item) => this._changeCategoryCounter(item.name, item.currentCount));
  }

  subscribeGuestsSelect(handler) {
    this.guestsSelectHandler = handler;
  }

  validateInputValue() {
    const result = /^[1-9] гост/.test(this.input.value);
    if (!result) this.input.classList.add(`${this.elementName}__input_error`);
    else this.input.classList.remove(`${this.elementName}__input_error`);
    return [result];
  }

  _render() {
    this.clickOnList = false;
    this.focusOnList = false;
    this.mouseDown = false;

    this.input = getElement('input', this.wrapper, this.elementName);
    this.inputWrapper = getElement('input-wrapper', this.wrapper, this.elementName);
    this.listWrapper = getElement('list-wrapper', this.wrapper, this.elementName);
    this.counts = getElements(['count-decrement', 'count-increment'], this.wrapper, this.elementName);
    this.countValues = getElements(['count-value'], this.wrapper, this.elementName);
    this.listElements = getElements(['category-wrapper'], this.wrapper, this.elementName);
    this.buttonClear = getElement('button-clear', this.wrapper, this.elementName);
    this.buttonApply = getElement('button-apply', this.wrapper, this.elementName);
    this.buttonsMinus = getElements(['count-decrement'], this.wrapper, this.elementName);
    this.buttonsPlus = getElements(['count-increment'], this.wrapper, this.elementName);
    this.clearApplyButtons = this.buttonClear != null && this.buttonApply != null;

    this._addEventListeners();
    this._getInitialCounterList(this.listElements);
  }

  _bindEventListeners() {
    this._handleDropDownClickInputWrapper = this._handleDropDownClickInputWrapper.bind(this);
    this._handleDropDownFocusInput = this._handleDropDownFocusInput.bind(this);
    this._handleDropDownClickCounter = this._handleDropDownClickCounter.bind(this);
    this._handleDropDownClickDocument = this._handleDropDownClickDocument.bind(this);
    this._handleDropDownFocusinDocument = this._handleDropDownFocusinDocument.bind(this);
    this._handleDropDownClickApply = this._handleDropDownClickApply.bind(this);
    this._handleDropDownClickClear = this._handleDropDownClickClear.bind(this);
    this._handleDropDownResizeLoadWindow = this._handleDropDownResizeLoadWindow.bind(this);
  }

  _addEventListeners() {
    this.inputWrapper.addEventListener('click', this._handleDropDownClickInputWrapper);
    this.input.addEventListener('focus', this._handleDropDownFocusInput);
    this.input.addEventListener('mousedown', DropDown._handleDropDownMousedownInput);
    this.counts.forEach((element) => element.addEventListener('click', this._handleDropDownClickCounter));
    document.addEventListener('click', this._handleDropDownClickDocument);
    document.addEventListener('focusin', this._handleDropDownFocusinDocument);
    window.addEventListener('resize', this._handleDropDownResizeLoadWindow);
    window.addEventListener('load', this._handleDropDownResizeLoadWindow);
    if (this.clearApplyButtons) {
      this.buttonApply.addEventListener('click', this._handleDropDownClickApply);
      this.buttonClear.addEventListener('click', this._handleDropDownClickClear);
    }
  }

  _handleDropDownClickInputWrapper(e) {
    if (e.target === e.currentTarget
      || e.target === this.input) {
      this._toggle(true);
    } else e.preventDefault();
  }

  _handleDropDownFocusInput() {
    this._toggle(true);
  }

  _handleDropDownClickCounter(event) {
    const button = event.currentTarget;
    const wrapper = event.target.closest(`.${this.elementName}__category-wrapper`);
    const name = wrapper.querySelector(`.${this.elementName}__category`).innerText;
    const {
      type, currentCount, minCount, maxCount, maxTypeCount,
    } = this._findCategory(name);

    const categoriesOfType = this._filterCategory(type);

    const currentTypeCount = DropDown._reduceCategory(categoriesOfType);

    if (button.classList.contains(`${this.elementName}__count-increment`)) {
      const data = {
        wrapper, currentTypeCount, maxTypeCount, maxCount, name, type, currentCount,
      };
      this._increaseCounter(data);

      return true;
    }

    const data = {
      categoriesOfType, wrapper, currentTypeCount, minCount, name, type, currentCount,
    };
    this._decreaseCounter(data);
    return true;
  }

  _handleDropDownClickDocument(event) {
    const isNotDropDown = event.target !== this.input
      && event.target !== this.inputWrapper
      && !event.target.closest(`.js-${this.elementName}__list-wrapper`);

    if (isNotDropDown) {
      this._toggle(false);
    }
  }

  _handleDropDownFocusinDocument(event) {
    if (!event.target.closest(`.js-${this.elementName}`)) {
      this._toggle(false);
    }
  }

  _handleDropDownClickApply() {
    this._toggle(true);
  }

  _handleDropDownClickClear() {
    this.countValues.forEach((countValue, i) => {
      const item = countValue;
      item.innerText = this.categories[i].minCount;
      this.categories[i].currentCount = 0;
      this.categories[i].currentTypeCount = 0;
    });
    this.buttonsMinus.forEach((buttonMinus) => {
      const button = buttonMinus;
      button.disabled = true;
    });
    this.buttonsPlus.forEach((buttonPlus) => {
      const button = buttonPlus;
      button.disabled = false;
    });
    this.input.value = '';
    if (this.guestsSelectHandler) {
      this.guestsSelectHandler();
    }
    if (this.clearApplyButtons) {
      this._hideButtonClear(this.buttonsMinus);
    }
  }

  _handleDropDownResizeLoadWindow() {
    this._toggle(false);
  }

  _getInitialCounterList(counterList) {
    this.categories = [];

    counterList.forEach((item, i) => {
      const dropDownObject = {};
      const categoryName = getElement('category', item, this.elementName);
      const categoryCount = getElement('count-value', item, this.elementName);
      const categoryIncrement = getElement('count-increment', item, this.elementName);
      const categoryDecrement = getElement('count-decrement', item, this.elementName);

      dropDownObject.name = categoryName.innerText.toLowerCase();
      dropDownObject.type = categoryName.getAttribute('data-type');
      dropDownObject.wordForms = categoryName.getAttribute('data-wordForms');
      dropDownObject.defaultCount = Number(categoryCount.innerText);
      dropDownObject.currentCount = dropDownObject.defaultCount;
      dropDownObject.maxCount = Number(categoryIncrement.getAttribute('data-max'));
      dropDownObject.minCount = Number(categoryDecrement.getAttribute('data-min'));
      dropDownObject.maxTypeCount = Number(categoryIncrement.getAttribute('data-type-max'));
      dropDownObject.currentTypeCount = 0;
      dropDownObject.index = i;

      this.categories.push(dropDownObject);
    });

    this._updateButtons(this.categories);
    if (this.clearApplyButtons) {
      this._hideButtonClear(this.buttonsMinus);
    }
    this._updateCategoriesList(this.categories);
  }

  _updateCategory(newCounter, newCounterType, name, type, element) {
    this.categories.forEach((category) => {
      const item = category;
      if (category.name === name.toLowerCase()) { item.currentCount = newCounter; }
      if (category.type === type) { item.currentTypeCount = newCounterType; }
    });
    const wrapper = element;
    wrapper.querySelector(`.${this.elementName}__count-value`).innerText = newCounter;
  }

  _findCategory(name) {
    return this.categories.find(
      (category) => category.name === name.toLowerCase(),
    );
  }

  _filterCategory(type) {
    return this.categories.filter((category) => category.type === type);
  }

  _changeCategoryCounter(name, counter) {
    const span = this.listWrapper.querySelector(`[data-name="${name}"]`);
    const wrapper = span.closest(`.${this.elementName}__category-wrapper`);

    const {
      type, minCount, maxCount, maxTypeCount,
    } = this._findCategory(name);

    const categoriesOfType = this._filterCategory(type);

    const currentTypeCount = DropDown._reduceCategory(categoriesOfType);

    const countNew = Math.abs(counter);

    if (countNew > minCount) {
      const data = {
        wrapper, currentTypeCount, maxTypeCount, countNew, maxCount, name, type,
      };
      this._increaseCounter(data, true);
    }
    return false;
  }

  _increaseCounter(data, isInitial = false) {
    const {
      wrapper, currentTypeCount, maxTypeCount, maxCount, name, type, currentCount,
    } = data;
    let { countNew } = data;
    const buttonMinus = wrapper.querySelector(`.js-${this.elementName}__count-decrement`);
    buttonMinus.disabled = false;

    let currentTypeCountNew = 0;

    if (!isInitial) {
      countNew = currentCount + 1;
      currentTypeCountNew = currentTypeCount + 1;
    } else {
      currentTypeCountNew = currentTypeCount + countNew;
    }

    if (currentTypeCountNew <= maxTypeCount && countNew <= maxCount) {
      this._updateCategory(countNew, currentTypeCountNew, name, type, wrapper);
    } else return false;
    this._updateCategoriesList(this.categories);
    return this._updateButtons(this.categories, true);
  }

  _decreaseCounter(data) {
    const {
      categoriesOfType, wrapper, currentTypeCount, minCount, name, type, currentCount,
    } = data;

    categoriesOfType.forEach((category) => {
      if (category.currentTypeCount <= category.maxTypeCount) {
        const categoryWrapper = this.listElements[category.index];
        const buttonPlus = categoryWrapper.querySelector(`.js-${this.elementName}__count-increment`);
        buttonPlus.disabled = false;
      }
    });

    const countNew = currentCount - 1;
    const currentTypeCountNew = currentTypeCount - 1;
    if (countNew >= minCount) {
      this._updateCategory(countNew, currentTypeCountNew, name, type, wrapper);
    } else return false;
    this._updateCategoriesList(this.categories);
    return this._updateButtons(this.categories);
  }

  _updateCategoriesList(changedCounters) {
    this.countersToDisplay = [];

    changedCounters.forEach((counter, i, array) => {
      const check = i === 0 || (i > 0 && counter.type !== array[i - 1].type);
      if (check) {
        const { type, wordForms, currentCount } = counter;
        this.countersToDisplay.push({ type, currentCount, wordForms: wordForms.split(',') });
      }
      if (i > 0 && counter.type === array[i - 1].type) {
        const element = this.countersToDisplay.find((item) => item.type === counter.type);
        element.currentCount = parseInt(element.currentCount, 10)
          + parseInt(counter.currentCount, 10);
      }
    });

    this._updateInput(this.countersToDisplay);
  }

  _updateInput(countersToDisplay) {
    let value = '';
    countersToDisplay.forEach((counter) => {
      if (parseInt(counter.currentCount, 10) !== 0) {
        value += `${counter.currentCount} ${getWordForm(
          parseInt(counter.currentCount, 10),
          counter.wordForms,
        )}, `;
      }
    });
    this.input.value = value.substring(0, value.length - 2);
    if (this.guestsSelectHandler) {
      this.guestsSelectHandler(this.input.value);
    }
  }

  _updateButtons(categories, isIncrease = false) {
    categories.forEach((category, i) => {
      const isMax = category.currentCount >= category.maxCount
        || category.currentTypeCount >= category.maxTypeCount;
      const isMin = category.currentCount <= category.minCount;
      const categoryWrapper = this.listElements[i];
      if (isIncrease && isMax) {
        const buttonPlus = categoryWrapper.querySelector(`.js-${this.elementName}__count-increment`);
        buttonPlus.disabled = true;
      }
      if (!isIncrease && isMin) {
        const buttonMinus = categoryWrapper.querySelector(`.js-${this.elementName}__count-decrement`);
        buttonMinus.disabled = true;
      }
    });

    if (this.clearApplyButtons) {
      this._hideButtonClear(this.buttonsMinus);
    }
  }

  _hideButtonClear(buttonsMinus) {
    const arr = [];
    buttonsMinus.forEach((button) => arr.push(button.disabled));
    const isCleared = arr.find((item) => item === false);
    if (isCleared === undefined) {
      this.buttonClear.classList.add(`${this.elementName}__button_hidden`);
    } else {
      this.buttonClear.classList.remove(`${this.elementName}__button_hidden`);
    }
  }

  _toggle(isExpanded) {
    const wrapper = `${this.elementName}__`;

    if (isExpanded) {
      this.listWrapper.classList.toggle(`${wrapper}list-wrapper_hidden`);
      this.inputWrapper.classList.toggle(`${wrapper}input-wrapper_expanded`);
      this.input.classList.toggle(`${wrapper}input_expanded`);
      this.input.classList.toggle(`${wrapper}input_collapsed`);
    } else {
      this.listWrapper.classList.add(`${wrapper}list-wrapper_hidden`);
      this.inputWrapper.classList.remove(`${wrapper}input-wrapper_expanded`);
      this.input.classList.remove(`${wrapper}input_expanded`);
      this.input.classList.add(`${wrapper}input_collapsed`);
    }
  }
}

export default DropDown;
