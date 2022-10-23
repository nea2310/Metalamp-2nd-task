import AirDatepicker from 'air-datepicker';
import 'air-datepicker/air-datepicker.css';
import ErrorMessage from '../error-message/ErrorMessage';
import InputDate from '../input-date/InputDate';

class DateDropDown {
  constructor(element, elementName = 'date-dropdown') {
    this.elementName = elementName;
    this.wrapper = element;
    this.focusOnList = false;

    this._bindEventListeners();
    this._render();
  }

  focusInput() {
    if (this.isFilter) {
      this.inputInstance.focusInput();
    } else {
      this.inputFromInstance.focusInput();
    }
  }

  setDate(from, to) {
    this._processRange(from, to, this.isFilter);
    if (this.isFilter) {
      this.inputInstance.setValue(`${from} - ${to}`);
    } else {
      this.inputFromInstance.setValue(from);
      this.inputToInstance.setValue(to);
    }
  }

  subscribeDateSelect(handler) {
    this.dateSelectHandler = handler;
  }

  validateInputValue() {
    if (this.isFilter) return [this.inputInstance.validateInputValue()];
    const validationResults = [];
    validationResults.push(this.inputFromInstance.validateInputValue());
    validationResults.push(this.inputToInstance.validateInputValue());
    return validationResults;
  }

  static _changeDotToDash(string) {
    return string.split('.').reverse().join('-');
  }

  static _changeDashToDot(string) {
    return string.split('-').reverse().join('.');
  }

  _render() {
    this.inputWrappers = this._getElements(['input-wrapper']);
    this.isFilter = this.inputWrappers.length === 1;

    const initInputInstance = (wrapper, callback) => {
      const inputElement = wrapper.querySelector('.js-input-date');
      const inputInstance = new InputDate(inputElement, !this.isFilter, true);
      inputInstance.subscribeDateInput(callback);
      return inputInstance;
    };

    if (!this.isFilter) {
      this.inputFromInstance = initInputInstance(this.inputWrappers[0], this._handleDateInputFrom);
      this.inputToInstance = initInputInstance(this.inputWrappers[1], this._handleDateInputTo);
    } else {
      this.inputInstance = initInputInstance(this.inputWrappers[0], this._handleDateInputFromTo);
      this.inputAlt = this._getElement('input-alt');
    }

    this.tips = this._getElements(['image']);
    this.calendarWrapper = this._getElement('calendar-wrapper');

    this.isVisible = !this.calendarWrapper.classList.contains(`${this.elementName}__calendar-wrapper_hidden`);
    this.buttonClear = this._getElement('button-clear');
    this.buttonApply = this._getElement('button-apply');

    this.errorMessageWrapper = this.wrapper.querySelector(`.js-${this.elementName}__error-message`);
    this.errorMessage = new ErrorMessage(this.errorMessageWrapper, null, this.focusInput);

    this._init();
    this._prepareDates();
    this._setDefaultDate();
    this._addEventListeners();
  }

  _bindEventListeners() {
    this._handleDateInputFromTo = this._handleDateInputFromTo.bind(this);
    this._handleDateInputFrom = this._handleDateInputFrom.bind(this);
    this._handleDateInputTo = this._handleDateInputTo.bind(this);
    this.focusInput = this.focusInput.bind(this);

    this._handleDateDropDownClickClear = this._handleDateDropDownClickClear.bind(this);
    this._handleDateDropDownClickApply = this._handleDateDropDownClickApply.bind(this);
    this._handleDateDropDownClickDate = this._handleDateDropDownClickDate.bind(this);
    this._handleDateDropDownClickDocument = this._handleDateDropDownClickDocument.bind(this);
    this._handleDateDropDownClickCalendar = this._handleDateDropDownClickCalendar.bind(this);
    this._handleDateDropDownResizeLoadWindow = this._handleDateDropDownResizeLoadWindow.bind(this);
    this._handleDateDropDownFocusinWrapper = this._handleDateDropDownFocusinWrapper.bind(this);
    this._handleDateDropDownFocusinDocument = this._handleDateDropDownFocusinDocument.bind(this);
  }

  _addEventListeners() {
    this.inputWrappers.forEach((element) => element.addEventListener('click', this._handleDateDropDownClickDate));
    this.buttonApply.addEventListener('click', this._handleDateDropDownClickApply);
    this.buttonClear.addEventListener('click', this._handleDateDropDownClickClear);
    this.calendar.addEventListener('click', this._handleDateDropDownClickCalendar);
    this.wrapper.addEventListener('focusin', this._handleDateDropDownFocusinWrapper);
    document.addEventListener('click', this._handleDateDropDownClickDocument);
    document.addEventListener('focusin', this._handleDateDropDownFocusinDocument);
    window.addEventListener('resize', this._handleDateDropDownResizeLoadWindow);
    window.addEventListener('load', this._handleDateDropDownResizeLoadWindow);
  }

  _init() {
    const separator = this.isFilter ? ' - ' : ',';
    this.myDatepicker = new AirDatepicker(this.calendarWrapper, {
      dateFormat: 'dd.MM.yyyy',
      disableNavWhenOutOfRange: false,
      altField: this.inputAlt,
      altFieldDateFormat: 'dd MMM',
      multipleDatesSeparator: separator,
      navTitles: {
        days: 'MMMM <i>yyyy</i>',
      },
      minDate: new Date(),
      range: true,
      multipleDates: true,
      prevHtml: '',
      nextHtml: '',
      onSelect: (selectedDate) => {
        const dates = selectedDate.formattedDate;
        if (dates.length === 0) return;
        const dateFrom = dates[0];
        let dateTo = '';
        if (this.isFilter) {
          this.inputInstance.setValue(this.inputAlt.value.toLowerCase());
        } else {
          if (dates.length === 2) {
            [, dateTo] = dates;
          }
          this.inputFromInstance.setValue(dateFrom);
          this.inputToInstance.setValue(dateTo);
        }
        if (this.dateSelectHandler) {
          this.dateSelectHandler(
            [DateDropDown._changeDotToDash(dateFrom), DateDropDown._changeDotToDash(dateTo)],
          );
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

  _handleDateInputFromTo(date) {
    const dateFrom = DateDropDown._changeDotToDash(date.slice(0, 10));
    const dateTo = DateDropDown._changeDotToDash(date.slice(13, 23));
    this._processRange(dateFrom, dateTo, true);
  }

  _handleDateInputFrom(date) {
    const dateFrom = DateDropDown._changeDotToDash(date);
    const dateTo = DateDropDown._changeDotToDash(this.inputToInstance.getValue());
    this._processRange(dateFrom, dateTo);
  }

  _handleDateInputTo(date) {
    const dateTo = DateDropDown._changeDotToDash(date);
    const dateFrom = DateDropDown._changeDotToDash(this.inputFromInstance.getValue());
    this._processRange(dateFrom, dateTo);
  }

  _handleDateDropDownClickDate() {
    if (this.calendarWrapper.classList
      .contains(`${this.elementName}__calendar-wrapper_hidden`)) {
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

  // _handleDateDropDownClickWrapper(e) {
  //   console.log('_handleDateDropDownClickWrapper');

  //   if (e.target.value === '') {
  //     switch (e.target) {
  //       case this.inputDateFrom: {
  //         this.inputToInstance.setValue();
  //         this.myDatepicker.clear();
  //         break;
  //       }
  //       case this.inputDateTo: {
  //         const date = this.myDatepicker.selectedDates[1];
  //         this.myDatepicker.unselectDate(date);
  //         break;
  //       }
  //       default: return false;
  //     }
  //   }
  //   return true;
  // }

  _handleDateDropDownClickClear() {
    this.clickOnCalendar = true;
    this.myDatepicker.clear();
    if (!this.isFilter) {
      this.inputFromInstance.setValue();
      this.inputToInstance.setValue();
      if (this.dateSelectHandler) {
        this.dateSelectHandler();
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
      /* 86400000 - кол-во миллисекунд в сутках.
      Прибавляем это число, т.к. проверяем,
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
        const valueFrom = dateFrom ? DateDropDown._changeDashToDot(dateFrom) : '';
        this.inputFromInstance.setValue(valueFrom);
        const valueTo = dateTo ? DateDropDown._changeDashToDot(dateTo) : '';
        this.inputToInstance.setValue(valueTo);
      }
      return true;
    }

    if (isFilter) {
      this.inputInstance.setValue();
    } else {
      this.inputFromInstance.setValue();
      this.inputToInstance.setValue();
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
