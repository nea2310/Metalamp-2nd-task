/* eslint-disable no-alert */
/* eslint-disable indent */
class InputMask {
  constructor(elemName, elem) {
    this.elemName = elemName.replace(/^./, '');
    this.input = elem;
    this.calendarSingle = !!this.input.classList.contains('js-calendar');
    this.calendarDouble = !!this.input.classList.contains('js-calendar-double');
    this.date = !!this.input.classList.contains('js-date');
    this.handleInput = this.handleInput.bind(this);
    this.checkFormat = this.checkFormat.bind(this);
    this.addZero = this.addZero.bind(this);
    this.truncAfter10 = this.truncAfter10.bind(this);
    this.truncAfter24 = this.truncAfter24.bind(this);
    this.checkRangeDouble = this.checkRangeDouble.bind(this);
    this.checkRangeSingle = this.checkRangeSingle.bind(this);
    this.checkBirthDate = this.checkBirthDate.bind(this);
    this.init();
    this.mask();
  }

  /* проверить корректность строки с датой */
  static formatIncorrect(date) {
    return Number.isNaN(+date);
  }

  /* ставим точку после 2-го, 5-го, 15-го, 18-го символа (после дня и месяца) */
  static addDot(e) {
    const correctFormat3 = e.target.value.length === 2
      || e.target.value.length === 5
      || e.target.value.length === 15
      || e.target.value.length === 18;
    if (correctFormat3) {
      e.target.value = `${e.target.value}.`;
    }
  }

  /* ставим знаки пробела и минус между датами (требуется только для calendarDouble) */
  static addDash(e) {
    if (e.target.value.length === 10) {
      e.target.value = `${e.target.value} - `;
    }
  }

  init() {
    // dateCurrent =  текущая дате
    this.dateCurrent = new Date();
    this.dateTomorrow = new Date(+this.dateCurrent
      + (new Date('2020-12-31') - new Date('2020-12-30')));
    // dateMinusHundred  - теущая дата минус 100 лет
    this.dateMinusHundred = new Date(+this.dateCurrent
      - (new Date('2120-12-31') - new Date('2020-01-01')));
    // dateMinusEighteen  - теущая дата минус 18 лет
    this.dateMinusEighteen = new Date(+this.dateCurrent
      - (new Date('2037-12-31') - new Date('2020-01-01')));
    // datePlusYear = плюс один год к текущей дате
    this.datePlusYear = new Date(+this.dateCurrent
      + (new Date('2020-12-31') - new Date('2020-01-01')));
    this.regexpDate = /^\d{2}\.\d{2}\.\d{4}$/; // формат даты
    this.regexpDateDouble = /^\d{2}\.\d{2}\.\d{4} - \d{2}\.\d{2}\.\d{4}$/; // формат даты
    this.regexInput = /[^0-9.]/g; // формат ввода в инпут - все, кроме цифр и точек(будет заменяться на пустую строку)
    this.regexInputDouble = /[^0-9. -]/g; // формат ввода в инпут - все, кроме цифр, точек, пробелов и дефисов(будет заменяться на пустую строку)

    this.dateCurrentTxt = `${this.dateCurrent.getDate()
      }.${this.dateCurrent.getMonth() + 1
      }.${this.dateCurrent.getFullYear()}`;

    this.dateTomorrowTxt = `${this.dateTomorrow.getDate()
      }.${this.dateTomorrow.getMonth() + 1
      }.${this.dateTomorrow.getFullYear()}`;

    this.dateMinusHundredTxt = `${this.dateMinusHundred.getDate()
      }.${this.dateMinusHundred.getMonth() + 1
      }.${this.dateMinusHundred.getFullYear()}`;

    this.dateMinusEighteenTxt = `${this.dateMinusEighteen.getDate()
      }.${this.dateMinusEighteen.getMonth() + 1
      }.${this.dateMinusEighteen.getFullYear()}`;

    this.datePlusYearTxt = `${this.datePlusYear.getDate()
      }.${this.datePlusYear.getMonth() + 1
      }.${this.datePlusYear.getFullYear()}`;

    // вставляет нули, если число или месяц - однозначное
    const formatDate = (dt) => {
      let date = dt;
      if (this.regexpDate.test(date) === false) {
        const a = date.split('.');

        for (let i = 0; i < a.length; i += 1) {
          if (a[i].length === 1) {
            a[i] = `0${a[i]}`;
          }
        }
        date = a.join('.');
      }
      return date;
    };
    this.dateCurrentTxt = formatDate(this.dateCurrentTxt);
    this.dateTomorrowTxt = formatDate(this.dateTomorrowTxt);
    this.dateMinusHundredTxt = formatDate(this.dateMinusHundredTxt);
    this.dateMinusEighteenTxt = formatDate(this.dateMinusEighteenTxt);
    this.datePlusYearTxt = formatDate(this.datePlusYearTxt);
  }

  /* при вводе перетаскиванием текста или из буфера обмена -
 проверить на соответствие формату ДД.ММ.ГГГГ и если
 не соответствует - очистить инпут */
  checkFormat(e) {
    const correctFormat1 = ((this.calendarSingle || this.date)
      && this.regexpDate.test(e.target.value) === false)
      || (this.calendarDouble
        && this.regexpDateDouble.test(e.target.value) === false);
    if (e.inputType === 'insertFromDrop'
      || e.inputType === 'insertFromPaste') {
      if (correctFormat1) {
        e.target.value = '';
      }
    }
  }

  /* действия при вводе с клавиатуры */
  addZero(e) {
    const plusZero = () => {
      const a = e.target.value[e.target.value.length - 1];
      e.target.value = `${e.target.value.slice(
        0,
        e.target.value.length - 1,
      )}0${a}`;
    };
    if (this.calendarSingle || this.date) {
      e.target.value = e.target.value.replace(this.regexInput, ''); // все символы, попадающие под паттерн, заменяются на пустую строку
    }

    if (this.calendarDouble) {
      e.target.value = e.target.value.replace(this.regexInputDouble, '');// все символы, попадающие под паттерн, заменяются на пустую строку
    }
    /* если ввод дня начинается с числа, больше 3 - то добавить перед ним ноль */
    /* если ввод месяца начинается с числа, больше 1 - то добавить перед ним ноль */
    const correctFormat = (parseInt(e.target.value[0], 10) >= 4
      && e.target.value.length === 1)
      || (parseInt(e.target.value[3], 10) >= 2
        && e.target.value.length === 4)
      || (parseInt(e.target.value[13], 10) >= 4
        && e.target.value.length === 14)
      || (parseInt(e.target.value[16], 10) >= 2
        && e.target.value.length === 17);
    if (correctFormat) {
      plusZero();
    }
  }

  /* удаляем все символы после 10-го символа */
  truncAfter10(e) {
    const correctFormat4 = (this.calendarSingle || this.date)
      && e.target.value.length > 10;
    if (correctFormat4) {
      e.target.value = e.target.value.slice(
        0,
        e.target.value.length - 1,
      );
    }
  }

  /* удаляем все символы после 24-го символа */
  truncAfter24(e) {
    if (this.calendarDouble && e.target.value.length > 24) {
      e.target.value = e.target.value.slice(
        0,
        e.target.value.length - 1,
      );
    }
  }

  handleInput(e) {
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
    this.checkFormat(e);

    /* действия при вводе с клавиатуры */
    if (e.inputType === 'insertText') {
      this.addZero(e);

      /* ставим точку после 2-го, 5-го, 15-го, 18-го символа (после дня и месяца) */
      InputMask.addDot(e);

      /* ставим знаки пробела и минус между датами (требуется только для calendarDouble) */
      if (this.calendarDouble) {
        InputMask.addDash(e);
      }
      /* удаляем все символы после 10-го символа */
      this.truncAfter10(e);

      /* удаляем все символы после 24-го символа */
      this.truncAfter24(e);
    }

    // ввод даты закончен
    if (this.calendarSingle) {
      this.checkRangeSingle(e);
    }

    if (this.calendarDouble) {
      this.checkRangeDouble(e);
    }
    if (this.date) {
      this.checkBirthDate(e);
    }
  }

  checkBirthDate(e) {
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

  checkRangeSingle(e) {
    if (e.target.value.length === 10) {
      /* Проверка, что введенная дата попадает в диапазон dateCurrent и datePlusYear */
      const a = e.target.value.split('.');
      const dateSelected = new Date(`${a[2]}-${a[1]}-${a[0]}`);
      const correctFormat = dateSelected < this.dateCurrent
        || dateSelected > this.datePlusYear
        || InputMask.formatIncorrect(dateSelected);
      if (correctFormat) {
        alert(`Введите дату от ${this.dateCurrentTxt} до ${this.datePlusYearTxt}`);
        e.target.value = this.dateCurrentTxt;/* в случае некорректного ввода -
          устанавливаем текущую дату */
      }
    }
  }

  checkRangeDouble(e) {
    if (e.target.value.length === 23) {
      /* Проверка, что введенная дата попадает в диапазон dateCurrent и datePlusYear */
      const a = e.target.value.match(/^\d{2}\.\d{2}\.\d{4}/)[0].split('.');
      const b = e.target.value.match(/\d{2}\.\d{2}\.\d{4}$/)[0].split('.');
      const dateCurrentSelected = new Date(`${a[2]}-${a[1]}-${a[0]}`);
      const datePlusYearSelected = new Date(`${b[2]}-${b[1]}-${b[0]}`);
      const correctFormat = dateCurrentSelected < this.dateCurrent
        || dateCurrentSelected > this.datePlusYear
        || InputMask.formatIncorrect(dateCurrentSelected)
        || datePlusYearSelected < this.dateCurrent
        || datePlusYearSelected > this.datePlusYear
        || InputMask.formatIncorrect(datePlusYearSelected);
      if (correctFormat) {
        alert(`Введите даты в диапазоне от ${this.dateCurrentTxt} до ${this.datePlusYearTxt}`);
        e.target.value = `${this.dateCurrentTxt} - ${this.dateTomorrowTxt}`;// в случае некорректного ввода - устанавливаем диапазон [текущая дата - завтрашняя дата]
      }
    }
  }

  mask() {
    /* запретить все типы ввода, кроме перечисленных */
    this.input.addEventListener('input', this.handleInput);
  }
}

function renderInputsMask(selector) {
  const inputsMask = document.querySelectorAll(selector);
  inputsMask.forEach((inputMask) => new InputMask(selector, inputMask));
}
renderInputsMask('.js-masked');
