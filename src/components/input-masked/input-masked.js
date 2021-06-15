import { a } from '../input/input.js';

let inputsMasked = document.querySelectorAll('.input-masked');
for (let input of inputsMasked) {
	input.setAttribute("type", "text");
	input.setAttribute("placeholder", "ДД.ММ.ГГГГ");

	input.addEventListener('input', (e) => {
		/*при вводе перетаскиванием текста или из буфера обмена - проверить на соответствие формату ДД.ММ.ГГГГ и если
		не соответствует - очистить инпут*/
		if (e.inputType == 'insertFromDrop' ||
			e.inputType == 'insertFromPaste') {
			if (/^\d{2}\.\d{2}\.\d{4}$/.test(e.target.value) == false) {
				e.target.value = '';
			}
		}
		/*ставим точку после второго и пятого символа*/
		if (e.target.value.length == 2 || e.target.value.length == 5) {
			e.target.value = e.target.value + '.';
		}
		/*если после ввода символа строка не соответствует ни одному из регулярных выражений - удалить введенный символ*/

		if ((/^\d$/.test(e.target.value) ||
			/^\d{2}$/.test(e.target.value) ||
			/^\d{2}\.$/.test(e.target.value) ||
			/^\d{2}\.\d$/.test(e.target.value) ||
			/^\d{2}\.\d{2}$/.test(e.target.value) ||
			/^\d{2}\.\d{2}\.$/.test(e.target.value) ||
			/^\d{2}\.\d{2}\.\d$/.test(e.target.value) ||
			/^\d{2}\.\d{2}\.\d{2}$/.test(e.target.value) ||
			/^\d{2}\.\d{2}\.\d{3}$/.test(e.target.value) ||
			/^\d{2}\.\d{2}\.\d{4}$/.test(e.target.value)) == false) {
			e.target.value = e.target.value.slice(0, e.target.value.length - 1);
		}



		if (e.target.value.length == 10) {
			console.log('ВВОД ДАТЫ ЗАКОНЧЕН');
			/*здесь - проверка на корректность введенной даты*/
		}

	});



}






