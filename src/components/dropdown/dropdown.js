import './dropdown.scss';

class DropDown {
  constructor(elemName, elem) {
    this.elemName = elemName.replace(/^.js-/, '');
    this.wrapper = elem;
    this.handleChangeCounter = this.handleChangeCounter.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleInsideClick = this.handleInsideClick.bind(this);
    this.handleCollapseByClick = this.handleCollapseByClick.bind(this);
    this.handleListFocus = this.handleListFocus.bind(this);
    this.handleCollapseByFocus = this.handleCollapseByFocus.bind(this);
    this.handleApply = this.handleApply.bind(this);
    this.handleClear = this.handleClear.bind(this);
    this.handleResizeLoad = this.handleResizeLoad.bind(this);

    this.render();
    this.clickInput();
    this.focusInput();
    this.changeCounter();
    this.clear();
    this.apply();
    this.collapseByClick();
    this.insideListClick();
    this.collapseByFocus();
    this.insideListFocus();
    this.resizeLoad();
  }

  getElem(selector, wrapper = this.wrapper) {
    return wrapper
      .querySelector(`.js-${this.elemName}__${selector}`);
  }

  getElems(selectors) {
    let sel = '';
    selectors.forEach((selector) => { sel += `.js-${this.elemName}__${selector},`; });
    sel = sel.substring(0, sel.length - 1);
    return this.wrapper
      .querySelectorAll(sel);
  }

  render() {
    this.clickOnList = false;
    this.focusOnList = false;
    this.mouseDown = false;

    this.input = this.getElem('input');
    this.listWrapper = this.getElem('list-wrapper');
    this.counts = this.getElems(['count-decrem', 'count-increm']);
    this.countVals = this.getElems(['count-val']);
    this.listElems = this.getElems(['cat-wrapper']);
    this.btnClear = this.getElem('button-clear');
    this.btnApply = this.getElem('button-apply');
    this.btnsMinus = this.getElems(['count-decrem']);
    this.tip = this.getElem('img');

    // this.clearApplyBtns = !!(this.btnClear != null && this.btnApply != null);
    this.clearApplyBtns = this.btnClear != null && this.btnApply != null;
    this.getInitialCounterList(this.listElems);
  }

  /* Получение начального состояния счетчиков (текущее значение;
    является ли оно минимальным или максимальным; название и тип категории) */
  getInitialCounterList(counterList) {
    this.counters = [];
    for (let i = 0; i < counterList.length; i += 1) {
      const elemObj = {};
      const catName = this.getElem('cat', counterList[i]);
      const catCnt = this.getElem('count-val', counterList[i]);
      const catIncrem = this.getElem('count-increm', counterList[i]);
      const catDecrem = this.getElem('count-decrem', counterList[i]);

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

    this.initializeButtons(this.counters);
    if (this.clearApplyBtns) {
      this.hideBtnClear(this.btnsMinus);
    }
  }

  /* определяем неактивные кнопки (если начальное значение счетчика -
    минимальное или максимальное) */
  initializeButtons(counterList) {
    for (let i = 0; i < counterList.length; i += 1) {
      const elem = this.listElems[i];
      if (counterList[i].isMin) {
        const minus = this.getElem('count-decrem', elem);
        minus.disabled = true;
      }
      if (counterList[i].isMax) {
        const plus = this.getElem('count-increm', elem);
        plus.disabled = true;
      }
    }
  }

  handleChangeCounter(e) {
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
    this.updateCounterList(text, editedCounter);
  }

  handleMouseDown() {
    this.mouseDown = true;
  }

  handleMouseUp() {
    this.toggle(true);
    this.mouseDown = false;
  }

  handleFocus() {
    if (this.listWrapper.classList
      .contains(`${this.elemName}__list-wrapper_hidden`)
      && this.mouseDown === false) {
      this.toggle(true);
    }
  }

  handleInsideClick() {
    this.clickOnList = true;
  }

  handleCollapseByClick() {
    if (this.clickOnList === false) {
      this.toggle(false);
    } else {
      this.clickOnList = false;
    }
  }

  handleListFocus() {
    this.focusOnList = true;
  }

  handleCollapseByFocus() {
    if (this.focusOnList === false) {
      this.toggle(false);
    } else {
      this.focusOnList = false;
    }
  }

  handleApply() {
    this.toggle(true);
  }

  handleClear() {
    for (let i = 0; i < this.countVals.length; i += 1) {
      this.countVals[i].innerText = this.counters[i].minCnt;
      this.updateCounterList(
        this.counters[i].text,
        this.countVals[i].innerText,
      );
    }
    this.input.value = '';
  }

  handleResizeLoad() {
    this.toggle(false);
  }

  // ресайз/лоад страницы
  resizeLoad() {
    window.addEventListener('resize', this.handleResizeLoad);
    window.addEventListener('load', this.handleResizeLoad);
  }

  // обработка клика по кнопкам Плюс / Минус
  changeCounter() {
    this.counts.forEach((elem) => elem.addEventListener('click', this.handleChangeCounter));
  }

  /* обновление состояния счетчиков */
  updateCounterList(text, editedCounter) {
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
    this.updateButtons(this.counters);
    this.updateCategoriesList(this.counters);
  }

  /* обновление кнопок Плюс/ Минус (делаем неактивными,
    если достигнуто минимальное/ максимальное значение) */
  updateButtons(counters) {
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
      this.hideBtnClear(this.btnsMinus);
    }
  }

  // Скрыть кнопку [очистить]
  hideBtnClear(btnsMinus) {
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
  updateCategoriesList(changedCounters) {
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
    this.updateInput(this.countersToDisplay);
  }

  /* обновление значения в инпуте */
  updateInput(countersToDisplay) {
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
  toggle(flag) {
    const wrap = `${this.elemName}__`;
    if (flag) {
      this.listWrapper.classList
        .toggle(`${wrap}list-wrapper_hidden`);
      this.tip.classList.toggle(`${wrap}img_expanded`);
      this.tip.classList.toggle(`${wrap}img_collapsed`);
      this.input.classList.toggle(`${wrap}input_expanded`);
      this.input.classList.toggle(`${wrap}input_collapsed`);
    } else {
      this.listWrapper.classList
        .add(`${wrap}list-wrapper_hidden`);
      this.tip.classList.remove(`${wrap}img_expanded`);
      this.tip.classList.add(`${wrap}img_collapsed`);
      this.input.classList.remove(`${wrap}input_expanded`);
      this.input.classList.add(`${wrap}input_collapsed`);
    }
  }

  // клик по инпуту
  clickInput() {
    this.input.addEventListener('mousedown', this.handleMouseDown);
    this.input.addEventListener('mouseup', this.handleMouseUp);
  }

  // фокус на инпут
  focusInput() {
    this.input.addEventListener('focus', this.handleFocus);
  }

  // проверка, клик был снаружи или внутри виджета
  insideListClick() {
    this.wrapper.addEventListener('click', this.handleInsideClick);
  }

  // отлавливаем все клики по документу, если клик снаружи виджета - сворачиваем виджет
  collapseByClick() {
    document.addEventListener('click', this.handleCollapseByClick);
  }

  // проверка, фокус был снаружи или внутри виджета
  insideListFocus() {
    this.wrapper.addEventListener('focusin', this.handleListFocus);
  }

  // отлавливаем все фокусы по документу, если фокус снаружи виджета - сворачиваем виджет
  collapseByFocus() {
    document.addEventListener('focusin', this.handleCollapseByFocus);
  }

  // клик по кнопке [Применить]
  apply() {
    if (this.clearApplyBtns) {
      this.btnApply.addEventListener('click', this.handleApply);
    }
  }

  // клик по кнопке [очистить]
  clear() {
    if (this.clearApplyBtns) {
      this.btnClear.addEventListener('click', this.handleClear);
    }
  }
}

function renderDropDowns(selector) {
  const dropDowns = document.querySelectorAll(selector);
  dropDowns.forEach((dropDown) => new DropDown(selector, dropDown));
}
renderDropDowns('.js-dropdown');
