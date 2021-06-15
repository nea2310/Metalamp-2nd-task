export let a = function () {

	let inputs = document.querySelectorAll('.input');
	for (let input of inputs) {
		input.addEventListener('focus', (e) => {
			e.target.classList.add('input-focused');
		});
		input.addEventListener('blur', (e) => {
			e.target.classList.remove('input-focused');
		});
	}

};











