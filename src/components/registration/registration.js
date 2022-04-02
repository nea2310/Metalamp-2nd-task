import './registration.scss';
class Registration {
  constructor(elemName, elem) {
    this.elemName = elemName;
    this.wrapper = elem;
    this.render();
    this.focusInput();
    this.formSubmit();
  }


  render() {
    this.form = this.wrapper.
      querySelector(`${this.elemName}__reg-form`);
    this.date = this.wrapper.querySelector('.js-masked');
    this.inputs = this.wrapper.
      querySelectorAll('input');
  }
  // При фокусе убрать красную рамку с инпута
  focusInput() {
    this.inputs.forEach(function (date) {
      date.addEventListener('focus', () => {
        date.classList.remove('js-err');
      });
    });
  }
  // Валидация инпутов на сабмите формы
  formSubmit() {
    this.form.addEventListener('submit', (e) => {
      let isErr = false;
      this.inputs.forEach(function (input) {
        if (input.value.trim() === '') {
          input.classList.add('js-err');
        }
        else {
          input.classList.remove('js-err');
        }
      });
      //проверку на формат даты обязательно делать ПОСЛЕ проверки на заполненность поля
      if (/^\d{2}\.\d{2}\.\d{4}$/.test(this.date.value)) {
        this.date.classList.remove('js-err');
      } else {
        this.date.classList.add('js-err');
      }

      for (let i = 0; i < this.inputs.length; i++) {
        if (this.inputs[i].classList.contains('js-err')) {
          isErr = true;
          break;
        }
      }
      if (isErr) {
        e.preventDefault();
        alert('Заполните все поля!');
      }
    });
  }
}

function renderRegistrations(selector) {
  let registrations = document.querySelectorAll(selector);
  for (let registration of registrations) {
    new Registration(selector, registration);
  }
}
renderRegistrations('.js-registration');