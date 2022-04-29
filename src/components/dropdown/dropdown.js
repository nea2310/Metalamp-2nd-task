/* eslint-disable class-methods-use-this */
/* eslint-disable no-console */
import './dropdown.scss';

class DropDown {
  constructor(elementName, element) {
    this.elementName = elementName.replace(/^.js-/, '');
    this.wrapper = element;
    this._handleDropDownClickCounter = this._handleDropDownClickCounter.bind(this);
    this._handleDropDownMousedownInput = this._handleDropDownMousedownInput.bind(this);
    this._handleDropDownMouseupInput = this._handleDropDownMouseupInput.bind(this);
    this._handleDropDownMousedownTip = this._handleDropDownMousedownTip.bind(this);
    this._handleDropDownMouseupTip = this._handleDropDownMouseupTip.bind(this);
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
    this.listWrapper = this._getElement('list-wrapper');
    this.counts = this._getElements(['count-decrement', 'count-increment']);
    this.countValues = this._getElements(['count-value']);
    this.listElements = this._getElements(['category-wrapper']);
    this.buttonClear = this._getElement('button-clear');
    this.buttonApply = this._getElement('button-apply');
    this.buttonsMinus = this._getElements(['count-decrement']);
    this.tip = this._getElement('image');

    this.clearApplyButtons = this.buttonClear != null && this.buttonApply != null;
    this._getInitialCounterList(this.listElements);
  }

  /* Получение начального состояния счетчиков (текущее значение;
    является ли оно минимальным или максимальным; название и тип категории) */
  _getInitialCounterList(counterList) {
    this.counters = [];
    for (let i = 0; i < counterList.length; i += 1) {
      const dropDownObject = {};
      const categoryName = this._getElement('category', counterList[i]);
      const catCnt = this._getElement('count-value', counterList[i]);
      const categoryIncrement = this._getElement('count-increment', counterList[i]);
      const categoryDecrement = this._getElement('count-decrement', counterList[i]);

      dropDownObject.text = categoryName.innerText.toLowerCase();
      dropDownObject.type = categoryName.getAttribute('data-type');
      dropDownObject.declensions = categoryName.getAttribute('data-declensions');
      dropDownObject.count = catCnt.innerText;
      dropDownObject.maxCount = categoryIncrement.getAttribute('data-max');
      dropDownObject.minCount = categoryDecrement.getAttribute('data-min');
      dropDownObject.isMax = dropDownObject.count === dropDownObject.maxCount;
      dropDownObject.isMin = dropDownObject.count === dropDownObject.minCount;

      this.counters.push(dropDownObject);
    }

    this._initializeButtons(this.counters);
    if (this.clearApplyButtons) {
      this._hideButtonClear(this.buttonsMinus);
    }
  }

  /* определяем неактивные кнопки (если начальное значение счетчика -
    минимальное или максимальное) */
  _initializeButtons(counterList) {
    for (let i = 0; i < counterList.length; i += 1) {
      const element = this.listElements[i];
      if (counterList[i].isMin) {
        const minus = this._getElement('count-decrement', element);
        minus.disabled = true;
      }
      if (counterList[i].isMax) {
        const plus = this._getElement('count-increment', element);
        plus.disabled = true;
      }
    }
  }

  _bindEventListeners() {
    // клик по инпуту
    this.input.addEventListener('mousedown', this._handleDropDownMousedownInput);
    this.input.addEventListener('mouseup', this._handleDropDownMouseupInput);

    // клик по уголку
    this.tip.addEventListener('mousedown', this._handleDropDownMousedownInput);
    this.tip.addEventListener('mouseup', this._handleDropDownMouseupInput);

    // фокус на инпут
    this.input.addEventListener('focus', this._handleDropDownFocusInput);

    // обработка клика по кнопкам Плюс / Минус
    this.counts.forEach((element) => element.addEventListener('click', this._handleDropDownClickCounter));

    // клик по кнопке [Применить]
    if (this.clearApplyButtons) {
      this.buttonApply.addEventListener('click', this._handleDropDownClickApply);
    }

    // клик по кнопке [очистить]
    if (this.clearApplyButtons) {
      this.buttonClear.addEventListener('click', this._handleDropDownClickClear);
    }

    // проверка, клик был снаружи или внутри виджета
    this.wrapper.addEventListener('click', this._handleDropDownClickWrapper);

    // проверка, фокус был снаружи или внутри виджета
    this.wrapper.addEventListener('focusin', this._handleDropDownFocusinWrapper);

    // отлавливаем все клики по документу, если клик снаружи виджета - сворачиваем виджет
    document.addEventListener('click', this._handleDropDownClickDoc);

    // отлавливаем все фокусы по документу, если фокус снаружи виджета - сворачиваем виджет
    document.addEventListener('focusin', this._handleDropDownFocusinDoc);

    // ресайз/лоад страницы
    window.addEventListener('resize', this._handleDropDownResizeLoadWindow);
    window.addEventListener('load', this._handleDropDownResizeLoadWindow);
  }

  _handleDropDownClickCounter(e) {
    const element = e.currentTarget;
    const text = e.target.parentElement.parentElement
      .firstElementChild.innerText.toLowerCase();
    let editedCounter;
    // Для кнопки "минус"
    if (element.classList
      .contains(`${this.elementName}__count-decrement`)) {
      // Сделать активной кнопку "плюс" при клике на кнопку "минус"
      element.parentElement.lastElementChild.disabled = false;
      // Уменьшить счетчик на единицу
      const currentCounter = parseInt(e.target.nextElementSibling.innerText, 10);
      editedCounter = String(currentCounter - 1);
      e.target.nextElementSibling.innerText = editedCounter;
    } else { // для кнопки "плюс": Сделать активной кнопку "минус" при клике на кнопку "плюс"
      element.parentElement.firstElementChild.disabled = false;
      if (this.clearApplyButtons) { // Показать кнопку [Очистить]
        this.buttonClear
          .classList.remove(`${this.elementName}__button_hidden`);
      }
      // Увеличить счетчик на единицу
      const currentCounter = parseInt(e.target.previousElementSibling.innerText, 10);
      editedCounter = String(currentCounter + 1);
      e.target.previousElementSibling.innerText = editedCounter;
    }
    this._updateCounterList(text, editedCounter);
  }

  _handleDropDownMousedownInput(e) {
    if (e.target.classList.contains('js-dropdown__image')) {
      e.preventDefault();
    }
    console.log('_handleDropDownMousedownInput');
    console.log(e.target);
    this.mouseDown = true;
  }

  _handleDropDownMouseupInput(e) {
    if (e.target.classList.contains('js-dropdown__image')) {
      e.preventDefault();
    }
    this._toggle(true);
    this.mouseDown = false;
  }

  _handleDropDownMousedownTip() {
    return true;
  }

  _handleDropDownMouseupTip() {
    this._toggle(true);
    this.mouseDown = true;
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

  _handleDropDownClickDoc() {
    if (this.clickOnList === false) {
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
    for (let i = 0; i < this.countValues.length; i += 1) {
      this.countValues[i].innerText = this.counters[i].minCount;
      this._updateCounterList(
        this.counters[i].text,
        this.countValues[i].innerText,
      );
    }
    this.input.value = '';
  }

  _handleDropDownResizeLoadWindow() {
    this._toggle(false);
  }

  /* обновление состояния счетчиков */
  _updateCounterList(text, editedCounter) {
    this.counters = this.counters.map((counter) => {
      if (counter.text === text) {
        const obj = {
          text: counter.text,
          type: counter.type,
          declensions: counter.declensions,
          count: editedCounter,
          minCount: counter.minCount,
          maxCount: counter.maxCount,
        };
        switch (editedCounter) {
          case counter.minCount:
            obj.isMin = true;
            break;
          case counter.maxCount:
            obj.isMax = true;
            break;
          default:
            obj.isMin = false;
            obj.isMax = false;
        }
        return obj;
      } return counter;
    });
    this._updateButtons(this.counters);
    this._updateCategoriesList(this.counters);
  }

  /* обновление кнопок Плюс/ Минус (делаем неактивными,
    если достигнуто минимальное/ максимальное значение) */
  _updateButtons(counters) {
    for (let i = 0; i < counters.length; i += 1) {
      const { count } = counters[i];
      const countToChange = this.listElements[i]
        .querySelector(`.${this.elementName}__count-value`);
      countToChange.innerText = count;
      /* Если обновленное значение - минимальное разрешенное значение,
      то сделать кнопку "минус" неактивной */
      if (counters[i].isMin) {
        countToChange.previousElementSibling.disabled = true;
      }
      /* Если обновленное значение - максимальное разрешенное значение,
      то сделать кнопку "плюс" неактивной */
      if (counters[i].isMax) {
        countToChange.nextElementSibling.disabled = true;
      }
    }
    if (this.clearApplyButtons) {
      this._hideButtonClear(this.buttonsMinus);
    }
  }

  // Скрыть кнопку [очистить]
  _hideButtonClear(buttonsMinus) {
    const arr = [];
    buttonsMinus.forEach((button) => arr.push(button.disabled));
    // есть ли среди кнопок "Минус" активные (disabled==false)
    let isCleared = arr.find((item) => item
      === false);
    // если активные кнопки не обнаружены - isCleared=true
    if (isCleared === undefined) {
      isCleared = true;
      // скрыть кнопку [Очистить]
      this.buttonClear.classList.add(`${this.elementName}__button_hidden`);
    }
  }

  /* Обновление списка категорий, которые выводятся в инпуте */
  _updateCategoriesList(changedCounters) {
    this.countersToDisplay = [];
    for (let i = 0; i < changedCounters.length; i += 1) {
      // Если категории такого типа еще нет
      const check = i === 0 || (i > 0 && changedCounters[i].type !== changedCounters[i - 1].type);
      if (check) {
        const { type } = changedCounters[i];
        const { declensions } = changedCounters[i];
        const { count } = changedCounters[i];
        const element = {};
        element.type = type;
        element.declensions = declensions.split(',');
        element.count = count;
        // То добавить в массив, который в конце будет присвоен changedCountersToDisplay
        this.countersToDisplay.push(element);
      }
      // Если  категория такого типа уже есть
      if (i > 0 && changedCounters[i].type
        === changedCounters[i - 1].type) {
        const element = this.countersToDisplay.find((item) => item.type
          === changedCounters[i].type);
        // То в массив не добавлять, а прибавить значение к значению счетчика этой категории
        element.count = String(parseInt(element.count, 10)
          + parseInt(changedCounters[i].count, 10));
      }
    }
    this._updateInput(this.countersToDisplay);
  }

  /* обновление значения в инпуте */
  _updateInput(countersToDisplay) {
    // Определение падежа категории в зависимости от значения счетчика
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
      // исключаем категории, у которых счетчик = 0
      if (parseInt(counter.count, 10) !== 0) {
        value += `${counter.count} ${getWordForm(
          parseInt(counter.count, 10),
          counter.declensions,
        )}, `;
      }
    });
    this.input.value = value.substring(0, value.length - 2);
  }

  // Открывание/ закрывание дропдауна
  _toggle(isExpanded) {
    const wrapper = `${this.elementName}__`;
    if (isExpanded) {
      this.listWrapper.classList
        .toggle(`${wrapper}list-wrapper_hidden`);
      this.tip.classList.toggle(`${wrapper}image_expanded`);
      this.tip.classList.toggle(`${wrapper}image_collapsed`);
      this.input.classList.toggle(`${wrapper}input_expanded`);
      this.input.classList.toggle(`${wrapper}input_collapsed`);
    } else {
      this.listWrapper.classList
        .add(`${wrapper}list-wrapper_hidden`);
      this.tip.classList.remove(`${wrapper}image_expanded`);
      this.tip.classList.add(`${wrapper}image_collapsed`);
      this.input.classList.remove(`${wrapper}input_expanded`);
      this.input.classList.add(`${wrapper}input_collapsed`);
    }
  }

  _getElement(selector, wrapper = this.wrapper) {
    return wrapper
      .querySelector(`.js-${this.elementName}__${selector}`);
  }

  _getElements(selectors) {
    let sel = '';
    selectors.forEach((selector) => { sel += `.js-${this.elementName}__${selector},`; });
    sel = sel.substring(0, sel.length - 1);
    return this.wrapper
      .querySelectorAll(sel);
  }
}

function _renderDropDowns(selector) {
  const dropDowns = document.querySelectorAll(selector);
  dropDowns.forEach((dropDown) => new DropDown(selector, dropDown));
}
_renderDropDowns('.js-dropdown');
