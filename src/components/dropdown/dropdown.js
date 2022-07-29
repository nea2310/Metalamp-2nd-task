/* eslint-disable no-console */
/* eslint-disable class-methods-use-this */
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
    this._handleDropDownClickDoc = this._handleDropDownClickDoc.bind(this);
    this._handleDropDownFocusinWrapper = this._handleDropDownFocusinWrapper.bind(this);
    this._handleDropDownFocusinDoc = this._handleDropDownFocusinDoc.bind(this);
    this._handleDropDownClickApply = this._handleDropDownClickApply.bind(this);
    this._handleDropDownClickClear = this._handleDropDownClickClear.bind(this);
    this._handleDropDownResizeLoadWindow = this._handleDropDownResizeLoadWindow.bind(this);

    this._render();
    this._bindEventListeners();
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
    this.clearApplyButtons = this.buttonClear != null && this.buttonApply != null;
    this._getInitialCounterList(this.listElements);
  }

  _getInitialCounterList(counterList) {
    this.counters = [];
    counterList.forEach((item) => {
      const dropDownObject = {};
      const categoryName = this._getElement('category', item);
      const categoryCount = this._getElement('count-value', item);
      const categoryIncrement = this._getElement('count-increment', item);
      const categoryDecrement = this._getElement('count-decrement', item);

      dropDownObject.text = categoryName.innerText.toLowerCase();
      dropDownObject.type = categoryName.getAttribute('data-type');
      dropDownObject.declensions = categoryName.getAttribute('data-declensions');
      dropDownObject.count = categoryCount.innerText;
      dropDownObject.maxCount = categoryIncrement.getAttribute('data-max');
      dropDownObject.minCount = categoryDecrement.getAttribute('data-min');
      dropDownObject.isMax = dropDownObject.count === dropDownObject.maxCount;
      dropDownObject.isMin = dropDownObject.count === dropDownObject.minCount;

      this.counters.push(dropDownObject);
    });

    this._initializeButtons(this.counters);
    if (this.clearApplyButtons) {
      this._hideButtonClear(this.buttonsMinus);
    }
  }

  _initializeButtons(counterList) {
    counterList.forEach((item, i) => {
      const element = this.listElements[i];
      if (item.isMin) {
        const minus = this._getElement('count-decrement', element);
        minus.disabled = true;
      }
      if (item.isMax) {
        const plus = this._getElement('count-increment', element);
        plus.disabled = true;
      }
    });
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
    document.addEventListener('click', this._handleDropDownClickDoc);
    document.addEventListener('focusin', this._handleDropDownFocusinDoc);
    window.addEventListener('resize', this._handleDropDownResizeLoadWindow);
    window.addEventListener('load', this._handleDropDownResizeLoadWindow);
  }

  _handleDropDownClickCounter(e) {
    const element = e.currentTarget;
    const text = e.target.parentElement.parentElement
      .firstElementChild.innerText.toLowerCase();
    let editedCounter;
    if (element.classList
      .contains(`${this.elementName}__count-decrement`)) {
      element.parentElement.lastElementChild.disabled = false;
      const currentCounter = parseInt(e.target.nextElementSibling.innerText, 10);
      editedCounter = String(currentCounter - 1);
      e.target.nextElementSibling.innerText = editedCounter;
    } else {
      element.parentElement.firstElementChild.disabled = false;
      if (this.clearApplyButtons) {
        this.buttonClear
          .classList.remove(`${this.elementName}__button_hidden`);
      }
      const currentCounter = parseInt(e.target.previousElementSibling.innerText, 10);
      editedCounter = String(currentCounter + 1);
      e.target.previousElementSibling.innerText = editedCounter;
    }
    this._updateCounterList(text, editedCounter);
  }

  _handleDropDownMousedownInput() {
    this.mouseDown = true;
  }

  _handleDropDownMouseupInput() {
    this._toggle(true);
    this.mouseDown = false;
  }

  _handleDropDownFocusInput() {
    if (this.listWrapper.classList
      .contains(`${this.elementName}__list-wrapper_hidden`)
      && this.mouseDown === false) {
      this._toggle(true);
    }
  }

  _handleDropDownClickWrapper() {
    this.clickOnList = true;
  }

  _handleDropDownClickDoc(e) {
    const condition = (e.target !== this.input && e.target !== this.inputWrapper
      && Array.of(this.counts).some((element) => element === e.target));
    console.log(condition);
    console.log(e.target);

    if (condition) {
      this._toggle(false);
    } else {
      this.clickOnList = false;
    }
  }

  _handleDropDownFocusinWrapper() {
    this.focusOnList = true;
  }

  _handleDropDownFocusinDoc() {
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
    this.countValues.forEach((item, i) => {
      this.countValues[i].innerText = this.counters[i].minCount;
      this._updateCounterList(
        this.counters[i].text,
        item.innerText,
      );
    });
    this.input.value = '';
  }

  _handleDropDownResizeLoadWindow() {
    this._toggle(false);
  }

  _updateCounterList(text, editedCounter) {
    this.counters = this.counters.map((counter) => {
      if (counter.text === text) {
        const object = {
          text: counter.text,
          type: counter.type,
          declensions: counter.declensions,
          count: editedCounter,
          minCount: counter.minCount,
          maxCount: counter.maxCount,
        };
        switch (editedCounter) {
          case counter.minCount:
            object.isMin = true;
            break;
          case counter.maxCount:
            object.isMax = true;
            break;
          default:
            object.isMin = false;
            object.isMax = false;
        }
        return object;
      } return counter;
    });
    this._updateButtons(this.counters);
    this._updateCategoriesList(this.counters);
  }

  _updateButtons(counters) {
    counters.forEach((item, i) => {
      const { count } = item;
      const countToChange = this.listElements[i]
        .querySelector(`.${this.elementName}__count-value`);
      countToChange.innerText = count;
      if (item.isMin) {
        countToChange.previousElementSibling.disabled = true;
      }
      if (item.isMax) {
        countToChange.nextElementSibling.disabled = true;
      }
    });

    if (this.clearApplyButtons) {
      this._hideButtonClear(this.buttonsMinus);
    }
  }

  _hideButtonClear(buttonsMinus) {
    const arr = [];
    buttonsMinus.forEach((button) => arr.push(button.disabled));
    let isCleared = arr.find((item) => item
      === false);
    if (isCleared === undefined) {
      isCleared = true;
      this.buttonClear.classList.add(`${this.elementName}__button_hidden`);
    }
  }

  _updateCategoriesList(changedCounters) {
    this.countersToDisplay = [];

    changedCounters.forEach((counter, i, array) => {
      const check = i === 0 || (i > 0 && counter.type !== array[i - 1].type);
      if (check) {
        const { type, declensions, count } = counter;
        this.countersToDisplay.push({ type, count, declensions: declensions.split(',') });
      }
      if (i > 0 && counter.type
        === array[i - 1].type) {
        const element = this.countersToDisplay.find((item) => item.type
          === counter.type);
        element.count = String(parseInt(element.count, 10)
          + parseInt(counter.count, 10));
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
      if (parseInt(counter.count, 10) !== 0) {
        value += `${counter.count} ${getWordForm(
          parseInt(counter.count, 10),
          counter.declensions,
        )}, `;
      }
    });
    this.input.value = value.substring(0, value.length - 2);
  }

  _toggle(isExpanded) {
    const wrapper = `${this.elementName}__`;

    if (isExpanded) {
      this.listWrapper.classList
        .toggle(`${wrapper}list-wrapper_hidden`);
      this.inputWrapper.classList.toggle(`${wrapper}input-wrapper_expanded`);
      this.input.classList.toggle(`${wrapper}input_expanded`);
      this.input.classList.toggle(`${wrapper}input_collapsed`);
    } else {
      this.listWrapper.classList
        .add(`${wrapper}list-wrapper_hidden`);
      this.inputWrapper.classList.remove(`${wrapper}input-wrapper_expanded`);
      this.input.classList.remove(`${wrapper}input_expanded`);
      this.input.classList.add(`${wrapper}input_collapsed`);
    }
  }

  _getElement(selector, wrapper = this.wrapper) {
    return wrapper
      .querySelector(`.js-${this.elementName}__${selector}`);
  }

  _getElements(selectors) {
    let string = '';
    selectors.forEach((selector) => { string += `.js-${this.elementName}__${selector},`; });
    string = string.substring(0, string.length - 1);
    return this.wrapper
      .querySelectorAll(string);
  }
}

function _renderDropDowns(selector) {
  const dropDowns = document.querySelectorAll(selector);
  dropDowns.forEach((dropDown) => new DropDown(selector, dropDown));
}
_renderDropDowns('.js-dropdown');
