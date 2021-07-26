class InputMask {
	constructor(elemName, elem) {
		this.elemName = elemName.replace(/^./, '');
		this.input = elem;
		console.log(this.input.className);
		this.calendarSingle =
			this.input.classList.contains('js-calendar') ?
				true : false;
		this.calendarDouble =
			this.input.classList.contains('js-calendar-double') ?
				true : false;
		this.date =
			this.input.classList.contains('js-date') ? true : false;
		console.log(this.calendarSingle);
		console.log(this.calendarDouble);
		console.log(this.date);

		this.init();
		this.mask();
	}

	init() {
		//dateFrom =  текущая дате
		this.dateFrom = new Date();
		//dateTo = плюс один год к текущей дате
		this.dateTo = new Date(+this.dateFrom +
			(new Date("2020-12-31") - new Date("2020-01-01")));
		this.regexpDate = /^\d{2}\.\d{2}\.\d{4}$/; // формат даты
		this.regexpDateDouble = /^\d{2}\.\d{2}\.\d{4} - \d{2}\.\d{2}\.\d{4}$/; // формат даты
		this.regexInput = /[^0-9.]/g; // формат ввода в инпут - все, кроме цифр и точек(будет заменяться на пустую строку)
		this.regexInputDouble = /[^0-9. -]/g; // формат ввода в инпут - все, кроме цифр, точек, пробелов и дефисов(будет заменяться на пустую строку)

		this.dateFromTxt = '' + this.dateFrom.getDate() +
			'.' + (this.dateFrom.getMonth() + 1) +
			'.' + this.dateFrom.getFullYear();
		this.dateToTxt = '' + this.dateTo.getDate() +
			'.' + (this.dateTo.getMonth() + 1) +
			'.' + this.dateTo.getFullYear();

		//вставляет нули, если число или месяц - однозначное
		let formatDate = (date) => {
			if (this.regexpDate.test(date) == false) {
				let a = date.split('.');

				for (let i = 0; i < a.length; i++) {
					if (a[i].length == 1) {
						a[i] = '0' + a[i];
					}
				}
				date = a.join('.');
			}
			return date;
		};
		this.dateFromTxt = formatDate(this.dateFromTxt);
		this.dateToTxt = formatDate(this.dateToTxt);
	}



	mask() {

		/*запретить все типы ввода, кроме перечисленных*/
		this.input.addEventListener('input', (e) => {
			let inpTypeAllowed = false;
			let allowedInpTypes =
				['insertText',
					'insertFromDrop',
					'insertFromPaste',
					'deleteByCut',
					'deleteContentBackward'];
			for (let i = 0; i <= allowedInpTypes.length; i++) {
				if (e.inputType == allowedInpTypes[i]) {
					inpTypeAllowed = true;
					break;
				}
			}
			if (!inpTypeAllowed) {
				e.target.value = '';
			}

			/*при вводе перетаскиванием текста или из буфера обмена - проверить на соответствие формату ДД.ММ.ГГГГ и если
			не соответствует - очистить инпут*/
			if (e.inputType == 'insertFromDrop' ||
				e.inputType == 'insertFromPaste') {
				if ((this.calendarSingle || this.date)
					&& this.regexpDate.test(e.target.value) == false ||
					this.calendarDouble
					&& this.regexpDateDouble.test(e.target.value) == false) {
					e.target.value = '';
				}
			}
			/*действия при вводе с клавиатуры*/
			let addZero = () => {
				let a = e.target.value[e.target.value.length - 1];
				e.target.value = e.target.value.slice(0,
					e.target.value.length - 1) + '0' + a;
			};
			if (e.inputType == 'insertText') {
				if (this.calendarSingle || this.date) {
					e.target.value =
						e.target.value.replace(this.regexInput, ''); //все символы, попадающие под паттерн, заменяются на пустую строку
					/*если ввод дня начинается с числа, больше 4 - то добавить перед ним ноль*/
					if (parseInt(e.target.value[0]) >= 4 &&
						e.target.value.length == 1) {
						addZero();
					}
					/*если ввод месяца начинается с числа, больше 2 - то добавить перед ним ноль*/
					if (parseInt(e.target.value[3]) >= 2 &&
						e.target.value.length == 4) {
						addZero();
					}
					/*ставим точку после второго и пятого символа (после дня и месяца)*/
					if (e.target.value.length == 2 ||
						e.target.value.length == 5) {
						e.target.value = e.target.value + '.';
					}
					/*удаляем все символы после 10-го символа*/
					if (e.target.value.length > 10) {
						e.target.value = e.target.value.slice(0,
							e.target.value.length - 1);
					}

				}
				if (this.calendarDouble) {
					e.target.value =
						e.target.value.replace(this.regexInputDouble, ''); //все символы, попадающие под паттерн, заменяются на пустую строку
					/*если ввод дня начинается с числа, больше 4 - то добавить перед ним ноль*/
					if (parseInt(e.target.value[0]) >= 4 &&
						e.target.value.length == 1) {
						addZero();
					}

					if (parseInt(e.target.value[13]) >= 4 &&
						e.target.value.length == 14) {
						addZero();
					}
					/*если ввод месяца начинается с числа, больше 2 - то добавить перед ним ноль*/
					if (parseInt(e.target.value[3]) >= 2 &&
						e.target.value.length == 4) {
						addZero();
					}

					if (parseInt(e.target.value[16]) >= 2 &&
						e.target.value.length == 17) {
						addZero();
					}
					/*ставим точку после второго и пятого, 15-го, 18-го символа (после дня и месяца)*/
					if (e.target.value.length == 2 ||
						e.target.value.length == 5 ||
						e.target.value.length == 15 ||
						e.target.value.length == 18) {
						e.target.value = e.target.value + '.';
					}

					/*ставим знаки пробела и минус между датами*/
					if (e.target.value.length == 10) {
						e.target.value = e.target.value + ' - ';
					}
					/*удаляем все символы после 23-го символа*/
					if (e.target.value.length > 24) {
						e.target.value = e.target.value.slice(0,
							e.target.value.length - 1);
					}
				}
			}
			// ввод даты закончен
			if (this.calendarSingle || this.date) {
				if (e.target.value.length == 10) {
					/*Проверка, что введенная дата попадает в диапазон dateFrom и dateTo*/
					let a = e.target.value.split('.');
					let dateSelected = new Date(a[2] + '-' + a[1] + '-' + a[0]);
					if (dateSelected < this.dateFrom ||
						dateSelected > this.dateTo ||
						dateSelected == 'Invalid Date') {
						alert('Введите дату от ' +
							this.dateFromTxt + ' до ' + this.dateToTxt);
						e.target.value = this.dateFromTxt;//в случае некорректного ввода - устанавливаем текущую дату
					}
				}
			}
		});
	}
}

function inputsMask(selector) {
	let inputsMask = document.querySelectorAll(selector);
	for (let inputMask of inputsMask) {
		new InputMask(selector, inputMask);
	}
}
inputsMask('.js-masked');




