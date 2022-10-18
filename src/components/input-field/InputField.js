import ErrorMessage from '../error-message/ErrorMessage';

class InputField {
  constructor(elementName, element) {
    this.elementName = elementName.replace(/^.js-/, '');
    this.wrapper = element;

    this._init();
    this._bindEventListeners();
    this._addEventListeners();
  }

  static _checkDateFormat(value) {
    if (value.length > 10) {
      return value.slice(0, 10);
    }
    // 4 -> 04. (если первая цифра в номере дня 4 и больше, добавляем лидирующий ноль и точку)
    if (value.length === 1 && Number(value[0]) > 3) {
      return `0${value}.`;
    }
    // 1 -> 1, 2 -> 2, 3 -> 3 (корректное значение первой цифры дня, оставляем как есть)
    if (value.length === 1) {
      return value;
    }
    // 32 -> 03.02. (некорректное значение дня, разбиваем лидирующими нулями и точками,
    // получаем день и месяц)
    const isDayBiggerThan32 = value.length === 2 && value[0] === '3' && Number(value[1]) > 1;
    if (isDayBiggerThan32) {
      return `0${value.slice(0, 1)}.0${value[1]}.`;
    }

    // 00 -> 0 (запрещаем "00" в качестве дня)
    if (value === '00') {
      return '0';
    }

    // 31 -> 31. (корректное значение дня, оставляем как есть и добавляем точку)
    if (value.length === 2 && Number(value[0]) < 4) {
      return `${value.slice(0, 2)}.`;
    }

    // 30.2 -> 30. (не бывает 30 февраля,
    // запрещаем ввод месяца с порядковым номером 2, если введено число  30)
    const isFebThirty = value.length === 4 && value.slice(0, 2) === '30'
      && value.slice(3, 4) === '2';
    if (isFebThirty) {
      return '30.';
    }

    // 31.2 -> 31.  31.4 -> 31. (не бывает 31 февраля, апреля, июня, сентября,
    // запрещаем ввод месяцев с соотв-щими порядковыми номерами после числа 31)
    const isDayThirtyFirst = value.length === 4 && value.slice(0, 2) === '31' && ['2', '4', '6', '9'].includes(value.slice(3, 4));
    if (isDayThirtyFirst) {
      return '31.';
    }

    // 21.2 -> 21.02 (добавляем ноль к номеру месяца, если номер - не единица)
    if (value.length === 4 && Number(value[3]) > 1) {
      return `${value.slice(0, 3)}0${value[3]}.`;
    }

    // 21.0 -> 21.0 (корректное значение, первой цифры месяца, оставляем как есть)
    if (value.length === 4) {
      return value;
    }

    // 30.02 -> 30.0 (не бывает 30 февраля, запрещаем ввод месяца с порядковым номером 2
    // если введено число 30)
    const isFeb30 = value.length === 5 && value.slice(0, 2) === '30' && value.slice(3, 5) === '02';
    if (isFeb30) {
      return '30.0';
    }

    // 31.02 -> 31.0  31.04 -> 31.0 (не бывает 31 февраля, апреля, июня, сентября, ноября,
    // запрещаем ввод месяцев с соотв-щими порядковыми номерами после числа 31)
    const isDay31 = value.length === 5 && value.slice(0, 2) === '31' && ['02', '04', '06', '09', '11'].includes(value.slice(3, 5));
    if (isDay31) {
      return `${value.slice(0, 4)}`;
    }

    // 21.13 -> 21.1 (не бывает месяца с номером 13 и больше,
    // запрещаем ввод чисел 3 и больше в качестве второй цифры месяца)
    const isMonthThirteen = value[3] === '1' && Number(value[4]) > 2;
    if (value.length === 5 && isMonthThirteen) {
      return `${value.slice(0, 4)}`;
    }

    // 21.00 -> 21.0 (запрещаем "00" в качестве месяца)
    if (value.length === 5 && value.slice(3) === '00') {
      return `${value.slice(0, 4)}`;
    }

    // 21.12 -> 21.12. (корректное значение месяца, оставляем как есть и добавляем точку)
    if (value.length === 5) {
      return `${value}.`;
    }

    // 21.12.0 -> 21.12.   21.12.3 -> 21.12.
    // (первая цифра года может быть 0 или 1, остальные запрещаем)
    const isCorrectMillenary = value.length === 7 && (Number(value[6]) < 1 || Number(value[6]) > 2);
    if (isCorrectMillenary) {
      return `${value.slice(0, 6)}`;
    }

    // 21.12.1 -> 21.12.1   21.12.2 -> 21.12.2
    // (корректная первая цифра года, оставляем как есть)
    if (value.length === 7) {
      return value;
    }

    // 21.12.18 -> 21.12.1   21.12.21 -> 21.12.2
    // (первые две цифры года могут быть 19 или 20, остальные запрещаем)
    const isCorrectCentury = value.length === 8 && (
      Number(value.slice(6, 8)) < 19 || Number(value.slice(6, 8)) > 20);
    if (isCorrectCentury) {
      return `${value.slice(0, 7)}`;
    }

    // 21.12.191 -> 21.12.191   21.12.201 -> 21.12.201
    // (корректные две / три первые цифры года, оставляем как есть)
    if (value.length === 8 || value.length === 9) {
      return value;
    }

    // 29.02.2022 -> 29.02.202 (29 февраля не бывает в невисокосном году,
    // запрещаем ввод последней цифры года)
    const isNotLeapYear = value.length === 10 && value.slice(0, 5) === '29.02'
      && new Date(value.slice(6), Number(value.slice(3, 5) - 1), value.slice(0, 2)).getDate() === 1;
    if (isNotLeapYear) {
      return `${value.slice(0, 9)}`;
    }

    // 29.03.2022 -> 29.03.2022
    // (корректные четыре цифры года, оставляем как есть)
    if (value.length === 10) {
      return value;
    }
    return '';
  }

  _init() {
    this.date = !!this.wrapper.classList.contains(`js-${this.elementName}_validation_date`);
    this.email = !!this.wrapper.classList.contains(`js-${this.elementName}_validation_email`);

    this.input = this.wrapper.querySelector(`.js-${this.elementName}__input`);

    this.errorMessageWrapper = this.wrapper.querySelector(`.js-${this.elementName}__error-message`);
    this.errorMessage = new ErrorMessage(this.errorMessageWrapper);

    if (this.date) {
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
    if (this.email) {
      this.link = this.wrapper.querySelector(`${this.elementName}__link`);
    }
  }

  _bindEventListeners() {
    if (this.date) {
      this._handleInputFieldInput = this._handleInputFieldInput.bind(this);
      this._checkBirthDate = this._checkBirthDate.bind(this);
    }
    if (this.email) {
      this._handleInputFieldChange = this._handleInputFieldChange.bind(this);
      this._handleInputFieldClick = this._handleInputFieldClick.bind(this);
    }
  }

  _addEventListeners() {
    if (this.date) {
      this.input.addEventListener('input', this._handleInputFieldInput);
    }
    if (this.email) {
      this.input.addEventListener('change', this._handleInputFieldChange);
      if (this.link) {
        this.link.addEventListener('click', this._handleInputFieldClick);
      }
    }
  }

  _handleInputFieldInput(e) {
    const { value } = e.target;
    e.target.value = value.replace(/[^0-9.]/g, '');
    if (e.inputType === 'insertText') {
      const checkResult = InputField._checkDateFormat(value);

      e.target.value = checkResult;
      if (checkResult.length === 10) {
        e.target.value = this._checkBirthDate(checkResult);
      }
    } else e.target.value = '';
  }

  _handleInputFieldChange() {
    this._checkEmail(this.input.value);
  }

  _handleInputFieldClick() {
    this._checkEmail(this.input.value);
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

  _checkEmail(value) {
    const test = /.+@.+\..+/i.test(value);
    if (value && !test) {
      this._showErrorMessageWrapper();
      this.errorMessage.toggleErrorMessage(true, `Введенный e-mail ${value} имеет некорректный формат`);
    } else {
      this._hideErrorMessageWrapper();
      this.errorMessage.toggleErrorMessage();
    }
  }

  _showErrorMessageWrapper() {
    this.errorMessageWrapper.classList.add(`${this.elementName}__error-message_active`);
  }

  _hideErrorMessageWrapper() {
    this.errorMessageWrapper.classList.remove(`${this.elementName}__error-message_active`);
  }
}

export default InputField;
