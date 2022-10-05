import AirDatepicker from 'air-datepicker';
import 'air-datepicker/air-datepicker.css';
import ErrorMessage from '../error-message/ErrorMessage';

class DateDropDown {
  constructor(elementName, element) {
    this.elementName = elementName.replace(/^.js-/, '');
    this.wrapper = element;
    this.calendarSingle = !!this.wrapper.classList.contains(`js-${this.elementName}_type_dateDropDown`);
    this.calendarDouble = !!this.wrapper.classList.contains(`js-${this.elementName}_type_filterDateDropDown`);
    this.focusOnList = false;

    this._handleDateDropDownClickClear = this._handleDateDropDownClickClear.bind(this);
    this._handleDateDropDownClickWrapper = this._handleDateDropDownClickWrapper.bind(this);
    this._handleDateDropDownClickApply = this._handleDateDropDownClickApply.bind(this);
    this._handleDateDropDownClickDateFromTo = this._handleDateDropDownClickDateFromTo.bind(this);
    this._handleDateDropDownClickDate = this._handleDateDropDownClickDate.bind(this);
    this._handleDateDropDownClickDocument = this._handleDateDropDownClickDocument.bind(this);
    this._handleDateDropDownClickCalendar = this._handleDateDropDownClickCalendar.bind(this);
    this._handleDateDropDownInputFilter = this._handleDateDropDownInputFilter.bind(this);
    this._handleDateDropDownInputNoFilter = this._handleDateDropDownInputNoFilter.bind(this);
    this._handleDateDropDownBlurDate = this._handleDateDropDownBlurDate.bind(this);
    this._handleDateDropDownFocusDate = this._handleDateDropDownFocusDate.bind(this);
    this._handleDateDropDownResizeLoadWindow = this._handleDateDropDownResizeLoadWindow.bind(this);
    this._handleDateDropDownFocusinWrapper = this._handleDateDropDownFocusinWrapper.bind(this);
    this._handleDateDropDownFocusinDocument = this._handleDateDropDownFocusinDocument.bind(this);

    this._render();
    this._init();
    this._setDefaultDate();
    this._prepareDates();
    this._bindEventListeners();
  }

  subscribeDateSelect(handler) {
    this.dateSelectHandler = handler;
  }

  setDate(from, to) {
    this._processRange(from, to, this.isFilter);
    if (this.isFilter) {
      this.inputDate.value = `${from} - ${to}`;
    } else {
      this.inputDateFrom.value = from;
      this.inputDateTo.value = to;
    }
  }

  static processTextInput(e) {
    let isInputAllowed = false;
    const allowedInputTypes = ['insertText',
      'insertFromDrop',
      'insertFromPaste',
      'deleteByCut',
      'deleteContentBackward'];

    isInputAllowed = allowedInputTypes.some((element) => e.inputType === element);

    if (!isInputAllowed) {
      e.target.value = '';
    }

    DateDropDown.checkFormat(e);

    if (e.inputType === 'insertText') {
      DateDropDown.addZero(e);
      DateDropDown.addDot(e);
      DateDropDown.addDash(e);
      DateDropDown.truncAfter24(e);
    }
  }

  static checkFormat(e) {
    const regexpDateDouble = /^\d{2}\.\d{2}\.\d{4} - \d{2}\.\d{2}\.\d{4}$/;
    const needCorrectFormat = (regexpDateDouble.test(e.target.value) === false
      && (e.inputType === 'insertFromDrop' || e.inputType === 'insertFromPaste'));
    if (needCorrectFormat) {
      e.target.value = '';
    }
  }

  static addZero(e) {
    const plusZero = () => {
      const position = e.target.value[e.target.value.length - 1];
      e.target.value = `${e.target.value.slice(
        0,
        e.target.value.length - 1,
      )}0${position}`;
    };
    e.target.value = e.target.value.replace(/[^0-9. -]/g, '');
    const needCorrectFormat = (parseInt(e.target.value[0], 10) >= 4
      && e.target.value.length === 1)
      || (parseInt(e.target.value[3], 10) >= 2
        && e.target.value.length === 4)
      || (parseInt(e.target.value[13], 10) >= 4
        && e.target.value.length === 14)
      || (parseInt(e.target.value[16], 10) >= 2
        && e.target.value.length === 17);
    if (needCorrectFormat) {
      plusZero();
    }
  }

  static addDot(e) {
    const needCorrectFormat = e.target.value.length === 2
      || e.target.value.length === 5
      || e.target.value.length === 15
      || e.target.value.length === 18;
    if (needCorrectFormat) {
      e.target.value = `${e.target.value}.`;
    }
  }

  static addDash(e) {
    if (e.target.value.length === 10) {
      e.target.value = `${e.target.value} - `;
    }
  }

  static truncAfter24(e) {
    if (e.target.value.length > 24) {
      e.target.value = e.target.value.slice(
        0,
        e.target.value.length - 1,
      );
    }
  }

  static isFormatIncorrect(date) {
    return Number.isNaN(+date);
  }

  static formatDate(dateValue) {
    const regexpDate = /^\d{2}-\d{2}-\d{4}$/;

    let date = dateValue;
    if (regexpDate.test(date) === false) {
      const dateSplit = date.split('-');
      const newDateSplit = dateSplit.map((element) => {
        const result = element.length === 1 ? `0${element}` : element;
        return result;
      });

      date = newDateSplit.join('-');
    }
    return date;
  }

  _render() {
    const prepareDate = (date) => `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

    this.inputWrappers = this._getElements(['input-wrapper']);

    [this.inputWrapperFrom, this.inputWrapperTo] = this.inputWrappers;
    this.isFilter = this.inputWrappers.length === 1;

    if (!this.isFilter) {
      this.inputDateFrom = this._getElement('input_from');
      this.inputDateTo = this._getElement('input_to');
      this.inputType = this.inputDateFrom.getAttribute('type');
    } else {
      this.inputDate = this._getElement('input_from-to');
      this.defaultDates = [];
      const dateFrom = new Date();
      this.defaultDates.push(prepareDate(dateFrom));
      const dateTo = new Date(dateFrom.setDate(dateFrom.getDate() + 4));
      this.defaultDates.push(prepareDate(dateTo));
    }
    this.tips = this._getElements(['image']);
    this.calendarWrapper = this._getElement('calendar-wrapper');
    this.buttonClear = this._getElement('button-clear');
    this.buttonApply = this._getElement('button-apply');

    this.errorMessageWrapper = this.wrapper.querySelector(`.js-${this.elementName}__error-message`);
    const targetElement = this.isFilter ? this.inputDate : this.inputDateFrom;
    this.errorMessage = new ErrorMessage(this.errorMessageWrapper, targetElement);
  }

  _init() {
    const separator = this.isFilter ? ' - ' : ',';
    this.myDatepicker = new AirDatepicker(this.calendarWrapper, {
      dateFormat: 'yyyy-MM-dd',
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
        const dates = selectedDate.formattedDate;
        if (dates.length === 0) return;
        if (this.isFilter) {
          this.inputDate.value = this.inputDate.value.toLowerCase();
        } else {
          const value = (dates.length === 1) ? '' : dates[1];
          [this.inputDateFrom.value] = dates;
          this.inputDateTo.value = value;
        }
        if (this.dateSelectHandler) {
          this.dateSelectHandler(dates);
        }
      },
    });

    this.calendar = this.wrapper.querySelector('.air-datepicker.-inline-');
  }

  _setDefaultDate() {
    if (this.isFilter) {
      const dateFrom = this.defaultDates[0];
      const dateTo = this.defaultDates[1];
      this.myDatepicker.selectDate(new Date(dateFrom));
      this.myDatepicker.selectDate(new Date(dateTo));
    }
  }

  _prepareDates() {
    this.dateCurrent = new Date();
    this.dateTomorrow = new Date(+this.dateCurrent
      + (new Date('2020-12-31') - new Date('2020-12-30')));

    this.datePlusYear = new Date(+this.dateCurrent
      + (new Date('2020-12-31') - new Date('2020-01-01')));

    const currentTxt = `${this.dateCurrent.getFullYear()}-${this.dateCurrent.getMonth() + 1}-${this.dateCurrent.getDate()}`;
    const tomorrowTxt = `${this.dateTomorrow.getFullYear()}-${this.dateTomorrow.getMonth() + 1}-${this.dateTomorrow.getDate()}`;
    const plusYearTxt = `${this.datePlusYear.getFullYear()}-${this.datePlusYear.getMonth() + 1}-${this.datePlusYear.getDate()}`;

    this.dateCurrentTxt = DateDropDown.formatDate(currentTxt);
    this.dateTomorrowTxt = DateDropDown.formatDate(tomorrowTxt);
    this.datePlusYearTxt = DateDropDown.formatDate(plusYearTxt);
  }

  _bindEventListeners() {
    if (this.isFilter) {
      this.inputDate.addEventListener('focus', this._handleDateDropDownFocusDate);
      this.inputDate.addEventListener('blur', this._handleDateDropDownBlurDate);
    }
    if (this.isFilter) {
      this.wrapper.addEventListener('input', this._handleDateDropDownInputFilter);
    }
    if (!this.isFilter) {
      this.wrapper.addEventListener('input', this._handleDateDropDownInputNoFilter);
    }

    if (!this.isFilter) {
      this.inputWrapperFrom.addEventListener('click', this._handleDateDropDownClickDateFromTo);
      this.inputDateFrom.addEventListener('click', this._handleDateDropDownClickDateFromTo);
      this.inputWrapperTo.addEventListener('click', this._handleDateDropDownClickDateFromTo);
      this.inputDateTo.addEventListener('click', this._handleDateDropDownClickDateFromTo);
    } else {
      this.inputWrapperFrom.addEventListener('click', this._handleDateDropDownClickDate);
      this.inputDate.addEventListener('click', this._handleDateDropDownClickDate);
    }

    this.wrapper.addEventListener('input', this._handleDateDropDownClickWrapper);
    this.buttonApply.addEventListener('click', this._handleDateDropDownClickApply);
    this.buttonClear.addEventListener('click', this._handleDateDropDownClickClear);
    this.calendar.addEventListener('click', this._handleDateDropDownClickCalendar);
    this.wrapper.addEventListener('focusin', this._handleDateDropDownFocusinWrapper);
    document.addEventListener('click', this._handleDateDropDownClickDocument);
    document.addEventListener('focusin', this._handleDateDropDownFocusinDocument);
    window.addEventListener('resize', this._handleDateDropDownResizeLoadWindow);
    window.addEventListener('load', this._handleDateDropDownResizeLoadWindow);
    this.inputWrappers.forEach((input) => input.addEventListener('input', this._handleDateDropDownInput));
  }

  _handleDateDropDownFocusDate(e) {
    this.initDate = this.inputDate.value;
    const startDate = this.myDatepicker.selectedDates[0];
    const endDate = this.myDatepicker.selectedDates[1];

    if (startDate || endDate) {
      const dateString = String(startDate.getDate());
      const startDay = dateString.length === 1 ? `0${dateString}` : dateString;
      const monthString = String(startDate.getMonth() + 1);
      let startMonth = monthString.length === 1 ? `0${monthString}` : monthString;
      startMonth = startMonth === '12' ? '01' : startMonth;
      const endDateString = String(endDate.getDate());
      const endDay = endDateString.length === 1 ? `0${endDateString}` : endDateString;
      const endMonthString = String(endDate.getMonth() + 1);
      let endMonth = endMonthString.length === 1 ? `0${endMonthString}` : endMonthString;
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

  _handleDateDropDownInputFilter(e) {
    const changeFormat = (string) => string.split('.').reverse().join('-');

    if (this.calendarDouble) {
      DateDropDown.processTextInput(e);
    }
    if (e.target.value.length === 23) {
      const dateFromRaw = e.target.value.match(/^\d{2}\.\d{2}\.\d{4}/);
      const dateToRaw = e.target.value.match(/\d{2}\.\d{2}\.\d{4}$/);

      const dateFrom = dateFromRaw ? changeFormat(dateFromRaw[0]) : '';
      const dateTo = dateToRaw ? changeFormat(dateToRaw[0]) : '';

      this._processRange(dateFrom, dateTo, true);
    }
  }

  _handleDateDropDownInputNoFilter(e) {
    const currentInput = e.target;
    const secondInput = currentInput.classList.contains(`${this.elementName}__input_from`)
      ? this.inputDateTo : this.inputDateFrom;

    if (e.target.value[0] !== '0') {
      const dateFrom = currentInput.classList.contains(`${this.elementName}__input_from`)
        ? currentInput.value : secondInput.value;

      const dateTo = currentInput.classList.contains(`${this.elementName}__input_to`)
        ? currentInput.value : secondInput.value;

      this._processRange(dateFrom, dateTo);
    }
  }

  _processRange(dateFrom, dateTo, isFilter = false) {
    this.myDatepicker.clear();
    const checkResult = this._checkRange(dateFrom, dateTo);

    if (checkResult) {
      this.myDatepicker.selectDate(
        new Date(dateTo),
      );
      this.myDatepicker.selectDate(
        new Date(dateFrom),
      );
      return true;
    }

    if (checkResult !== null) {
      if (isFilter) {
        this.inputDate.value = '';
      } else {
        this.inputDateFrom.value = '';
        this.inputDateTo.value = '';
      }

      const changeFormat = (string) => string.split('-').reverse().join('.');

      return this._showErrorMessageWrapper(`Введите даты в диапазоне от ${changeFormat(this.dateCurrentTxt)} до ${changeFormat(this.datePlusYearTxt)}`);
    }
    return false;
  }

  _checkRange(from, to) {
    const dateFrom = Date.parse(from);
    const dateTo = Date.parse(to);

    const isFromExist = !Number.isNaN(dateFrom);
    const isToExist = !Number.isNaN(dateTo);

    let isFromValid = false;
    if (isFromExist) {
      /* 86400000 - кол-во милисекунд в сутках.
      Прибавляем это число, т.к. поверяем,
      что this.dateCurrent больше конца дня dateFrom, а не начала */
      isFromValid = dateFrom + 86400000 >= this.dateCurrent && dateFrom <= this.datePlusYear;
    }

    let isToValid = false;
    if (isToExist) {
      isToValid = dateTo >= this.dateCurrent && dateTo <= this.datePlusYear;
    }

    if (!isFromExist || !isToExist) {
      return null;
    }

    if (!isFromValid || !isToValid) {
      return false;
    }

    if (dateTo <= dateFrom) {
      return false;
    }

    return true;
  }

  _handleDateDropDownClickDate() {
    if (this.calendarWrapper.classList
      .contains(`${this.elementName}__calendar-wrapper_hidden`)) {
      this._toggle(true);
      this._hideErrorMessageWrapper();
    }
  }

  _handleDateDropDownClickDateFromTo() {
    if (this.calendarWrapper.classList.contains(`${this.elementName}__calendar-wrapper_hidden`)) {
      this._toggle(true);
      this._hideErrorMessageWrapper();
    }
  }

  _handleDateDropDownClickApply() {
    if (this.myDatepicker.selectedDates.length === 1) {
      this._showErrorMessageWrapper('Введите дату выезда');
    } else {
      this._hideErrorMessageWrapper();
      this.calendarWrapper.classList
        .add(`${this.elementName}__calendar-wrapper_hidden`);
      this._toggle(false);
    }
  }

  _handleDateDropDownClickWrapper(e) {
    if (e.target.value === '') {
      switch (e.target) {
        case this.inputDateFrom: {
          this.inputDateTo.value = '';
          this.myDatepicker.clear();
          break;
        }
        case this.inputDateTo: {
          const date = this.myDatepicker.selectedDates[1];
          this.myDatepicker.unselectDate(date);
          break;
        }
        default: return false;
      }
    }
    return true;
  }

  _handleDateDropDownClickClear() {
    this.clickOnCalendar = true;
    this.myDatepicker.clear();
    if (!this.isFilter) {
      this.inputDateFrom.value = '';
      this.inputDateTo.value = '';
      if (this.dateSelectHandler) {
        this.dateSelectHandler(['2000-01-01', '2000-01-01']);
      }
    }
  }

  _handleDateDropDownResizeLoadWindow() {
    this._toggle(false);
  }

  _handleDateDropDownClickCalendar() {
    this.clickOnCalendar = true;
  }

  _handleDateDropDownClickDocument(e) {
    const isFilter = this.isFilter && e.target !== this.inputDate
      && e.target !== this.inputWrapperFrom;

    const isNotFilter = !this.isFilter
      && (e.target !== this.inputDateFrom && e.target !== this.inputDateTo
        && e.target !== this.inputWrapperFrom && e.target !== this.inputWrapperTo);

    const isNotDataDropDown = e.target.closest(`.${this.elementName}`) == null;

    const condFull = (isFilter || isNotFilter || isNotDataDropDown)
      && this.clickOnCalendar === false;

    if (condFull) {
      this._toggle(false);
    } else {
      this.clickOnCalendar = false;
    }
  }

  _handleDateDropDownFocusinWrapper() {
    this.focusOnList = true;
  }

  _handleDateDropDownFocusinDocument() {
    if (this.focusOnList === false) {
      this._toggle(false);
    } else {
      this.focusOnList = false;
    }
  }

  _toggle(isExpanded) {
    const wrap = `${this.elementName}__`;
    if (isExpanded) {
      this.calendarWrapper.classList.remove(`${wrap}calendar-wrapper_hidden`);
      this.inputWrappers.forEach((input) => {
        input.classList.add(`${wrap}input-wrapper_expanded`);
      });
      return true;
    }
    this.calendarWrapper.classList.add(`${wrap}calendar-wrapper_hidden`);
    this.inputWrappers.forEach((input) => {
      input.classList.remove(`${wrap}input-wrapper_expanded`);
    });
    return true;
  }

  _getElement(selector, wrapper = this.wrapper) {
    return wrapper.querySelector(`.js-${this.elementName}__${selector}`);
  }

  _getElements(selectors) {
    let string = '';
    selectors.forEach((item) => {
      string += `.js-${this.elementName}__${item},`;
    });
    string = string.substring(0, string.length - 1);
    return this.wrapper.querySelectorAll(string);
  }

  _showErrorMessageWrapper(message) {
    this.errorMessageWrapper.classList.add(`${this.elementName}__error-message_active`);
    this.errorMessage.toggleErrorMessage(true, message);
  }

  _hideErrorMessageWrapper() {
    this.errorMessageWrapper.classList.remove(`${this.elementName}__error-message_active`);
    this.errorMessage.toggleErrorMessage();
  }
}

export default DateDropDown;
