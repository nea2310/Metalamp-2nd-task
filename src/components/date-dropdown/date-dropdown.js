import './date-dropdown.scss';
import AirDatepicker from 'air-datepicker';
import 'air-datepicker/air-datepicker.css';

const imgPrev = require(
  './img/arrow-back.svg',
);
const imgNext = require(
  './img/arrow-forward.svg',
);

class DatePicker {
  constructor(elemName, elem) {
    this.elemName = elemName.replace(/^.js-/, '');
    this.wrapper = elem;

    this.handleClear = this.handleClear.bind(this);
    this.handleDateClear = this.handleDateClear.bind(this);
    this.handleApply = this.handleApply.bind(this);
    this.handleShowFilter = this.handleShowFilter.bind(this);
    this.handleShowNoFilter = this.handleShowNoFilter.bind(this);
    this.handleCollapseByClick = this.handleCollapseByClick.bind(this);
    this.handleCheckClick = this.handleCheckClick.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.handleDateBlur = this.handleDateBlur.bind(this);
    this.handleFocus = this.handleFocus.bind(this);

    this.render();
    this.init();
    this.setDefaultDate();
    this.datePrint();
    this.dateClear();
    this.show();
    this.apply();
    this.clear();
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
    const a = this.getElems(['input-wrapper']);
    this.isFilter = a.length === 1;

    if (!this.isFilter) {
      this.inputDateFrom = this.getElem('input_from');
      this.inputDateTo = this.getElem('input_to');
    } else {
      this.inputDate = this.getElem('input_fromto');
      this.defaultDates = this.inputDate.value.split(',');
    }
    this.tips = this.getElems(['img']);
    this.clWrapper = this.getElem('calendar-wrapper');
    this.btnClear = this.getElem('button-clear');
    this.btnApply = this.getElem('button-apply');
  }

  /* Выбор даты в календаре */
  init() {
    const separator = this.isFilter ? ' - ' : ',';
    this.myDatepicker = new AirDatepicker(this.clWrapper, {
      disableNavWhenOutOfRange: false,
      altField: this.inputDate,
      altFieldDateFormat: 'dd MMM',
      multipleDatesSeparator: separator,
      navTitles: {
        days: 'MMMM <i>yyyy</i>',
      },
      minDate: new Date(),
      range: true,
      multipleDates: true,
      prevHtml: `<img src="${imgPrev}">`,
      nextHtml: `<img src="${imgNext}">`,
      onSelect: (selectedDate) => {
        const date = selectedDate.formattedDate;
        if (date.length !== 0) {
          if (!this.isFilter) {
            const dateArr = date;
            let val;
            if (dateArr.length === 1) { // если выбрана одиночная дата
              val = '';
            } else { // если выбран диапазон дат
              [, val] = dateArr;
            }
            [this.inputDateFrom.value] = dateArr;
            this.inputDateTo.value = val;
          } else {
            this.inputDate.value = this.inputDate.value.toLowerCase();
          }
        }
      },
    });

    this.calendar = this.wrapper
      .querySelector('.air-datepicker.-inline-');
    this.collapseByClick();
    this.insideCalendarClick();
  }

  handleFocus(e) {
    this.initDate = this.inputDate.value;
    const startDate = this.myDatepicker.selectedDates[0];
    const endDate = this.myDatepicker.selectedDates[1];
    if (startDate || endDate) {
      const tempStDate = String(startDate.getDate());
      const startDay = tempStDate.length === 1 ? `0${tempStDate}`
        : tempStDate;
      const tempStMonth = String(startDate.getMonth() + 1);
      let startMonth = tempStMonth.length === 1
        ? `0${tempStMonth}` : tempStMonth;
      startMonth = startMonth === '12' ? '01' : startMonth;
      const tempEndDate = String(endDate.getDate());
      const endDay = tempEndDate.length === 1 ? `0${tempEndDate}`
        : tempEndDate;
      const tempEndMonth = String(endDate.getMonth() + 1);
      let endMonth = tempEndMonth.length === 1 ? `0${tempEndMonth}`
        : tempEndMonth;
      endMonth = endMonth === '12' ? '01' : endMonth;
      e.target.value = `${startDay}.${startMonth}.${startDate.getFullYear()} - ${endDay}.${endMonth}.${endDate.getFullYear()}`;
      this.initDateParsed = this.inputDate.value;
    }
  }

  handleDateBlur() {
    if (this.inputDate.value === this.initDateParsed) {
      this.inputDate.value = this.initDate;
    }
  }

  handleInput(e) {
    const isDate = e.target === this.inputDateFrom
      || e.target === this.inputDateTo;
    const isDateLength = isDate && e.target.value.length === 10;
    if (isDateLength) {
      this.currentInput = e.target;
      this.secondInput = this.currentInput.classList
        .contains(`.${this.elemName}__input_from`)
        ? this.inputDateTo : this.inputDateFrom;
      if (this.secondInput.value) { // заполнены оба инпута
        const a = this.currentInput.value.split('.');
        const b = this.secondInput.value.split('.');
        this.myDatepicker.clear();
        this.myDatepicker.selectDate(
          new Date(`${b[2]}-${b[1]}-${b[0]}`),
        );
        this.myDatepicker.selectDate(
          new Date(`${a[2]}-${a[1]}-${a[0]}`),
        );
      } else {
        // заполнен один инпут
        const a = this.currentInput.value.split('.');
        this.myDatepicker.clear();
        this.myDatepicker.selectDate(
          new Date(`${a[2]}-${a[1]}-${a[0]}`),
        );
      }
    } else if ((e.target === this.inputDate)
      && e.target.value.length === 23) {
      const a = e.target.value.match(/^\d{2}\.\d{2}\.\d{4}/)[0].split('.');
      const b = e.target.value.match(/\d{2}\.\d{2}\.\d{4}$/)[0].split('.');
      this.myDatepicker.clear();
      this.myDatepicker.selectDate(
        new Date(`${b[2]}-${b[1]}-${b[0]}`),
      );
      this.myDatepicker.selectDate(
        new Date(`${a[2]}-${a[1]}-${a[0]}`),
      );
    }
  }

  handleCheckClick() {
    this.clickOnCalendar = true;
  }

  handleCollapseByClick(e) {
    const condA = (this.isFilter && e.target !== this.inputDate) || !this.isFilter;
    const condB = e.target !== this.inputDateFrom && e.target !== this.inputDateTo;
    const condC = e.target.closest(`.${this.elemName}`) == null;
    const condFull = ((condA && condB) || condC) && this.clickOnCalendar === false;
    // if (
    //   (this.isFilter && e.target !== this.inputDate// условие #1
    //     || !this.isFilter && (// условие #2
    //       e.target !== this.inputDateFrom
    //       && e.target !== this.inputDateTo)
    //     || e.target.closest(`.${this.elemName}`) == null)// условие #3
    //   && this.clickOnCalendar === false// общее условие для условий #1, #2, #3
    // )

    if (condFull) {
      this.toggle(false);
    } else {
      this.clickOnCalendar = false;
    }
  }

  handleShowNoFilter() {
    if (this.clWrapper.classList
      .contains(`${this.elemName}__calendar-wrapper_hidden`)) {
      this.toggle(true);
    }
  }

  handleShowFilter() {
    if (this.clWrapper.classList
      .contains(`${this.elemName}__calendar-wrapper_hidden`)) { this.toggle(true); }
  }

  handleApply() {
    if (this.myDatepicker.selectedDates.length === 1) {
      alert('Введите дату выезда');
    } else {
      this.clWrapper.classList
        .add(`${this.elemName}__calendar-wrapper_hidden`);
      if (!this.isFilter) {
        this.toggle(false);
      } else {
        this.toggle(false);
      }
    }
  }

  handleDateClear(e) {
    if (e.target === this.inputDateFrom
      || e.target === this.inputDateTo) {
      if (e.target.value === '') { // Если инпут очищен
        if (e.target === this.inputDateFrom) { // очищен левый инпут
          this.inputDateTo.value = '';// очистить правый инпут
          this.myDatepicker.clear();// очистить календарь (снять выделение с обеих дат)
        } else { // очищен правый инпут
          const a = this.myDatepicker.selectedDates[1];
          // снять выделение с второй даты (левый инпут и первая дата остаются)
          this.myDatepicker.unselectDate(a);
        }
      }
    }
  }

  handleClear() {
    this.clickOnCalendar = true;
    this.myDatepicker.clear();
    if (!this.isFilter) {
      this.inputDateFrom.value = '';
      this.inputDateTo.value = '';
    }
  }

  /* Установка даты из поля value в верстке */
  setDefaultDate() {
    if (this.isFilter) {
      const dateFrom = this.defaultDates[0];
      const dateTo = this.defaultDates[1];
      this.myDatepicker.selectDate(new Date(dateFrom));
      this.myDatepicker.selectDate(new Date(dateTo));
    }
  }

  /* Ввод даты в инпут с клавиатуры */
  datePrint() {
    if (this.isFilter) {
      // При фокусе на инпут преобразовать дату в формат ДД.ММ.ГГГГ - ДД.ММ.ГГГГ
      this.inputDate.addEventListener('focus', this.handleFocus);
      this.inputDate.addEventListener('blur', this.handleDateBlur);
    }

    // обработчик события окончания ввода в инпут по маске ДД.ММ.ГГГГ
    this.wrapper.addEventListener('input', this.handleInput);
  }

  // проверка, клик был снаружи или внутри календаря
  insideCalendarClick() {
    this.calendar.addEventListener('click', this.handleCheckClick);
  }

  // отлавливаем все клики по документу, если клик снаружи виджета - сворачиваем виджет
  collapseByClick() {
    document.addEventListener('click', this.handleCollapseByClick);
  }

  // Показ  календаря при клике по инпуту
  show() {
    if (!this.isFilter) {
      this.inputDateFrom.addEventListener('click', this.handleShowFilter);
      this.inputDateTo.addEventListener('click', this.handleShowFilter);
    } else {
      this.inputDate.addEventListener('click', this.handleShowNoFilter);
    }
  }

  // Открывание/ закрывание календаря
  toggle(flag) {
    const wrap = `${this.elemName}__`;
    if (flag) {
      this.clWrapper.classList
        .remove(`${wrap}calendar-wrapper_hidden`);
      this.tips.forEach((tip) => {
        tip.classList.add(`${wrap}img_expanded`);
        tip.classList.remove(`${wrap}img_collapsed`);
      });
    } else {
      this.clWrapper.classList
        .add(`${wrap}calendar-wrapper_hidden`);
      this.tips.forEach((tip) => {
        tip.classList.remove(`${wrap}img_expanded`);
        tip.classList.add(`${wrap}img_collapsed`);
      });
    }
  }

  // клик по кнопке [Применить]
  apply() {
    this.btnApply.addEventListener('click', this.handleApply);
  }

  // Удаление даты из инпута
  dateClear() {
    this.wrapper.addEventListener('input', this.handleDateClear);
  }

  // клик по кнопке [Очистить]
  clear() {
    this.btnClear.addEventListener('click', this.handleClear);
  }
}

function renderDateDropDowns(selector) {
  const dropDowns = document.querySelectorAll(selector);
  dropDowns.forEach((dateDropDown) => new DatePicker(selector, dateDropDown));
}
renderDateDropDowns('.js-date-dropdown');
