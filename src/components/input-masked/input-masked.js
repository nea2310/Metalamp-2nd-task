import { a } from '../input/input.js';

a();


let inputsMasked = document.querySelectorAll('.input-masked');
for (let input of inputsMasked) {
	input.setAttribute("type", "text");
	input.setAttribute("placeholder", "ДД.ММ.ГГГГ");

	input.addEventListener('input', (e) => {
		console.log(e.inputType);



		if (e.inputType != 'insertText' &&
			e.inputType != 'insertFromDrop' &&
			e.inputType != 'insertFromPaste' &&
			e.inputType != 'deleteByCut' &&
			e.inputType != 'deleteContentBackward') {
			e.target.value = '';
		}


		/*при вводе перетаскиванием текста или из буфера обмена - проверить на соответствие формату ДД.ММ.ГГГГ и если
		не соответствует - очистить инпут*/
		if (e.inputType == 'insertFromDrop' ||
			e.inputType == 'insertFromPaste') {
			if (/^\d{2}\.\d{2}\.\d{4}$/.test(e.target.value) == false) {
				e.target.value = '';
			}
		}
		if (e.inputType == 'insertText') {/*ставим точку после второго и пятого символа*/
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
				e.target.value = e.target.value.slice(0,
					e.target.value.length - 1);
			}
		}



		if (e.target.value.length == 10) {
			console.log('ВВОД ДАТЫ ЗАКОНЧЕН');
			/*здесь - проверка на корректность введенной даты*/
			let a = e.target.value.split('.');
			let date = new Date(a[2] + '-' + a[1] + '-' + a[0]);
			console.log(new Date());
			console.log(new Date(+(new Date()) +
				(new Date("2020-12-31") - new Date("2020-01-01"))));
			if (date < new Date() || date >
				new Date(+(new Date()) +
					(new Date("2020-12-31") - new Date("2020-01-01"))) ||
				date == 'Invalid Date')
				alert('введите дату от ' + new Date() + 'до' +
					new Date(+(new Date()) +
						(new Date("2020-12-31") - new Date("2020-01-01"))));

		}

	});



}






