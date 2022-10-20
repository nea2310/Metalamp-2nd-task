import AirDatepicker from 'air-datepicker';
import 'air-datepicker/air-datepicker.css';
import ErrorMessage from '../error-message/ErrorMessage';
import InputDate from '../input-date/InputDate';

class DateDropDown {
  constructor(elementName, element) {
    this.elementName = elementName.replace(/^.js-/, '');
    this.wrapper = element;
    this.focusOnList = false;

    this._bindEventListeners();
    this._render();
    this._init();
    this._prepareDates();
    this._setDefaultDate();
    this._addEventListeners();
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

  static isFormatIncorrect(date) {
    return Number.isNaN(+date);
  }

  static _changeDotToDash(string) {
    return string.split('.').reverse().join('-');
  }

  static _changeDashToDot(string) {
    return string.split('-').reverse().join('.');
  }

  _render() {
    this.inputWrappers = this._getElements(['input-wrapper']);
    [this.inputWrapperFrom, this.inputWrapperTo] = this.inputWrappers;
    this.isFilter = this.inputWrappers.length === 1;

    if (!this.isFilter) {
      const wrapperFrom = this._getElement('input-wrapper_type_from');
      const wrapperTo = this._getElement('input-wrapper_type_to');

      this.inputDateFrom = wrapperFrom.querySelector('.js-input-date__input');
      this.inputDateTo = wrapperTo.querySelector('.js-input-date__input');

      const inputElementFrom = wrapperFrom.querySelector('.js-input-date');
      this.inputFrom = new InputDate('.js-input-date', inputElementFrom, !this.isFilter, true);
      this.inputFrom.subscribeDateInput(this._handleDateInputFrom);

      const inputElementTo = wrapperTo.querySelector('.js-input-date');
      this.inputTo = new InputDate('.js-input-date', inputElementTo, !this.isFilter, true);
      this.inputTo.subscribeDateInput(this._handleDateInputTo);
    } else {
      this.inputDate = this.wrapper.querySelector('.js-input-date__input');
      const inputElement = this.wrapper.querySelector('.js-input-date');
      this.input = new InputDate('.js-input-date', inputElement, !this.isFilter, true);
      this.input.subscribeDateInput(this._handleDateInputFromTo);
    }
    this.tips = this._getElements(['image']);
    this.calendarWrapper = this._getElement('calendar-wrapper');

    this.isVisible = !this.calendarWrapper.classList.contains(`${this.elementName}__calendar-wrapper_hidden`);
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
          this.inputDateFrom.value = DateDropDown._changeDashToDot(dates[0]);
          this.inputDateTo.value = DateDropDown._changeDashToDot(value);
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
      this.myDatepicker.selectDate(new Date(this.dateCurrent));
      this.myDatepicker.selectDate(new Date(this.datePlusFourDays));
    }
  }

  _prepareDates() {
    this.dateCurrent = new Date();
    this.dateTomorrow = new Date(new Date().setDate(new Date().getDate() + 1));
    this.datePlusFourDays = new Date(new Date().setDate(new Date().getDate() + 4));
    this.datePlusYear = new Date(new Date().setFullYear(new Date().getFullYear() + 1));

    const formatDate = (date) => {
      const day = String(date.getDate());
      const month = String(date.getMonth() + 1);
      const dd = day.length === 1 ? `0${day}` : day;
      const mm = month.length === 1 ? `0${month}` : month;
      const yyyy = String(date.getFullYear());
      return `${yyyy}-${mm}-${dd}`;
    };

    this.dateCurrentTxt = formatDate(this.dateCurrent);
    this.dateTomorrowTxt = formatDate(this.dateTomorrow);
    this.datePlusYearTxt = formatDate(this.datePlusYear);
  }

  _bindEventListeners() {
    this._handleDateInputFromTo = this._handleDateInputFromTo.bind(this);
    this._handleDateInputFrom = this._handleDateInputFrom.bind(this);
    this._handleDateInputTo = this._handleDateInputTo.bind(this);

    this._handleDateDropDownClickClear = this._handleDateDropDownClickClear.bind(this);
    this._handleDateDropDownClickWrapper = this._handleDateDropDownClickWrapper.bind(this);
    this._handleDateDropDownClickApply = this._handleDateDropDownClickApply.bind(this);
    this._handleDateDropDownClickDateFromTo = this._handleDateDropDownClickDateFromTo.bind(this);
    this._handleDateDropDownClickDate = this._handleDateDropDownClickDate.bind(this);
    this._handleDateDropDownClickDocument = this._handleDateDropDownClickDocument.bind(this);
    this._handleDateDropDownClickCalendar = this._handleDateDropDownClickCalendar.bind(this);
    this._handleDateDropDownBlurDate = this._handleDateDropDownBlurDate.bind(this);
    this._handleDateDropDownFocusDate = this._handleDateDropDownFocusDate.bind(this);
    this._handleDateDropDownResizeLoadWindow = this._handleDateDropDownResizeLoadWindow.bind(this);
    this._handleDateDropDownFocusinWrapper = this._handleDateDropDownFocusinWrapper.bind(this);
    this._handleDateDropDownFocusinDocument = this._handleDateDropDownFocusinDocument.bind(this);
  }

  _addEventListeners() {
    if (this.isFilter) {
      this.inputDate.addEventListener('focus', this._handleDateDropDownFocusDate);
      this.inputDate.addEventListener('blur', this._handleDateDropDownBlurDate);
      this.inputWrapperFrom.addEventListener('click', this._handleDateDropDownClickDate);
      this.inputDate.addEventListener('click', this._handleDateDropDownClickDate);
    } else {
      this.inputWrapperFrom.addEventListener('click', this._handleDateDropDownClickDateFromTo);
      this.inputDateFrom.addEventListener('click', this._handleDateDropDownClickDateFromTo);
      this.inputWrapperTo.addEventListener('click', this._handleDateDropDownClickDateFromTo);
      this.inputDateTo.addEventListener('click', this._handleDateDropDownClickDateFromTo);
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
  }

  _handleDateInputFromTo(date) {
    const dateFrom = DateDropDown._changeDotToDash(date.slice(0, 10));
    const dateTo = DateDropDown._changeDotToDash(date.slice(13, 23));
    this._processRange(dateFrom, dateTo, true);
  }

  _handleDateInputFrom(date) {
    const dateFrom = DateDropDown._changeDotToDash(date);
    const dateTo = DateDropDown._changeDotToDash(this.inputDateTo.value);
    this._processRange(dateFrom, dateTo);
  }

  _handleDateInputTo(date) {
    const dateTo = DateDropDown._changeDotToDash(date);
    const dateFrom = DateDropDown._changeDotToDash(this.inputDateFrom.value);
    this._processRange(dateFrom, dateTo);
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
      const endDateString = endDate ? String(endDate.getDate()) : '';
      const endDay = endDateString.length === 1 ? `0${endDateString}` : endDateString;
      const endMonthString = endDate ? String(endDate.getMonth() + 1) : '';
      let endMonth = endMonthString.length === 1 ? `0${endMonthString}` : endMonthString;
      endMonth = endMonth === '12' ? '01' : endMonth;
      const startDateText = `${startDay}.${startMonth}.${startDate.getFullYear()}`;
      e.target.value = endDate ? `${startDateText}
    - ${endDay}.${endMonth}.${endDate.getFullYear()}` : `${startDateText}`;
      this.initDateParsed = this.inputDate.value;
    }
  }

  _handleDateDropDownBlurDate() {
    if (this.inputDate.value === this.initDateParsed) {
      this.inputDate.value = this.initDate;
    }
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
    if (!this.isVisible) {
      this._toggle(false);
    }
  }

  _handleDateDropDownClickCalendar() {
    this.clickOnCalendar = true;
  }

  _handleDateDropDownClickDocument(e) {
    const isNotDataDropDown = e.target.closest(`.${this.elementName}`)
      == null && !e.target.classList.contains('air-datepicker-cell');

    if (isNotDataDropDown && !this.isVisible) {
      this._toggle(false);
    } else {
      this.clickOnCalendar = false;
    }
  }

  _handleDateDropDownFocusinWrapper() {
    this.focusOnList = true;
  }

  _handleDateDropDownFocusinDocument() {
    if (this.focusOnList === false && !this.isVisible) {
      this._toggle(false);
    } else {
      this.focusOnList = false;
    }
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
    if (isFromExist && !isFromValid) return false;

    let isToValid = false;
    if (isToExist) {
      isToValid = dateTo >= this.dateCurrent && dateTo <= this.datePlusYear;
    }

    if (isToExist && !isToValid) return false;
    return true;
  }

  _processRange(dateFrom, dateTo, isFilter = false) {
    this.myDatepicker.clear();
    const checkResult = this._checkRange(dateFrom, dateTo);

    if (checkResult) {
      if (dateFrom) {
        this.myDatepicker.selectDate(
          new Date(dateFrom),
        );
      }
      if (dateTo) {
        this.myDatepicker.selectDate(
          new Date(dateTo),
        );
      }

      if (!isFilter) {
        this.inputDateFrom.value = dateFrom ? DateDropDown._changeDashToDot(dateFrom) : '';
        this.inputDateTo.value = dateTo ? DateDropDown._changeDashToDot(dateTo) : '';
      }
      return true;
    }

    if (isFilter) {
      this.inputDate.value = '';
    } else {
      this.inputDateFrom.value = '';
      this.inputDateTo.value = '';
    }

    return this._showErrorMessageWrapper(`Введите даты в диапазоне от ${DateDropDown._changeDashToDot(this.dateCurrentTxt)} до ${DateDropDown._changeDashToDot(this.datePlusYearTxt)}`);
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
