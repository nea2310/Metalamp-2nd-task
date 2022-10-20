import ErrorMessage from '../error-message/ErrorMessage';

class InputDate {
  constructor(elementName, element, isSingle = true, isCustomValidation = false) {
    this.elementName = elementName.replace(/^.js-/, '');
    this.wrapper = element;
    this.isCustomValidation = isCustomValidation;
    this.isSingle = isSingle;
    this.inputLengthLimit = isSingle ? 10 : 23;

    this._init();
    this._bindEventListeners();
    this._addEventListeners();
  }

  subscribeDateInput(handler) {
    this.dateInputHandler = handler;
  }

  _checkDayFormat(dd) {
    const day = dd.replace(/[^0-9.]/g, '');
    const { length } = day;
    if (length === 1 && Number(day) > 3) {
      return `0${day}.`;
    }
    if (length === 1) {
      return day;
    }
    if (length === 2 && Number(day) > 31) {
      return `${this._checkMonthFormat(day[1], `0${day[0]}`)}`;
    }
    if (day === '00') {
      return '0';
    }
    if (length === 2) {
      return `${day}.`;
    }
    return this._checkMonthFormat(`${day.slice(3)}`, `${day.slice(0, 2)}`);
  }

  _checkMonthFormat(mm, dd) {
    const { length } = mm;

    if (mm === '2' && dd === '30') {
      return `${dd}.`;
    }
    if (['2', '4', '6', '9'].includes(mm) && dd === '31') {
      return `${dd}.`;
    }
    if (length === 1 && Number(mm) > 1) {
      return `${dd}.0${mm}.`;
    }
    if (length === 1) {
      return `${dd}.${mm}`;
    }
    if ((mm === '02' && dd === '30')) {
      return `${dd}.0`;
    }
    if (['02', '04', '06', '09', '11'].includes(mm) && dd === '31') {
      return `${dd}.${mm.slice(0, 1)}`;
    }
    if (length === 2 && Number(mm) > 12) {
      return `${dd}.${mm[0]}`;
    }
    if (mm === '00') {
      return `${dd}.${mm[0]}`;
    }
    if (mm.length === 2) {
      return `${dd}.${mm}.`;
    }

    return this._checkYearFormat(`${mm.slice(3)}`, dd, `${mm.slice(0, 2)}`);
  }

  _checkYearFormat(yyyy, dd, mm) {
    const { length } = yyyy;
    const isCorrectMillenary = length === 1 && (Number(yyyy) < 1 || Number(yyyy) > 2);
    if (isCorrectMillenary) {
      return `${dd}.${mm}.`;
    }
    if (length === 1) {
      return `${dd}.${mm}.${yyyy}`;
    }
    const isCorrectCentury = length === 2 && (
      Number(yyyy) < 19 || Number(yyyy) > 20);
    if (isCorrectCentury) {
      return `${dd}.${mm}.${yyyy[0]}`;
    }
    if ([2, 3].includes(length)) {
      return `${dd}.${mm}.${yyyy}`;
    }
    const isNotLeapYear = length === 4 && dd === '29' && mm === '02'
      && new Date(yyyy, Number(mm) - 1, dd).getDate() === 1;
    if (isNotLeapYear) {
      return `${dd}.${mm}.${yyyy.slice(0, 3)}`;
    }
    if (length === 4) {
      return this.isSingle ? `${dd}.${mm}.${yyyy}` : `${dd}.${mm}.${yyyy} - `;
    }
    return '';
  }

  _init() {
    this.input = this.wrapper.querySelector(`.js-${this.elementName}__input`);

    this.errorMessageWrapper = this.wrapper.querySelector(`.js-${this.elementName}__error-message`);
    if (this.errorMessageWrapper) {
      this.errorMessage = new ErrorMessage(this.errorMessageWrapper, this.input);
    }

    const getNewDate = (date = 0) => {
      const newDate = new Date(new Date().setFullYear(new Date().getFullYear() + date));
      return newDate;
    };

    this.dateMinusHundred = getNewDate(-100);
    this.dateMinusEighteen = getNewDate(-18);

    const formatDate = (date) => {
      const day = String(date.getDate());
      const month = String(date.getMonth() + 1);
      const dd = day.length === 1 ? `0${day}` : day;
      const mm = month.length === 1 ? `0${month}` : month;
      const yyyy = String(date.getFullYear());
      return `${dd}.${mm}.${yyyy}`;
    };

    this.dateMinusHundredTxt = formatDate(this.dateMinusHundred);
    this.dateMinusEighteenTxt = formatDate(this.dateMinusEighteen);
  }

  _bindEventListeners() {
    this._handleInputFieldInput = this._handleInputFieldInput.bind(this);
    this._checkBirthDate = this._checkBirthDate.bind(this);
  }

  _addEventListeners() {
    this.input.addEventListener('input', this._handleInputFieldInput);
  }

  _handleInputFieldInput(e) {
    if (e.inputType !== 'insertText') {
      e.target.value = '';
      return;
    }
    const { value } = e.target;
    if (value.length <= 10) {
      e.target.value = this._checkDayFormat(value);
    }
    if (value.length > 10 && this.isSingle) {
      e.target.value = value.slice(0, 10);
    }
    if (value.length > 10 && !this.isSingle) {
      e.target.value = `${value.slice(0, 10)} - ${this._checkDayFormat(e.target.value.slice(10))}`;
    }
    if (value.length === this.inputLengthLimit) {
      if (!this.isCustomValidation) {
        e.target.value = this._checkBirthDate(e.target.value);
      }
      if (this.dateInputHandler) {
        this.dateInputHandler(e.target.value);
      }
    }
  }

  _checkBirthDate(value) {
    const a = value.split('.');
    const dateSelected = new Date(`${a[2]}-${a[1]}-${a[0]}`);
    const needCorrectFormat = dateSelected < this.dateMinusHundred
      || dateSelected > this.dateMinusEighteen
      || Number.isNaN(+dateSelected);
    if (needCorrectFormat) {
      this._showErrorMessageWrapper();
      this.errorMessage.toggleErrorMessage(true, `Введите дату от ${this.dateMinusHundredTxt} до ${this.dateMinusEighteenTxt}`);
      return '';
    }
    this._hideErrorMessageWrapper();
    this.errorMessage.toggleErrorMessage();
    return value;
  }

  _showErrorMessageWrapper() {
    this.errorMessageWrapper.classList.add(`${this.elementName}__error-message_active`);
  }

  _hideErrorMessageWrapper() {
    this.errorMessageWrapper.classList.remove(`${this.elementName}__error-message_active`);
  }
}

export default InputDate;
