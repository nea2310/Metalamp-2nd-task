/* eslint-disable no-alert */
/* eslint-disable indent */
class InputField {
  constructor(elementName, element) {
    this.elementName = elementName.replace(/^.js-/, '');
    this.wrapper = element;

    this.date = !!this.wrapper.classList.contains(`js-${this.elementName}_validation_date`);
    this.email = !!this.wrapper.classList.contains(`js-${this.elementName}_validation_email`);
    if (this.date) {
      this._handleInputFieldInput = this._handleInputFieldInput.bind(this);
      this._checkBirthDate = this._checkBirthDate.bind(this);
    }
    if (this.email) {
      this._handleInputFieldChange = this._handleInputFieldChange.bind(this);
      this._handleInputFieldClick = this._handleInputFieldClick.bind(this);
    }

    this._init();
    this._bindEventListeners();
  }

  _init() {
    this.input = this._getElement('input');
    if (this.date) {
      this.dateCurrent = new Date();
      this.dateMinusHundred = new Date(+this.dateCurrent
        - (new Date('2120-12-31') - new Date('2020-01-01')));
      this.dateMinusEighteen = new Date(+this.dateCurrent
        - (new Date('2037-12-31') - new Date('2020-01-01')));
      this.regexpDate = /^\d{2}\.\d{2}\.\d{4}$/;
      this.regexInput = /[^0-9.]/g;

      this.dateMinusHundredTxt = `${this.dateMinusHundred.getDate()
        }.${this.dateMinusHundred.getMonth() + 1
        }.${this.dateMinusHundred.getFullYear()}`;

      this.dateMinusEighteenTxt = `${this.dateMinusEighteen.getDate()
        }.${this.dateMinusEighteen.getMonth() + 1
        }.${this.dateMinusEighteen.getFullYear()}`;

      const formatDate = (dateValue) => {
        let date = dateValue;
        if (this.regexpDate.test(date) === false) {
          const dateSplit = date.split('.');

          const newDateSplit = dateSplit.map((element) => {
            const result = element.length === 1 ? `0${element}` : element;
            return result;
          });
          date = newDateSplit.join('.');
        }
        return date;
      };
      this.dateMinusHundredTxt = formatDate(this.dateMinusHundredTxt);
      this.dateMinusEighteenTxt = formatDate(this.dateMinusEighteenTxt);
    }
    if (this.email) {
      this.link = this.wrapper.querySelector(`${this.elementName}__link`);
    }
  }

  _bindEventListeners() {
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

    InputField.checkFormat(e);

    if (e.inputType === 'insertText') {
      InputField.addZero(e);
      InputField.addDot(e);
      InputField.truncAfter10(e);
    }
    this._checkBirthDate(e);
  }

  _checkBirthDate(e) {
    if (e.target.value.length === 10) {
      const a = e.target.value.split('.');
      const dateSelected = new Date(`${a[2]}-${a[1]}-${a[0]}`);
      const needCorrectFormat = dateSelected < this.dateMinusHundred
        || dateSelected > this.dateMinusEighteen
        || Number.isNaN(+dateSelected);
      if (needCorrectFormat) {
        alert(`Введите дату от ${this.dateMinusHundredTxt
          } до ${this.dateMinusEighteenTxt}`);
        e.target.value = '';
      }
    }
  }

  _handleInputFieldChange() {
    InputField.testEmail(this.input.value);
  }

  _handleInputFieldClick() {
    InputField.testEmail(this.input.value);
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
    const needCorrectFormat = (
      parseInt(e.target.value[0], 10) >= 4
      && e.target.value.length === 1)
      || (parseInt(e.target.value[3], 10) >= 2
        && e.target.value.length === 4);
    if (needCorrectFormat) {
      plusZero();
    }
  }

  static addDot(e) {
    const needCorrectFormat = e.target.value.length === 2
      || e.target.value.length === 5;
    if (needCorrectFormat) {
      e.target.value = `${e.target.value}.`;
    }
  }

  static truncAfter10(e) {
    if (e.target.value.length > 10) {
      e.target.value = e.target.value.slice(
        0,
        e.target.value.length - 1,
      );
    }
  }

  static testEmail(value) {
    const test = /.+@.+\..+/i.test(value);
    if (value && !test) {
      alert(`Введенный e-mail ${value} имеет некорректный формат`);
    }
  }

  _getElement(selector, wrapper = this.wrapper) {
    return wrapper
      .querySelector(`.js-${this.elementName}__${selector}`);
  }
}

function renderInputsMask(selector) {
  const inputFields = document.querySelectorAll(selector);
  inputFields.forEach((inputMask) => new InputField(selector, inputMask));
}
renderInputsMask('.js-input-field');
