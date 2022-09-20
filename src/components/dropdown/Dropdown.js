import './dropdown.scss';

class DropDown {
  constructor(elementName, element) {
    this.elementName = elementName.replace(/^.js-/, '');
    this.wrapper = element;
    this._handleDropDownClickCounter = this._handleDropDownClickCounter.bind(this);
    this._handleDropDownMousedownInput = this._handleDropDownMousedownInput.bind(this);
    this._handleDropDownMouseupInput = this._handleDropDownMouseupInput.bind(this);
    this._handleDropDownFocusInput = this._handleDropDownFocusInput.bind(this);
    this._handleDropDownClickWrapper = this._handleDropDownClickWrapper.bind(this);
    this._handleDropDownClickDocument = this._handleDropDownClickDocument.bind(this);
    this._handleDropDownFocusinWrapper = this._handleDropDownFocusinWrapper.bind(this);
    this._handleDropDownFocusinDocument = this._handleDropDownFocusinDocument.bind(this);
    this._handleDropDownClickApply = this._handleDropDownClickApply.bind(this);
    this._handleDropDownClickClear = this._handleDropDownClickClear.bind(this);
    this._handleDropDownResizeLoadWindow = this._handleDropDownResizeLoadWindow.bind(this);

    this._render();
    this._bindEventListeners();
  }

  subscribeGuestsSelect(handler) {
    this.guestsSelectHandler = handler;
  }

  _render() {
    this.clickOnList = false;
    this.focusOnList = false;
    this.mouseDown = false;

    this.input = this._getElement('input');
    this.inputWrapper = this._getElement('input-wrapper');
    this.listWrapper = this._getElement('list-wrapper');
    this.counts = this._getElements(['count-decrement', 'count-increment']);
    this.countValues = this._getElements(['count-value']);
    this.listElements = this._getElements(['category-wrapper']);
    this.buttonClear = this._getElement('button-clear');
    this.buttonApply = this._getElement('button-apply');
    this.buttonsMinus = this._getElements(['count-decrement']);
    this.buttonsPlus = this._getElements(['count-increment']);
    this.clearApplyButtons = this.buttonClear != null && this.buttonApply != null;
    this._getInitialCounterList(this.listElements);
  }

  _getInitialCounterList(counterList) {
    this.categories = [];

    counterList.forEach((item, i) => {
      const dropDownObject = {};
      const categoryName = this._getElement('category', item);
      const categoryCount = this._getElement('count-value', item);
      const categoryIncrement = this._getElement('count-increment', item);
      const categoryDecrement = this._getElement('count-decrement', item);

      dropDownObject.name = categoryName.innerText.toLowerCase();
      dropDownObject.type = categoryName.getAttribute('data-type');
      dropDownObject.declensions = categoryName.getAttribute('data-declensions');
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
  }

  _bindEventListeners() {
    this.inputWrapper.addEventListener('mousedown', this._handleDropDownMousedownInput);
    this.inputWrapper.addEventListener('mouseup', this._handleDropDownMouseupInput);
    this.input.addEventListener('focus', this._handleDropDownFocusInput);
    this.counts.forEach((element) => element.addEventListener('click', this._handleDropDownClickCounter));
    if (this.clearApplyButtons) {
      this.buttonApply.addEventListener('click', this._handleDropDownClickApply);
    }
    if (this.clearApplyButtons) {
      this.buttonClear.addEventListener('click', this._handleDropDownClickClear);
    }
    this.wrapper.addEventListener('click', this._handleDropDownClickWrapper);
    this.wrapper.addEventListener('focusin', this._handleDropDownFocusinWrapper);
    document.addEventListener('click', this._handleDropDownClickDocument);
    document.addEventListener('focusin', this._handleDropDownFocusinDocument);
    window.addEventListener('resize', this._handleDropDownResizeLoadWindow);
    window.addEventListener('load', this._handleDropDownResizeLoadWindow);
  }

  _handleDropDownClickCounter(event) {
    const button = event.currentTarget;
    const wrapper = event.target.closest(`.${this.elementName}__category-wrapper`);
    const name = wrapper.querySelector(`.${this.elementName}__category`).innerText;
    const {
      type, currentCount, minCount, maxCount, maxTypeCount,
    } = this.categories.find(
      (category) => category.name === name.toLowerCase(),
    );

    const categoriesOfType = this.categories.filter((category) => category.type === type);

    const currentTypeCount = categoriesOfType
      .reduce((sum, category) => category.currentCount + sum, 0);

    const updateCategory = (newCounter, newCounterType) => {
      this.categories.forEach((category) => {
        const item = category;
        if (category.name === name.toLowerCase()) { item.currentCount = newCounter; }
        if (category.type === type) { item.currentTypeCount = newCounterType; }
      });
      wrapper.querySelector(`.${this.elementName}__count-value`).innerText = newCounter;
    };

    if (button.classList.contains(`${this.elementName}__count-increment`)) {
      const buttonMinus = wrapper.querySelector(`.js-${this.elementName}__count-decrement`);
      buttonMinus.disabled = false;

      const countNew = currentCount + 1;
      const currentTypeCountNew = currentTypeCount + 1;
      if (currentTypeCountNew <= maxTypeCount && countNew <= maxCount) {
        updateCategory(countNew, currentTypeCountNew);
      } else return false;
      this._updateCategoriesList(this.categories);
      return this._updateButtons(this.categories, true);
    }

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
      updateCategory(countNew, currentTypeCountNew);
    } else return false;
    this._updateCategoriesList(this.categories);
    return this._updateButtons(this.categories);
  }

  _handleDropDownMousedownInput() {
    this.mouseDown = true;
  }

  _handleDropDownMouseupInput() {
    this._toggle(true);
    this.mouseDown = false;
  }

  _handleDropDownFocusInput() {
    if (this.listWrapper.classList.contains(`${this.elementName}__list-wrapper_hidden`)
      && this.mouseDown === false) {
      this._toggle(true);
    }
  }

  _handleDropDownClickWrapper() {
    this.clickOnList = true;
  }

  _handleDropDownClickDocument(event) {
    if (event.target !== this.input
      && !event.target.closest(`.js-${this.elementName}__list-wrapper`)) {
      this._toggle(false);
    } else {
      this.clickOnList = false;
    }
  }

  _handleDropDownFocusinWrapper() {
    this.focusOnList = true;
  }

  _handleDropDownFocusinDocument() {
    if (this.focusOnList === false) {
      this._toggle(false);
    } else {
      this.focusOnList = false;
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
    this.guestsSelectHandler('0 гостей');
    if (this.clearApplyButtons) {
      this._hideButtonClear(this.buttonsMinus);
    }
  }

  _handleDropDownResizeLoadWindow() {
    this._toggle(false);
  }

  _updateCategoriesList(changedCounters) {
    this.countersToDisplay = [];

    changedCounters.forEach((counter, i, array) => {
      const check = i === 0 || (i > 0 && counter.type !== array[i - 1].type);
      if (check) {
        const { type, declensions, currentCount } = counter;
        this.countersToDisplay.push({ type, currentCount, declensions: declensions.split(',') });
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
    function getWordForm(count, words) {
      let value = count;
      value = Math.abs(value) % 100;
      const number = value % 10;
      if (value > 10 && value < 20) return words[2];
      if (number > 1 && number < 5) return words[1];
      if (number === 1) return words[0];
      return words[2];
    }
    let value = '';
    countersToDisplay.forEach((counter) => {
      if (parseInt(counter.currentCount, 10) !== 0) {
        value += `${counter.currentCount} ${getWordForm(
          parseInt(counter.currentCount, 10),
          counter.declensions,
        )}, `;
      }
    });
    this.input.value = value.substring(0, value.length - 2);
    this.guestsSelectHandler(this.input.value);
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

  _getElement(selector, wrapper = this.wrapper) {
    return wrapper.querySelector(`.js-${this.elementName}__${selector}`);
  }

  _getElements(selectors) {
    let string = '';
    selectors.forEach((selector) => {
      string += `.js-${this.elementName}__${selector},`;
    });
    string = string.substring(0, string.length - 1);
    return this.wrapper.querySelectorAll(string);
  }
}

export default DropDown;
