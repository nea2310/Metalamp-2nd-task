import './date-dropdown.scss';
class DatePicker {
	constructor(elemName, elem) {
		this.elemName = elemName.replace(/^./, '');
		this.wrapper = elem;
		this.render();
		this.init();
		this.setDefaultDate();
		this.datePrint();
		this.dateClear();
		this.show();
		this.apply();
		this.clear();
	}

	getElem(selector, wrapper = this.wrapper) {
		return wrapper.querySelector(
			'.' + this.elemName + '__' + selector);
	}

	getElems(selectors) {
		let sel = '';
		for (let selector of selectors) {
			sel += '.' + this.elemName + '__' + selector + ',';
		}
		sel = sel.substring(0, sel.length - 1);
		return this.wrapper.querySelectorAll(sel);
	}

	render() {
		let a = this.getElems(['input-wrapper']);
		a.length == 1 ? this.isFilter = true : this.isFilter = false;
		if (!this.isFilter) {
			this.inputDateFrom = this.getElem('input_from');
			this.inputDateTo = this.getElem('input_to');
		} else {
			this.inputDate = this.getElem('input_fromto');
			this.defaultDates = this.inputDate.value.split(',');
		}
		this.tips = this.getElems(['img']);
		this.clWrapper = this.getElem('calendar-wrapper');
		this.btnClear = this.getElem('button-clear');
		this.btnApply = this.getElem('button-apply');
	}

	/*Выбор даты в календаре*/
	init() {
		const imgPrev =
			require(
				'./img/arrow-back.svg'
			).default;
		const imgNext = require(
			'./img/arrow-forward.svg'
		).default;
		let separator;
		this.isFilter ? separator = ' - ' : separator = ',';
		this.myDatepicker = $(this.clWrapper).datepicker({
			disableNavWhenOutOfRange: false,
			altField: $(this.inputDate),
			altFieldDateFormat: 'dd M',
			multipleDatesSeparator: separator,
			navTitles: {
				days: 'MM <i>yyyy</i>',
			},
			minDate: new Date(),
			range: true,
			multipleDates: true,
			prevHtml: '<img src="' + imgPrev + '">',
			nextHtml: '<img src="' + imgNext + '">',
			onSelect: (selectedDate) => {
				if (!this.isFilter) {
					let dateArr = selectedDate.split(',');
					let val;
					if (dateArr.length == 1) {//если выбрана одиночная дата
						val = '';
					} else {//если выбран диапазон дат
						val = dateArr[1];
					}
					this.inputDateFrom.value = dateArr[0];
					this.inputDateTo.value = val;
				} else {
					this.inputDate.value =
						this.inputDate.value.toLowerCase();
				}
			}
		}).data('datepicker');
		this.calendar = this.wrapper.
			querySelector('.datepicker-inline');
		this.collapseByClick();
		this.insideCalendarClick();
	}

	/*Установка даты из поля value в верстке*/
	setDefaultDate() {
		if (this.isFilter) {
			let dateFrom = this.defaultDates[0];
			let dateTo = this.defaultDates[1];
			this.myDatepicker.selectDate(new Date(dateFrom));
			this.myDatepicker.selectDate(new Date(dateTo));
		}
	}

	/*Ввод даты в инпут с клавиатуры */
	datePrint() {
		if (this.isFilter) {
			//При фокусе на инпут преобразовать дату в формат ДД.ММ.ГГГГ - ДД.ММ.ГГГГ
			this.inputDate.addEventListener('focus', (e) => {
				this.initDate = this.inputDate.value;
				let startDate = this.myDatepicker.selectedDates[0];
				let endDate = this.myDatepicker.selectedDates[1];
				let tempStDate = String(startDate.getDate());
				let startDay
					= tempStDate.length == 1 ? '0' + tempStDate : tempStDate;
				let tempStMonth = String(startDate.getMonth() + 1);
				let startMonth
					= tempStMonth.length == 1 ? '0' + tempStMonth : tempStMonth;
				startMonth = startMonth == '12' ? '01' : startMonth;
				let tempEndDate = String(endDate.getDate());
				let endDay
					= tempEndDate.length == 1 ? '0' + tempEndDate : tempEndDate;
				let tempEndMonth = String(endDate.getMonth() + 1);
				let endMonth
					= tempEndMonth.length == 1 ? '0' + tempEndMonth :
						tempEndMonth;
				endMonth = endMonth == '12' ? '01' : endMonth;
				e.target.value =
					startDay + '.'
					+ startMonth + '.'
					+ startDate.getFullYear() + ' - '
					+ endDay + '.'
					+ endMonth + '.'
					+ endDate.getFullYear();
				this.initDateParsed = this.inputDate.value;
			});

			this.inputDate.addEventListener('blur', () => {
				if (this.inputDate.value == this.initDateParsed) {
					this.inputDate.value = this.initDate;
				}
			});
		}

		//обработчик события окончания ввода в инпут по маске ДД.ММ.ГГГГ
		this.wrapper.addEventListener('input', (e) => {
			if ((e.target == this.inputDateFrom ||
				e.target == this.inputDateTo) && e.target.value.length == 10) {
				this.currentInput = e.target;
				this.currentInput.classList.
					contains(`.${this.elemName}__input_from`) ?
					this.secondInput = this.inputDateTo :
					this.secondInput = this.inputDateFrom;
				if (this.secondInput.value) {// заполнены оба инпута
					let a = this.currentInput.value.split('.');
					let b = this.secondInput.value.split('.');
					this.myDatepicker.clear();
					this.myDatepicker.selectDate(
						new Date(b[2] + '-' + b[1] + '-' + b[0]));
					this.myDatepicker.selectDate(
						new Date(a[2] + '-' + a[1] + '-' + a[0]));
				}
				else {
					//заполнен один инпут
					let a = this.currentInput.value.split('.');
					this.myDatepicker.clear();
					this.myDatepicker.selectDate(
						new Date(a[2] + '-' + a[1] + '-' + a[0]));
				}
			} else if ((e.target == this.inputDate)
				&& e.target.value.length == 23) {
				let a = e.target.value.match(/^\d{2}\.\d{2}\.\d{4}/)[0].split('.');
				let b = e.target.value.match(/\d{2}\.\d{2}\.\d{4}$/)[0].split('.');
				this.myDatepicker.clear();
				this.myDatepicker.selectDate(
					new Date(b[2] + '-' + b[1] + '-' + b[0]));
				this.myDatepicker.selectDate(
					new Date(a[2] + '-' + a[1] + '-' + a[0]));
			}
		});
	}

	//проверка, клик был снаружи или внутри календаря
	insideCalendarClick() {
		this.calendar.addEventListener('click', () => {
			this.clickOnCalendar = true;
		});
	}

	//отлавливаем все клики по документу, если клик снаружи виджета - сворачиваем виджет
	collapseByClick() {
		document.addEventListener('click', (e) => {
			if (
				(this.isFilter && e.target != this.inputDate ||//условие #1
					!this.isFilter && (//условие #2
						e.target != this.inputDateFrom &&
						e.target != this.inputDateTo) ||
					e.target.closest(`.${this.elemName}`) == null)//условие #3
				&& this.clickOnCalendar == false//общее условие для условий #1, #2, #3
			) {
				this.toggle(false);
			} else {
				this.clickOnCalendar = false;
			}
		});
	}

	//Показ  календаря при клике по инпуту
	show() {
		if (!this.isFilter) {
			this.inputDateFrom.addEventListener('click', () => {
				if (this.clWrapper.classList.
					contains(`${this.elemName}__calendar-wrapper_hidden`))
					this.toggle(true);
			});
			this.inputDateTo.addEventListener('click', () => {
				if (this.clWrapper.classList.
					contains(`${this.elemName}__calendar-wrapper_hidden`))
					this.toggle(true);
			});
		}
		else {
			this.inputDate.addEventListener('click', () => {
				if (this.clWrapper.classList.
					contains(`${this.elemName}__calendar-wrapper_hidden`)) {
					this.toggle(true);
				}
			});
		}
	}

	// Открывание/ закрывание календаря
	toggle(flag) {
		let wrap = this.elemName + '__';
		if (flag) {
			this.clWrapper.classList.
				remove(wrap + 'calendar-wrapper_hidden');
			for (let tip of this.tips) {
				tip.classList.add(wrap + 'img_expanded');
				tip.classList.remove(wrap + 'img_collapsed');
			}
		} else {
			this.clWrapper.classList.
				add(wrap + 'calendar-wrapper_hidden');
			for (let tip of this.tips) {
				tip.classList.remove(wrap + 'img_expanded');
				tip.classList.add(wrap + 'img_collapsed');
			}
		}
	}

	//клик по кнопке [Применить]
	apply() {
		this.btnApply.addEventListener('click', () => {
			if (this.myDatepicker.selectedDates.length == 1) {
				alert('Введите дату выезда');
			} else {
				this.clWrapper.classList.
					add(`${this.elemName}__calendar-wrapper_hidden`);
				if (!this.isFilter) {
					this.toggle(false);
				} else {
					this.toggle(false);
				}
			}
		});
	}

	//Удаление даты из инпута
	dateClear() {
		this.wrapper.addEventListener('input', (e) => {
			if (e.target == this.inputDateFrom ||
				e.target == this.inputDateTo) {
				if (e.target.value == '') {//Если инпут очищен
					if (e.target == this.inputDateFrom) { // очищен левый инпут
						this.inputDateTo.value = '';// очистить правый инпут
						this.myDatepicker.clear();// очистить календарь (снять выделение с обеих дат)
					} else {// очищен правый инпут
						let a = this.myDatepicker.selectedDates[1];
						this.myDatepicker.removeDate(a); // снять выделение с второй даты (левый инпут и первая дата остаются)
					}
				}
			}
		});
	}

	//клик по кнопке [Очистить]
	clear() {
		this.btnClear.addEventListener('click', () => {
			this.clickOnCalendar = true;
			this.myDatepicker.clear();
			if (!this.isFilter) {
				this.inputDateFrom.value = '';
				this.inputDateTo.value = '';
			}
		});
	}
}

function renderDateDropDowns(selector) {
	let dropDowns = document.querySelectorAll(selector);
	for (let dateDropDown of dropDowns) {
		new DatePicker(selector, dateDropDown);
	}
}
renderDateDropDowns('.date-dropdown');