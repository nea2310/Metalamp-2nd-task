import AirDatepicker from 'air-datepicker';
import 'air-datepicker/air-datepicker.css';
import getDatePlusShift from '../../shared/utils/getDatePlusShift';
import getDateString from '../../shared/utils/getDateString';
import getElement from '../../shared/utils/getElement';
import getElements from '../../shared/utils/getElements';
import ErrorMessage from '../error-message/ErrorMessage';
import InputDate from '../input-date/InputDate';

const DAY = 86400000;

class DateDropDown {
  constructor(element, elementName = 'date-dropdown') {
    this.elementName = elementName;
    this.wrapper = element;
    this.focusOnList = false;

    this._bindEventListeners();
    this._render();
  }

  static _changeDotToDash(string) {
    return string.split('.').reverse().join('-');
  }

  static _changeDashToDot(string) {
    return string.split('-').reverse().join('.');
  }

  focusInput(event) {
    if (this.isFilter) {
      this.inputInstance.focusInput();
    }

    if (!this.isFilter && event) {
      if (this._isInputWrapperFrom(event.target)) {
        this.inputFromInstance.focusInput();
      }
      if (this._isInputWrapperTo(event.target)) {
        this.inputToInstance.focusInput();
      }
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

  _render() {
    this.inputWrappers = getElements(['input-wrapper'], this.wrapper, this.elementName);
    this.isPlain = this.inputWrappers.length === 0;
    this.isFilter = this.inputWrappers.length === 1;

    const initInputInstance = (wrapper, onInputHandler) => {
      const inputElement = wrapper.querySelector('.js-input-date');
      const inputInstance = new InputDate(inputElement, !this.isFilter, true);
      inputInstance.subscribeDateInput(onInputHandler);
      inputInstance.subscribeDateBlur(onInputHandler);
      return inputInstance;
    };
    if (!this.isPlain) {
      if (!this.isFilter) {
        this.inputFromInstance = initInputInstance(
          this.inputWrappers[0],
          this._handleDateInputFrom,
        );
        this.inputToInstance = initInputInstance(
          this.inputWrappers[1],
          this._handleDateInputTo,
        );
      } else {
        this.inputInstance = initInputInstance(this.inputWrappers[0], this._handleDateInputFromTo);
        this.inputAlt = getElement('input-alt', this.wrapper, this.elementName);
      }
      this.tips = getElements(['image'], this.wrapper, this.elementName);
    }

    this.calendarWrapper = getElement('calendar-wrapper', this.wrapper, this.elementName);

    this.isVisible = !this.calendarWrapper.classList.contains(`${this.elementName}__calendar-wrapper_hidden`);
    this.buttonClear = getElement('button-clear', this.wrapper, this.elementName);
    this.buttonApply = getElement('button-apply', this.wrapper, this.elementName);

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
    this._handleDateDropDownMouseoverDate = this._handleDateDropDownMouseoverDate.bind(this);
    this._handleDateDropDownMouseoutDate = this._handleDateDropDownMouseoutDate.bind(this);
    this._handleDateDropDownClickClear = this._handleDateDropDownClickClear.bind(this);
    this._handleDateDropDownClickApply = this._handleDateDropDownClickApply.bind(this);
    this._handleDateDropDownClickDate = this._handleDateDropDownClickDate.bind(this);
    this._handleDateDropDownClickDocument = this._handleDateDropDownClickDocument.bind(this);
    this._handleDateDropDownResizeLoadWindow = this._handleDateDropDownResizeLoadWindow.bind(this);
    this._handleDateDropDownFocusinWrapper = this._handleDateDropDownFocusinWrapper.bind(this);
    this._handleDateDropDownFocusinDocument = this._handleDateDropDownFocusinDocument.bind(this);
  }

  _addEventListeners() {
    this.inputWrappers.forEach((element) => element.addEventListener('click', this._handleDateDropDownClickDate));
    this.inputWrappers.forEach((element) => element.addEventListener('mouseover', this._handleDateDropDownMouseoverDate));
    this.inputWrappers.forEach((element) => element.addEventListener('mouseout', this._handleDateDropDownMouseoutDate));
    this.buttonApply.addEventListener('click', this._handleDateDropDownClickApply);
    this.buttonClear.addEventListener('click', this._handleDateDropDownClickClear);
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
        if (dates.length === 0 || this.isPlain) return;
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
      this.myDatepicker.selectDate(new Date(this.dateFromMin));
      this.myDatepicker.selectDate(new Date(this.dateToDefault));
    }
  }

  _prepareDates() {
    this.dateFromMin = new Date();
    this.dateToDefault = getDatePlusShift(4);
    this.dateToMax = getDatePlusShift(1, 'year');

    this.dateFromMinTxt = getDateString(this.dateFromMin, false);
    this.dateToMaxTxt = getDateString(this.dateToMax, false);
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

  _handleDateDropDownClickDate(event) {
    if (this.calendarWrapper.classList
      .contains(`${this.elementName}__calendar-wrapper_hidden`)) {
      this._toggle(true);
    } else if (event.target === event.currentTarget) {
      this._toggle(false);
    }
  }

  _handleDateDropDownMouseoverDate(event) {
    if (this.isFilter) {
      this.inputInstance.highlightInput();
    }
    if (this._isInputWrapperFrom(event.target)) {
      this.inputFromInstance.highlightInput();
    }
    if (this._isInputWrapperTo(event.target)) {
      this.inputToInstance.highlightInput();
    }
  }

  _handleDateDropDownMouseoutDate(event) {
    if (this.isFilter) {
      this.inputInstance.highlightInput(false);
    }
    if (this._isInputWrapperFrom(event.target)) {
      this.inputFromInstance.highlightInput(false);
    }
    if (this._isInputWrapperTo(event.target)) {
      this.inputToInstance.highlightInput(false);
    }
  }

  _handleDateDropDownClickApply() {
    if (!this.inputWrappers.length) return;
    if (this.myDatepicker.selectedDates.length === 1) {
      this._showErrorMessageWrapper('Введите дату выезда');
    } else {
      this._hideErrorMessageWrapper();
      this.calendarWrapper.classList
        .add(`${this.elementName}__calendar-wrapper_hidden`);
      this._toggle(false);
    }
  }

  _handleDateDropDownClickClear() {
    this.myDatepicker.clear();
    if (!this.inputWrappers.length) return;
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

  _handleDateDropDownClickDocument(e) {
    const isNotDataDropDown = (e.target.closest(`.${this.elementName}`)
      == null && !e.target.classList.contains('air-datepicker-cell'))
      || (
        e.target.classList.contains(`${this.elementName}__input-wrapper`)
        && !Array.from(this.inputWrappers).includes(e.target)
      );
    if (isNotDataDropDown && !this.isVisible) {
      this._toggle(false);
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
      /* DAY - кол-во миллисекунд в сутках.
      Прибавляем это число, т.к. проверяем,
      что this.dateFromMin больше конца дня dateFrom, а не начала */
      isFromValid = dateFrom + DAY >= this.dateFromMin && dateFrom <= this.dateToMax;
    }
    if (isFromExist && !isFromValid) return false;

    let isToValid = false;
    if (isToExist) {
      isToValid = dateTo >= this.dateFromMin && dateTo <= this.dateToMax;
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

    return this._showErrorMessageWrapper(`Введите даты в диапазоне от ${DateDropDown._changeDashToDot(this.dateFromMinTxt)} до ${DateDropDown._changeDashToDot(this.dateToMaxTxt)}`);
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

  _showErrorMessageWrapper(message) {
    this.errorMessageWrapper.classList.add(`${this.elementName}__error-message_active`);
    this.errorMessage.toggleErrorMessage(true, message);
  }

  _hideErrorMessageWrapper() {
    this.errorMessageWrapper.classList.remove(`${this.elementName}__error-message_active`);
    this.errorMessage.toggleErrorMessage();
  }

  _isInputWrapperFrom(element) {
    return element.classList.contains(`js-${this.elementName}__input-wrapper_type_from`);
  }

  _isInputWrapperTo(element) {
    return element.classList.contains(`js-${this.elementName}__input-wrapper_type_to`);
  }
}

export default DateDropDown;
