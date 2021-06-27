
let inputsSubscribe = document.querySelectorAll('.check-email');
function testEmail(value) {
	let test = /.+@.+\..+/i.test(value);
	if (value && !test) {
		alert(`Введенный e-mail ${value} имеет некорректный формат`);
	}
}
for (let input of inputsSubscribe) {
	let inputWrapper = input.parentNode;
	let link = inputWrapper.querySelector('button');
	input.addEventListener('change', () => {
		testEmail(input.value);
	});
	link.addEventListener('click', () => {
		testEmail(input.value);
	});
}



