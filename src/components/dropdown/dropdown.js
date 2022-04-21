import './dropdown.scss';

class DropDown {
  constructor(elemName, elem) {
    this.elemName = elemName.replace(/^.js-/, '');
    this.wrapper = elem;
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

    this.input = this._getElem('input');
    this.listWrapper = this._getElem('list-wrapper');
    this.counts = this._getElems(['count-decrem', 'count-increm']);
    this.countVals = this._getElems(['count-val']);
    this.listElems = this._getElems(['cat-wrapper']);
    this.btnClear = this._getElem('button-clear');
    this.btnApply = this._getElem('button-apply');
    this.btnsMinus = this._getElems(['count-decrem']);
    this.tip = this._getElem('image');

    this.clearApplyBtns = this.btnClear != null && this.btnApply != null;
    this._getInitialCounterList(this.listElems);
  }

  /* Получение начального состояния счетчиков (текущее значение;
    является ли оно минимальным или максимальным; название и тип категории) */
  _getInitialCounterList(counterList) {
    this.counters = [];
    for (let i = 0; i < counterList.length; i += 1) {
      const elemObj = {};
      const catName = this._getElem('cat', counterList[i]);
      const catCnt = this._getElem('count-val', counterList[i]);
      const catIncrem = this._getElem('count-increm', counterList[i]);
      const catDecrem = this._getElem('count-decrem', counterList[i]);

      elemObj.text = catName.innerText.toLowerCase();
      elemObj.type = catName.getAttribute('data-type');
      elemObj.typeforms = catName.getAttribute('data-typeforms');
      elemObj.cnt = catCnt.innerText;
      elemObj.maxCnt = catIncrem.getAttribute('data-max');
      elemObj.minCnt = catDecrem.getAttribute('data-min');
      elemObj.isMax = elemObj.cnt === elemObj.maxCnt;
      elemObj.isMin = elemObj.cnt === elemObj.minCnt;

      this.counters.push(elemObj);
    }

    this._initializeButtons(this.counters);
    if (this.clearApplyBtns) {
      this._hideBtnClear(this.btnsMinus);
    }
  }

  /* определяем неактивные кнопки (если начальное значение счетчика -
    минимальное или максимальное) */
  _initializeButtons(counterList) {
    for (let i = 0; i < counterList.length; i += 1) {
      const elem = this.listElems[i];
      if (counterList[i].isMin) {
        const minus = this._getElem('count-decrem', elem);
        minus.disabled = true;
      }
      if (counterList[i].isMax) {
        const plus = this._getElem('count-increm', elem);
        plus.disabled = true;
      }
    }
  }

  _bindEventListeners() {
    // клик по инпуту
    this.input.addEventListener('mousedown', this._handleDropDownMousedownInput);
    this.input.addEventListener('mouseup', this._handleDropDownMouseupInput);

    // фокус на инпут
    this.input.addEventListener('focus', this._handleDropDownFocusInput);

    // обработка клика по кнопкам Плюс / Минус
    this.counts.forEach((elem) => elem.addEventListener('click', this._handleDropDownClickCounter));

    // клик по кнопке [Применить]
    if (this.clearApplyBtns) {
      this.btnApply.addEventListener('click', this._handleDropDownClickApply);
    }

    // клик по кнопке [очистить]
    if (this.clearApplyBtns) {
      this.btnClear.addEventListener('click', this._handleDropDownClickClear);
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
    const elem = e.currentTarget;
    const text = e.target.parentElement.parentElement
      .firstElementChild.innerText.toLowerCase();
    let editedCounter;
    // Для кнопки "минус"
    if (elem.classList
      .contains(`${this.elemName}__count-decrem`)) {
      // Сделать активной кнопку "плюс" при клике на кнопку "минус"
      elem.parentElement.lastElementChild.disabled = false;
      // Уменьшить счетчик на единицу
      const currentCounter = parseInt(e.target.nextElementSibling.innerText, 10);
      editedCounter = String(currentCounter - 1);
      e.target.nextElementSibling.innerText = editedCounter;
    } else { // для кнопки "плюс": Сделать активной кнопку "минус" при клике на кнопку "плюс"
      elem.parentElement.firstElementChild.disabled = false;
      if (this.clearApplyBtns) { // Показать кнопку [Очистить]
        this.btnClear
          .classList.remove(`${this.elemName}__button_hidden`);
      }
      // Увеличить счетчик на единицу
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
      .contains(`${this.elemName}__list-wrapper_hidden`)
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
    for (let i = 0; i < this.countVals.length; i += 1) {
      this.countVals[i].innerText = this.counters[i].minCnt;
      this._updateCounterList(
        this.counters[i].text,
        this.countVals[i].innerText,
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
          typeforms: counter.typeforms,
          cnt: editedCounter,
          minCnt: counter.minCnt,
          maxCnt: counter.maxCnt,
        };
        switch (editedCounter) {
          case counter.minCnt:
            obj.isMin = true;
            break;
          case counter.maxCnt:
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
      const { cnt } = counters[i];
      const cntToChange = this.listElems[i]
        .querySelector(`.${this.elemName}__count-val`);
      cntToChange.innerText = cnt;
      /* Если обновленное значение - минимальное разрешенное значение,
      то сделать кнопку "минус" неактивной */
      if (counters[i].isMin) {
        cntToChange.previousElementSibling.disabled = true;
      }
      /* Если обновленное значение - максимальное разрешенное значение,
      то сделать кнопку "плюс" неактивной */
      if (counters[i].isMax) {
        cntToChange.nextElementSibling.disabled = true;
      }
    }
    if (this.clearApplyBtns) {
      this._hideBtnClear(this.btnsMinus);
    }
  }

  // Скрыть кнопку [очистить]
  _hideBtnClear(btnsMinus) {
    const arr = [];
    btnsMinus.forEach((btn) => arr.push(btn.disabled));
    // есть ли среди кнопок "Минус" активные (disabled==false)
    let isCleared = arr.find((item) => item
      === false);
    // если активные кнопки не обнаружены - isCleared=true
    if (isCleared === undefined) {
      isCleared = true;
      // скрыть кнопку [Очистить]
      this.btnClear.classList.add(`${this.elemName}__button_hidden`);
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
        const { typeforms } = changedCounters[i];
        const { cnt } = changedCounters[i];
        const elem = {};
        elem.type = type;
        elem.typeforms = typeforms.split(',');
        elem.cnt = cnt;
        // То добавить в массив, который в конце будет присвоен changedCountersToDisplay
        this.countersToDisplay.push(elem);
      }
      // Если  категория такого типа уже есть
      if (i > 0 && changedCounters[i].type
        === changedCounters[i - 1].type) {
        const elem = this.countersToDisplay.find((item) => item.type
          === changedCounters[i].type);
        // То в массив не добавлять, а прибавить значение к значению счетчика этой категории
        elem.cnt = String(parseInt(elem.cnt, 10)
          + parseInt(changedCounters[i].cnt, 10));
      }
    }
    this._updateInput(this.countersToDisplay);
  }

  /* обновление значения в инпуте */
  _updateInput(countersToDisplay) {
    // Определение падежа категории в зависимости от значения счетчика
    function getWordForm(val, words) {
      let value = val;
      value = Math.abs(value) % 100;
      const num = value % 10;
      if (value > 10 && value < 20) return words[2];
      if (num > 1 && num < 5) return words[1];
      if (num === 1) return words[0];
      return words[2];
    }
    let value = '';
    countersToDisplay.forEach((counter) => {
      // исключаем категории, у которых счетчик = 0
      if (parseInt(counter.cnt, 10) !== 0) {
        value += `${counter.cnt} ${getWordForm(
          parseInt(counter.cnt, 10),
          counter.typeforms,
        )}, `;
      }
    });
    this.input.value = value.substring(0, value.length - 2);
  }

  // Открывание/ закрывание дропдауна
  _toggle(flag) {
    const wrap = `${this.elemName}__`;
    if (flag) {
      this.listWrapper.classList
        .toggle(`${wrap}list-wrapper_hidden`);
      this.tip.classList.toggle(`${wrap}image_expanded`);
      this.tip.classList.toggle(`${wrap}image_collapsed`);
      this.input.classList.toggle(`${wrap}input_expanded`);
      this.input.classList.toggle(`${wrap}input_collapsed`);
    } else {
      this.listWrapper.classList
        .add(`${wrap}list-wrapper_hidden`);
      this.tip.classList.remove(`${wrap}image_expanded`);
      this.tip.classList.add(`${wrap}image_collapsed`);
      this.input.classList.remove(`${wrap}input_expanded`);
      this.input.classList.add(`${wrap}input_collapsed`);
    }
  }

  _getElem(selector, wrapper = this.wrapper) {
    return wrapper
      .querySelector(`.js-${this.elemName}__${selector}`);
  }

  _getElems(selectors) {
    let sel = '';
    selectors.forEach((selector) => { sel += `.js-${this.elemName}__${selector},`; });
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
