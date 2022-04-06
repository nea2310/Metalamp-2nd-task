/* eslint-disable no-alert */
import './registration.scss';

class Registration {
  constructor(elemName, elem) {
    this.elemName = elemName;
    this.wrapper = elem;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.render();
    this.formSubmit();
  }

  render() {
    this.form = this.wrapper
      .querySelector(`${this.elemName}__reg-form`);
    this.date = this.wrapper.querySelector('.js-masked');
    this.inputs = this.wrapper
      .querySelectorAll('input');
  }

  handleSubmit(e) {
    let isErr = false;
    this.inputs.forEach((input) => {
      if (input.value.trim() === '') {
        input.classList.add('js-err');
      } else {
        input.classList.remove('js-err');
      }
    });
    // проверку на формат даты обязательно делать ПОСЛЕ проверки на заполненность поля
    if (/^\d{2}\.\d{2}\.\d{4}$/.test(this.date.value)) {
      this.date.classList.remove('js-err');
    } else {
      this.date.classList.add('js-err');
    }

    for (let i = 0; i < this.inputs.length; i += 1) {
      if (this.inputs[i].classList.contains('js-err')) {
        isErr = true;
        break;
      }
    }
    if (isErr) {
      e.preventDefault();
      alert('Заполните все поля!');
    }
  }

  // Валидация инпутов на сабмите формы
  formSubmit() {
    this.form.addEventListener('submit', this.handleSubmit);
  }
}

function renderRegistrations(selector) {
  const registrations = document.querySelectorAll(selector);
  registrations.forEach((registration) => new Registration(selector, registration));
}
renderRegistrations('.js-registration');
