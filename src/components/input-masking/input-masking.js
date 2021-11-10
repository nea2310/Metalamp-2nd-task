class InputMask {
	constructor(elemName, elem) {
		this.elemName = elemName.replace(/^./, '');
		this.input = elem;
		this.calendarSingle =
			this.input.classList.contains('js-calendar') ?
				true : false;
		this.calendarDouble =
			this.input.classList.contains('js-calendar-double') ?
				true : false;
		this.date =
			this.input.classList.contains('js-date') ? true : false;
		this.init();
		this.mask();
	}

	init() {
		//dateCurrent =  текущая дате
		this.dateCurrent = new Date();
		this.dateTomorrow = new Date(+this.dateCurrent +
			(new Date("2020-12-31") - new Date("2020-12-30")));
		//dateMinusHundred  - теущая дата минус 100 лет
		this.dateMinusHundred = new Date(+this.dateCurrent -
			(new Date("2120-12-31") - new Date("2020-01-01")));
		//dateMinusEighteen  - теущая дата минус 18 лет
		this.dateMinusEighteen = new Date(+this.dateCurrent -
			(new Date("2037-12-31") - new Date("2020-01-01")));
		//datePlusYear = плюс один год к текущей дате
		this.datePlusYear = new Date(+this.dateCurrent +
			(new Date("2020-12-31") - new Date("2020-01-01")));
		this.regexpDate = /^\d{2}\.\d{2}\.\d{4}$/; // формат даты
		this.regexpDateDouble = /^\d{2}\.\d{2}\.\d{4} - \d{2}\.\d{2}\.\d{4}$/; // формат даты
		this.regexInput = /[^0-9.]/g; // формат ввода в инпут - все, кроме цифр и точек(будет заменяться на пустую строку)
		this.regexInputDouble = /[^0-9. -]/g; // формат ввода в инпут - все, кроме цифр, точек, пробелов и дефисов(будет заменяться на пустую строку)

		this.dateCurrentTxt = '' + this.dateCurrent.getDate() +
			'.' + (this.dateCurrent.getMonth() + 1) +
			'.' + this.dateCurrent.getFullYear();

		this.dateTomorrowTxt = '' + this.dateTomorrow.getDate() +
			'.' + (this.dateTomorrow.getMonth() + 1) +
			'.' + this.dateTomorrow.getFullYear();

		this.dateMinusHundredTxt = '' + this.dateMinusHundred.getDate() +
			'.' + (this.dateMinusHundred.getMonth() + 1) +
			'.' + this.dateMinusHundred.getFullYear();

		this.dateMinusEighteenTxt = '' + this.dateMinusEighteen.getDate() +
			'.' + (this.dateMinusEighteen.getMonth() + 1) +
			'.' + this.dateMinusEighteen.getFullYear();

		this.datePlusYearTxt = '' + this.datePlusYear.getDate() +
			'.' + (this.datePlusYear.getMonth() + 1) +
			'.' + this.datePlusYear.getFullYear();

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
		this.dateCurrentTxt = formatDate(this.dateCurrentTxt);
		this.dateTomorrowTxt = formatDate(this.dateTomorrowTxt);
		this.dateMinusHundredTxt = formatDate(this.dateMinusHundredTxt);
		this.dateMinusEighteenTxt = formatDate(this.dateMinusEighteenTxt);
		this.datePlusYearTxt = formatDate(this.datePlusYearTxt);
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
				}

				if (this.calendarDouble) {
					e.target.value =
						e.target.value.replace(this.regexInputDouble, '');//все символы, попадающие под паттерн, заменяются на пустую строку
				}
				/*если ввод дня начинается с числа, больше 3 - то добавить перед ним ноль*/
				/*если ввод месяца начинается с числа, больше 1 - то добавить перед ним ноль*/
				if (parseInt(e.target.value[0]) >= 4 &&
					e.target.value.length == 1 ||
					parseInt(e.target.value[3]) >= 2 &&
					e.target.value.length == 4 ||
					parseInt(e.target.value[13]) >= 4 &&
					e.target.value.length == 14 ||
					parseInt(e.target.value[16]) >= 2 &&
					e.target.value.length == 17
				) {
					addZero();
				}
				/*ставим точку после 2-го, 5-го, 15-го, 18-го символа (после дня и месяца)*/
				if (e.target.value.length == 2 ||
					e.target.value.length == 5 ||
					e.target.value.length == 15 ||
					e.target.value.length == 18) {
					e.target.value = e.target.value + '.';
				}

				/*ставим знаки пробела и минус между датами (требуется только для calendarDouble)*/
				if (this.calendarDouble) {
					if (e.target.value.length == 10) {
						e.target.value = e.target.value + ' - ';
					}
				}
				/*удаляем все символы после 10-го символа*/
				if ((this.calendarSingle || this.date)
					&& e.target.value.length > 10) {
					e.target.value = e.target.value.slice(0,
						e.target.value.length - 1);
				}
				/*удаляем все символы после 24-го символа*/
				if (this.calendarDouble && e.target.value.length > 24) {
					e.target.value = e.target.value.slice(0,
						e.target.value.length - 1);
				}
			}

			// ввод даты закончен
			if (this.calendarSingle) {
				if (e.target.value.length == 10) {
					/*Проверка, что введенная дата попадает в диапазон dateCurrent и datePlusYear*/
					let a = e.target.value.split('.');
					let dateSelected = new Date(a[2] + '-' + a[1] + '-' + a[0]);
					if (dateSelected < this.dateCurrent ||
						dateSelected > this.datePlusYear ||
						dateSelected == 'Invalid Date') {
						alert('Введите дату от ' +
							this.dateCurrentTxt + ' до ' +
							this.datePlusYearTxt);
						e.target.value = this.dateCurrentTxt;//в случае некорректного ввода - устанавливаем текущую дату
					}
				}
			}

			if (this.date) {
				if (e.target.value.length == 10) {
					/*Проверка, что введенная дата попадает в диапазон dateMinusHundred и dateMinusEighteen*/
					let a = e.target.value.split('.');
					let dateSelected = new Date(a[2] + '-' + a[1] + '-' + a[0]);
					if (dateSelected < this.dateMinusHundred ||
						dateSelected > this.dateMinusEighteen ||
						dateSelected == 'Invalid Date') {
						alert('Введите дату от ' + this.dateMinusHundredTxt +
							' до ' + this.dateMinusEighteenTxt);
						e.target.value = '';//в случае некорректного ввода - очищаем инпут
					}
				}
			}

			if (this.calendarDouble) {
				if (e.target.value.length == 23) {
					/*Проверка, что введенная дата попадает в диапазон dateCurrent и datePlusYear*/
					let a = e.target.value.match(/^\d{2}\.\d{2}\.\d{4}/)[0].split('.');
					let b = e.target.value.match(/\d{2}\.\d{2}\.\d{4}$/)[0].split('.');
					let dateCurrentSelected =
						new Date(a[2] + '-' + a[1] + '-' + a[0]);
					let datePlusYearSelected =
						new Date(b[2] + '-' + b[1] + '-' + b[0]);
					if (dateCurrentSelected < this.dateCurrent ||
						dateCurrentSelected > this.datePlusYear ||
						dateCurrentSelected == 'Invalid Date' ||
						datePlusYearSelected < this.dateCurrent ||
						datePlusYearSelected > this.datePlusYear ||
						datePlusYearSelected == 'Invalid Date') {
						alert('Введите даты в диапазоне от ' +
							this.dateCurrentTxt + ' до ' +
							this.datePlusYearTxt);
						e.target.value =
							this.dateCurrentTxt + ' - ' + this.dateTomorrowTxt;//в случае некорректного ввода - устанавливаем диапазон [текущая дата - завтрашняя дата]
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




