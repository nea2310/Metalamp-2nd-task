class Login {
	constructor(elemName, elem) {
		this.elemName = elemName;
		this.wrapper = elem;
		this.render();
		this.focusInput();
		this.formSubmit();

	}

	render() {
		this.form = this.wrapper.
			querySelector(`.${this.elemName}__login-form`);
		this.inputs = this.wrapper.
			querySelectorAll('.input-field__input');
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

function renderLogins() {
	let logins = document.querySelectorAll('.login');
	for (let login of logins) {
		new Login('login', login);
	}
}
renderLogins();