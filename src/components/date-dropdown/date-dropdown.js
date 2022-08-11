import AirDatepicker from 'air-datepicker';
import 'air-datepicker/air-datepicker.css';

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
    this._handleDateDropDownInput = this._handleDateDropDownInput.bind(this);

    this._render();
    this._init();
    this._setDefaultDate();
    this._processDate();
    this._bindEventListeners();
  }

  _render() {
    const prepareDate = (date) => `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

    this.inputWrappers = this._getElements(['input-wrapper']);
    this.message = this._getElement('message');
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
        const date = selectedDate.formattedDate;
        if (!this.isFilter) {
          const dateArr = date;
          const value = (dateArr.length === 1) ? '' : dateArr[1];
          [this.inputDateFrom.value] = dateArr;
          this.inputDateTo.value = value;
        } else {
          this.inputDate.value = this.inputDate.value.toLowerCase();
        }
      },
    });

    this.calendar = this.wrapper
      .querySelector('.air-datepicker.-inline-');
  }

  _setDefaultDate() {
    if (this.isFilter) {
      const dateFrom = this.defaultDates[0];
      const dateTo = this.defaultDates[1];
      this.myDatepicker.selectDate(new Date(dateFrom));
      this.myDatepicker.selectDate(new Date(dateTo));
    }
  }

  _processDate() {
    this.dateCurrent = new Date();

    this.dateTomorrow = new Date(+this.dateCurrent
      + (new Date('2020-12-31') - new Date('2020-12-30')));

    this.datePlusYear = new Date(+this.dateCurrent
      + (new Date('2020-12-31') - new Date('2020-01-01')));

    const regexpDate = /^\d{2}\.\d{2}\.\d{4}$/;

    this.dateCurrentTxt = `${this.dateCurrent.getDate()
    }.${this.dateCurrent.getMonth() + 1
    }.${this.dateCurrent.getFullYear()}`;

    this.dateTomorrowTxt = `${this.dateTomorrow.getDate()
    }.${this.dateTomorrow.getMonth() + 1
    }.${this.dateTomorrow.getFullYear()}`;

    this.datePlusYearTxt = `${this.datePlusYear.getDate()
    }.${this.datePlusYear.getMonth() + 1
    }.${this.datePlusYear.getFullYear()}`;

    const formatDate = (dateValue) => {
      let date = dateValue;
      if (regexpDate.test(date) === false) {
        const dateSplit = date.split('.');
        const newDateSplit = dateSplit.map((element) => {
          const result = element.length === 1 ? `0${element}` : element;
          return result;
        });

        date = newDateSplit.join('.');
      }
      return date;
    };

    this.dateCurrentTxt = formatDate(this.dateCurrentTxt);
    this.dateTomorrowTxt = formatDate(this.dateTomorrowTxt);
    this.datePlusYearTxt = formatDate(this.datePlusYearTxt);
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
    if (e.target.value.length === 23) {
      const dateFromString = e.target.value.match(/^\d{2}\.\d{2}\.\d{4}/)[0].split('.');
      const dateToString = e.target.value.match(/\d{2}\.\d{2}\.\d{4}$/)[0].split('.');
      this.myDatepicker.clear();
      this.myDatepicker.selectDate(
        new Date(`${dateToString[2]}-${dateToString[1]}-${dateToString[0]}`),
      );
      this.myDatepicker.selectDate(
        new Date(`${dateFromString[2]}-${dateFromString[1]}-${dateFromString[0]}`),
      );
    }
  }

  _handleDateDropDownInputNoFilter(e) {
    const currentInput = e.target;
    const secondInput = currentInput.classList
      .contains(`.${this.elementName}__input_from`)
      ? this.inputDateTo : this.inputDateFrom;

    if (e.target.value[0] !== '0') {
      const dateFrom = currentInput.value;
      const dateTo = secondInput.value;
      this.myDatepicker.clear();
      if (secondInput.value) {
        this.myDatepicker.selectDate(
          new Date(dateTo),
        );
        this.myDatepicker.selectDate(
          new Date(dateFrom),
        );
      } else {
        this.myDatepicker.selectDate(
          new Date(dateFrom),
        );
      }
    }
  }

  _handleDateDropDownClickDate() {
    if (this.calendarWrapper.classList
      .contains(`${this.elementName}__calendar-wrapper_hidden`)) {
      this._toggle(true);
      this._toggleMessage();
    }
  }

  _handleDateDropDownClickDateFromTo() {
    if (this.calendarWrapper.classList
      .contains(`${this.elementName}__calendar-wrapper_hidden`)) {
      this._toggle(true);
      this._toggleMessage();
    }
  }

  _handleDateDropDownClickApply() {
    if (this.myDatepicker.selectedDates.length === 1) {
      this._toggleMessage(true, 'Введите дату выезда');
    } else {
      this._toggleMessage();
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

  _handleDateDropDownInput(e) {
    if (this.calendarDouble) {
      DateDropDown.processTextInput(e);
    }
    if (this.calendarSingle && e.target.value[0] !== '0') {
      this._checkRangeSingle(e);
    }

    if (this.calendarDouble && e.target.value.length === 23) {
      this._checkRangeDouble(e);
    }
  }

  _toggle(isExpanded) {
    const wrap = `${this.elementName}__`;
    if (isExpanded) {
      this.calendarWrapper.classList
        .remove(`${wrap}calendar-wrapper_hidden`);
      this.inputWrappers.forEach((input) => {
        input.classList.add(`${wrap}input-wrapper_expanded`);
      });
      return true;
    }
    this.calendarWrapper.classList
      .add(`${wrap}calendar-wrapper_hidden`);
    this.inputWrappers.forEach((input) => {
      input.classList.remove(`${wrap}input-wrapper_expanded`);
    });
    return true;
  }

  _checkRangeSingle(e) {
    const dateSelected = new Date(e.target.value);
    const needCorrectFormat = dateSelected < this.dateCurrent
      || dateSelected > this.datePlusYear
      || DateDropDown.isFormatIncorrect(dateSelected);
    if (needCorrectFormat) {
      this._toggleMessage(true, `Введите дату от ${this.dateCurrentTxt} до ${this.datePlusYearTxt}`);
      e.target.value = this.dateCurrentTxt;
    } else this._toggleMessage();
  }

  _checkRangeDouble(e) {
    const dateFrom = e.target.value.match(/^\d{2}\.\d{2}\.\d{4}/)[0].split('.');
    const dateTo = e.target.value.match(/\d{2}\.\d{2}\.\d{4}$/)[0].split('.');
    const dateCurrentSelected = new Date(`${dateFrom[2]}-${dateFrom[1]}-${dateFrom[0]}`);
    const datePlusYearSelected = new Date(`${dateTo[2]}-${dateTo[1]}-${dateTo[0]}`);
    const needCorrectFormat = dateCurrentSelected < this.dateCurrent
      || dateCurrentSelected > this.datePlusYear
      || DateDropDown.isFormatIncorrect(dateCurrentSelected)
      || datePlusYearSelected < this.dateCurrent
      || datePlusYearSelected > this.datePlusYear
      || DateDropDown.isFormatIncorrect(datePlusYearSelected);
    if (needCorrectFormat) {
      this._toggleMessage(true, `Введите даты в диапазоне от ${this.dateCurrentTxt} до ${this.datePlusYearTxt}`);
      e.target.value = `${this.dateCurrentTxt} - ${this.dateTomorrowTxt}`;
    } else this._toggleMessage();
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
    const needCorrectFormat = (
      regexpDateDouble.test(e.target.value) === false
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

  _getElement(selector, wrapper = this.wrapper) {
    return wrapper
      .querySelector(`.js-${this.elementName}__${selector}`);
  }

  _getElements(selectors) {
    let string = '';
    selectors.forEach((item) => { string += `.js-${this.elementName}__${item},`; });
    string = string.substring(0, string.length - 1);
    return this.wrapper
      .querySelectorAll(string);
  }

  _toggleMessage(isError = false, message = '') {
    if (isError) {
      this.message.classList.add(`${this.elementName}__message_active`);
      this.message.innerText = message;
      return;
    }
    this.message.classList.remove(`${this.elementName}__message_active`);
  }
}

export default DateDropDown;
