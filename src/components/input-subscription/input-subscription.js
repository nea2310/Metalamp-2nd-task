class InputSubscribe {
	constructor(elemName, elem) {
		this.elemName = elemName;
		this.input = elem;
		this.inputWrapper = this.input.parentNode;
		this.link = this.inputWrapper.querySelector('button');
		this.init();

	}
	init() {
		function testEmail(value) {
			let test = /.+@.+\..+/i.test(value);
			if (value && !test) {
				alert(`Введенный e-mail ${value} имеет некорректный формат`);
			}
		}
		this.input.addEventListener('change', () => {
			testEmail(this.input.value);
		});
		this.link.addEventListener('click', () => {
			testEmail(this.input.value);
		});
	}
}

function inputsSubscribe() {
	let inputsSubscribe = document.querySelectorAll('.js-check-email');
	for (let inputSubscribe of inputsSubscribe) {
		new InputSubscribe('js-check-email', inputSubscribe);
	}
}
inputsSubscribe();



