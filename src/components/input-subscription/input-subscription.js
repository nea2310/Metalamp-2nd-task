class InputSubscribe {
	constructor(elemName, elem) {
		this.elemName = elemName.replace(/^./, '');
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
		if (this.link) {
			this.link.addEventListener('click', () => {
				testEmail(this.input.value);
			});
		}
	}
}

function inputsSubscribe(selector) {
	let inputsSubscribe = document.querySelectorAll(selector);
	for (let inputSubscribe of inputsSubscribe) {
		new InputSubscribe(selector, inputSubscribe);
	}
}
inputsSubscribe('.js-check-email');



