/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable no-alert */
/* eslint-disable indent */
class InputMask {
  constructor(elementName, element) {
    this.elementName = elementName.replace(/^.js-/, '');
    this.wrapper = element;
    this.input = this._getElement('input');
    this.date = !!this.wrapper.classList.contains(`js-${this.elementName}_validation_date`);
    this.email = !!this.wrapper.classList.contains(`js-${this.elementName}_validation_email`);
    this._handleInputFieldDate = this._handleInputFieldDate.bind(this);
    // this._handleInputFieldEmail = this._handleInputFieldEmail.bind(this);
    this._checkFormat = this._checkFormat.bind(this);
    this._addZero = this._addZero.bind(this);
    this._checkBirthDate = this._checkBirthDate.bind(this);
    this._init();
    this._bindEventListeners();
  }

  /* проверить корректность строки с датой */
  static formatIncorrect(date) {
    return Number.isNaN(+date);
  }

  /* ставим точку после 2-го, 5-го символа (после дня и месяца) */
  static addDot(e) {
    const correctFormat3 = e.target.value.length === 2
      || e.target.value.length === 5;
    if (correctFormat3) {
      e.target.value = `${e.target.value}.`;
    }
  }

  _init() {
    // dateCurrent =  текущая дате
    this.dateCurrent = new Date();
    // dateMinusHundred  - текущая дата минус 100 лет
    this.dateMinusHundred = new Date(+this.dateCurrent
      - (new Date('2120-12-31') - new Date('2020-01-01')));
    // dateMinusEighteen  - текущая дата минус 18 лет
    this.dateMinusEighteen = new Date(+this.dateCurrent
      - (new Date('2037-12-31') - new Date('2020-01-01')));
    this.regexpDate = /^\d{2}\.\d{2}\.\d{4}$/; // формат даты
    this.regexInput = /[^0-9.]/g; // формат ввода в инпут - все, кроме цифр и точек(будет заменяться на пустую строку)

    this.dateMinusHundredTxt = `${this.dateMinusHundred.getDate()
      }.${this.dateMinusHundred.getMonth() + 1
      }.${this.dateMinusHundred.getFullYear()}`;

    this.dateMinusEighteenTxt = `${this.dateMinusEighteen.getDate()
      }.${this.dateMinusEighteen.getMonth() + 1
      }.${this.dateMinusEighteen.getFullYear()}`;

    // вставляет нули, если число или месяц - однозначное
    const formatDate = (dateValue) => {
      let date = dateValue;
      if (this.regexpDate.test(date) === false) {
        const dateSplit = date.split('.');

        for (let i = 0; i < dateSplit.length; i += 1) {
          if (dateSplit[i].length === 1) {
            dateSplit[i] = `0${dateSplit[i]}`;
          }
        }
        date = dateSplit.join('.');
      }
      return date;
    };
    this.dateMinusHundredTxt = formatDate(this.dateMinusHundredTxt);
    this.dateMinusEighteenTxt = formatDate(this.dateMinusEighteenTxt);
  }

  _bindEventListeners() {
    /* запретить все типы ввода, кроме перечисленных */
    if (this.date) {
      this.input.addEventListener('input', this._handleInputFieldDate);
    }
    // if (this.email) {
    //   this.input.addEventListener('input', this._handleInputFieldEmail);
    // }
  }

  _handleInputFieldDate(e) {
    let inpTypeAllowed = false;
    const allowedInpTypes = ['insertText',
      'insertFromDrop',
      'insertFromPaste',
      'deleteByCut',
      'deleteContentBackward'];
    for (let i = 0; i <= allowedInpTypes.length; i += 1) {
      if (e.inputType === allowedInpTypes[i]) {
        inpTypeAllowed = true;
        break;
      }
    }
    if (!inpTypeAllowed) {
      e.target.value = '';
    }

    /* при вводе перетаскиванием текста или из буфера обмена -
    проверить на соответствие формату ДД.ММ.ГГГГ и если
    не соответствует - очистить инпут */
    this._checkFormat(e);

    /* действия при вводе с клавиатуры */
    if (e.inputType === 'insertText') {
      this._addZero(e);

      /* ставим точку после 2-го, 5-го символа (после дня и месяца) */
      InputMask.addDot(e);

      /* удаляем все символы после 10-го символа */
      InputMask.truncAfter10(e);

      /* удаляем все символы после 24-го символа */
      //  this._truncAfter24(e);
    }

    if (this.date) {
      this._checkBirthDate(e);
    }
  }

  /* при вводе перетаскиванием текста или из буфера обмена -
 проверить на соответствие формату ДД.ММ.ГГГГ и если
 не соответствует - очистить инпут */
  _checkFormat(e) {
    const correctFormat1 = this.regexpDate.test(e.target.value) === false
      && (e.inputType === 'insertFromDrop' || e.inputType === 'insertFromPaste');
    if (correctFormat1) {
      e.target.value = '';
    }
  }

  /* действия при вводе с клавиатуры */
  _addZero(e) {
    const plusZero = () => {
      const position = e.target.value[e.target.value.length - 1];
      e.target.value = `${e.target.value.slice(
        0,
        e.target.value.length - 1,
      )}0${position}`;
    };

    e.target.value = e.target.value.replace(this.regexInput, ''); // все символы, попадающие под паттерн, заменяются на пустую строку

    /* если ввод дня начинается с числа, больше 3 - то добавить перед ним ноль */
    /* если ввод месяца начинается с числа, больше 1 - то добавить перед ним ноль */
    const correctFormat = (
      parseInt(e.target.value[0], 10) >= 4
      && e.target.value.length === 1)
      || (parseInt(e.target.value[3], 10) >= 2
        && e.target.value.length === 4);
    if (correctFormat) {
      plusZero();
    }
  }

  /* удаляем все символы после 10-го символа */
  static truncAfter10(e) {
    if (e.target.value.length > 10) {
      e.target.value = e.target.value.slice(
        0,
        e.target.value.length - 1,
      );
    }
  }

  _checkBirthDate(e) {
    if (e.target.value.length === 10) {
      /* Проверка, что введенная дата попадает в диапазон dateMinusHundred и
    dateMinusEighteen */
      const a = e.target.value.split('.');
      const dateSelected = new Date(`${a[2]}-${a[1]}-${a[0]}`);
      const correctFormat = dateSelected < this.dateMinusHundred
        || dateSelected > this.dateMinusEighteen
        || InputMask.formatIncorrect(dateSelected);
      if (correctFormat) {
        alert(`Введите дату от ${this.dateMinusHundredTxt
          } до ${this.dateMinusEighteenTxt}`);
        e.target.value = '';// в случае некорректного ввода - очищаем инпут
      }
    }
  }

  _getElement(selector, wrapper = this.wrapper) {
    return wrapper
      .querySelector(`.js-${this.elementName}__${selector}`);
  }
}

function renderInputsMask(selector) {
  const inputsMask = document.querySelectorAll(selector);
  inputsMask.forEach((inputMask) => new InputMask(selector, inputMask));
}
renderInputsMask('.js-input-field');
