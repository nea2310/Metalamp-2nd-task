/* eslint-disable no-alert */
import AirDatepicker from 'air-datepicker';
import 'air-datepicker/air-datepicker.css';

import './date-dropdown.scss';

class DatePicker {
  constructor(elemName, elem) {
    this.elemName = elemName.replace(/^.js-/, '');
    this.wrapper = elem;
    this.focusOnList = false;

    this._handleDateDropDownClickClear = this._handleDateDropDownClickClear.bind(this);
    this._handleDateDropDownClickWrapper = this._handleDateDropDownClickWrapper.bind(this);
    this._handleDateDropDownClickApply = this._handleDateDropDownClickApply.bind(this);
    this._handleDateDropDownClickDateFromTo = this._handleDateDropDownClickDateFromTo.bind(this);
    this._handleDateDropDownClickDate = this._handleDateDropDownClickDate.bind(this);
    this._handleDateDropDownClickDoc = this._handleDateDropDownClickDoc.bind(this);
    this._handleDateDropDownClickCalendar = this._handleDateDropDownClickCalendar.bind(this);
    this._handleDateDropDownInputWrapper = this._handleDateDropDownInputWrapper.bind(this);
    this._handleDateDropDownBlurDate = this._handleDateDropDownBlurDate.bind(this);
    this._handleDateDropDownFocusDate = this._handleDateDropDownFocusDate.bind(this);
    this._handleDateDropDownResizeLoadWindow = this._handleDateDropDownResizeLoadWindow.bind(this);
    this._handleDateDropDownFocusinWrapper = this._handleDateDropDownFocusinWrapper.bind(this);
    this._handleDateDropDownFocusinDoc = this._handleDateDropDownFocusinDoc.bind(this);

    this._render();
    this._init();
    this._setDefaultDate();
    this._bindEventListeners();
  }

  _render() {
    const a = this._getElems(['input-wrapper']);
    this.isFilter = a.length === 1;

    if (!this.isFilter) {
      this.inputDateFrom = this._getElem('input_from');
      this.inputDateTo = this._getElem('input_to');
    } else {
      this.inputDate = this._getElem('input_fromto');
      this.defaultDates = this.inputDate.value.split(',');
    }
    this.tips = this._getElems(['image']);
    this.clWrapper = this._getElem('calendar-wrapper');
    this.btnClear = this._getElem('button-clear');
    this.btnApply = this._getElem('button-apply');
  }

  /* Выбор даты в календаре */
  _init() {
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
      prevHtml: '<image src="">',
      nextHtml: '<image src="">',
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
  }

  /* Установка даты из поля value в верстке */
  _setDefaultDate() {
    if (this.isFilter) {
      const dateFrom = this.defaultDates[0];
      const dateTo = this.defaultDates[1];
      this.myDatepicker.selectDate(new Date(dateFrom));
      this.myDatepicker.selectDate(new Date(dateTo));
    }
  }

  _bindEventListeners() {
    /* Ввод даты в инпут с клавиатуры */
    if (this.isFilter) {
      // При фокусе на инпут преобразовать дату в формат ДД.ММ.ГГГГ - ДД.ММ.ГГГГ
      this.inputDate.addEventListener('focus', this._handleDateDropDownFocusDate);
      this.inputDate.addEventListener('blur', this._handleDateDropDownBlurDate);
    }

    // обработчик события окончания ввода в инпут по маске ДД.ММ.ГГГГ
    this.wrapper.addEventListener('input', this._handleDateDropDownInputWrapper);

    // Показ  календаря при клике по инпуту
    if (!this.isFilter) {
      this.inputDateFrom.addEventListener('click', this._handleDateDropDownClickDateFromTo);
      this.inputDateTo.addEventListener('click', this._handleDateDropDownClickDateFromTo);
    } else {
      this.inputDate.addEventListener('click', this._handleDateDropDownClickDate);
    }

    // Удаление даты из инпута
    this.wrapper.addEventListener('input', this._handleDateDropDownClickWrapper);

    // клик по кнопке [Применить]
    this.btnApply.addEventListener('click', this._handleDateDropDownClickApply);

    // клик по кнопке [Очистить]
    this.btnClear.addEventListener('click', this._handleDateDropDownClickClear);

    // проверка, клик был снаружи или внутри календаря
    this.calendar.addEventListener('click', this._handleDateDropDownClickCalendar);

    // проверка, фокус был снаружи или внутри календаря
    this.wrapper.addEventListener('focusin', this._handleDateDropDownFocusinWrapper);

    // отлавливаем все клики по документу, если клик снаружи виджета - сворачиваем виджет
    document.addEventListener('click', this._handleDateDropDownClickDoc);

    // отлавливаем все фокусы по документу, если фокус снаружи виджета - сворачиваем виджет
    document.addEventListener('focusin', this._handleDateDropDownFocusinDoc);

    // ресайз/лоад страницы
    window.addEventListener('resize', this._handleDateDropDownResizeLoadWindow);
    window.addEventListener('load', this._handleDateDropDownResizeLoadWindow);
  }

  _handleDateDropDownFocusDate(e) {
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

  _handleDateDropDownBlurDate() {
    if (this.inputDate.value === this.initDateParsed) {
      this.inputDate.value = this.initDate;
    }
  }

  _handleDateDropDownInputWrapper(e) {
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

  _handleDateDropDownClickDate() {
    if (this.clWrapper.classList
      .contains(`${this.elemName}__calendar-wrapper_hidden`)) {
      this._toggle(true);
    }
  }

  _handleDateDropDownClickDateFromTo() {
    if (this.clWrapper.classList
      .contains(`${this.elemName}__calendar-wrapper_hidden`)) { this._toggle(true); }
  }

  _handleDateDropDownClickApply() {
    if (this.myDatepicker.selectedDates.length === 1) {
      alert('Введите дату выезда');
    } else {
      this.clWrapper.classList
        .add(`${this.elemName}__calendar-wrapper_hidden`);
      if (!this.isFilter) {
        this._toggle(false);
      } else {
        this._toggle(false);
      }
    }
  }

  _handleDateDropDownClickWrapper(e) {
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

  _handleDateDropDownClickClear() {
    this.clickOnCalendar = true;
    this.myDatepicker.clear();
    if (!this.isFilter) {
      this.inputDateFrom.value = '';
      this.inputDateTo.value = '';
    }
  }

  _handleDateDropDownResizeLoadWindow() {
    this._toggle(false);
  }

  _handleDateDropDownClickCalendar() {
    this.clickOnCalendar = true;
  }

  _handleDateDropDownClickDoc(e) {
    const condA = (this.isFilter && e.target !== this.inputDate) || !this.isFilter;
    const condB = e.target !== this.inputDateFrom && e.target !== this.inputDateTo;
    const condC = e.target.closest(`.${this.elemName}`) == null;
    const condFull = ((condA && condB) || condC) && this.clickOnCalendar === false;

    if (condFull) {
      this._toggle(false);
    } else {
      this.clickOnCalendar = false;
    }
  }

  _handleDateDropDownFocusinWrapper() {
    this.focusOnList = true;
  }

  _handleDateDropDownFocusinDoc() {
    if (this.focusOnList === false) {
      this._toggle(false);
    } else {
      this.focusOnList = false;
    }
  }

  // Открывание/ закрывание календаря
  _toggle(flag) {
    const wrap = `${this.elemName}__`;
    if (flag) {
      this.clWrapper.classList
        .remove(`${wrap}calendar-wrapper_hidden`);
      this.tips.forEach((tip) => {
        tip.classList.add(`${wrap}image_expanded`);
        tip.classList.remove(`${wrap}image_collapsed`);
      });
    } else {
      this.clWrapper.classList
        .add(`${wrap}calendar-wrapper_hidden`);
      this.tips.forEach((tip) => {
        tip.classList.remove(`${wrap}image_expanded`);
        tip.classList.add(`${wrap}image_collapsed`);
      });
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

function renderDateDropDowns(selector) {
  const dropDowns = document.querySelectorAll(selector);
  dropDowns.forEach((dateDropDown) => new DatePicker(selector, dateDropDown));
}
renderDateDropDowns('.js-date-dropdown');
