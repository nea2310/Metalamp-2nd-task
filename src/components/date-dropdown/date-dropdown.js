class DatePicker {
	constructor(elemName) {
		this.elemName = elemName;
		this.wrapper = document.querySelector(`.${this.elemName}`);
		this.render();
		this.init();
		this.setDefaultDate();
		this.datePrint();
		this.dateClear();
		this.show();
		this.apply();
		this.clear();
	}
	render() {
		let a = this.wrapper.
			querySelectorAll(`.${this.elemName}__input-wrapper`);
		a.length == 1 ? this.isFilter = true : this.isFilter = false;
		if (!this.isFilter) {
			this.inputDateFrom =
				this.wrapper.
					querySelector(`.${this.elemName}__input_from`);
			this.tipFrom = this.wrapper.
				querySelector(`.${this.elemName}__img_from`);
			this.inputDateTo =
				this.wrapper.
					querySelector(`.${this.elemName}__input_to`);
			this.tipTo = this.wrapper.
				querySelector(`.${this.elemName}__img_to`);
		} else {
			this.inputDate =
				this.wrapper.
					querySelector(`.${this.elemName}__input_fromto`);
			this.tip = this.wrapper.
				querySelector(`.${this.elemName}__img_fromto`);
			this.defaultDates = this.inputDate.value.split(',');
		}



		this.tips = this.wrapper.
			querySelectorAll(`.${this.elemName}__img`);
		this.clWrapper =
			this.wrapper.querySelector(`.${this.elemName}__calendar-wrapper`);
		this.btnClear =
			this.wrapper.querySelector(`.${this.elemName}__button-clear`);
		this.btnApply =
			this.wrapper.querySelector(`.${this.elemName}__button-apply`);
	}


	//проверка, клик был снаружи или внутри виджета
	insideClick(elem, parentElemSelector) {
		if (elem.closest(parentElemSelector)) {
			return true;
		}
		else {
			return false;
		}
	}

	//проверка, клик был снаружи или внутри календаря
	insideCalendarClick() {
		this.calendar.addEventListener('click', (e) => {
			//console.log('КЛИК ПО КАЛЕНДАРЮ');
			this.clickOnCalendar = true;

		});
	}

	//отлавливаем все клики по документу, если клик снаружи виджета - сворачиваем виджет
	collapseByClick() {
		document.addEventListener('click', (e) => {
			if (this.insideClick(e.target, `.${this.elemName}`) ||
				this.clickOnCalendar) {
				//	console.log('КЛИК ВНУТРИ');
				e.preventDefault();
				this.clickOnCalendar = false;
			}
			else {
				//	console.log('КЛИК СНАРУЖИ');
				this.clWrapper.classList.
					add(`${this.elemName}__calendar-wrapper_hidden`);
				if (!this.isFilter) {
					this.tipTo.
						classList.remove(`${this.elemName}__img-expanded`);
					this.tipTo.classList.add(`${this.elemName}__img_collapsed`);
					this.tipFrom.
						classList.remove(`${this.elemName}__img-expanded`);
					this.tipFrom.
						classList.add(`${this.elemName}__img_collapsed`);
				} else {
					this.tip.classList.remove(`${this.elemName}__img-expanded`);
					this.tip.classList.add(`${this.elemName}__img_collapsed`);
				}
			}
		});
	}



	/*Выбор даты в календаре*/
	init() {
		let separator;
		this.isFilter ? separator = ' - ' : separator = ',';
		this.myDatepicker = $(this.clWrapper).datepicker({
			altField: $(this.inputDate),
			altFieldDateFormat: 'dd M',
			multipleDatesSeparator: separator,
			navTitles: {
				days: 'MM <i>yyyy</i>',
			},
			minDate: new Date(),
			range: true,
			multipleDates: true,
			prevHtml: `<img src="assets/img/interface/arrow_back.svg">`,
			nextHtml: `<img src="assets/img/interface/arrow_forward.svg">`,
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
			}
		});
	}

	/*Удаление даты из инпута*/
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
	//Показ календаря
	show() {
		if (!this.isFilter) {
			this.inputDateFrom.addEventListener('click', () => {
				this.expand(true);
			});
			this.inputDateTo.addEventListener('click', () => {
				this.expand(true);
			});
		} else {
			this.inputDate.addEventListener('click', () => {
				this.expand(true);
			});
		}
		for (let tip of this.tips) {
			tip.addEventListener('click', () => {
				this.expand(true);
			});
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
					this.expand(false);
				} else {
					this.expand(false);
				}
			}
		});
	}

	//клик по кнопке [Очистить]
	clear() {
		this.btnClear.addEventListener('click', () => {
			this.myDatepicker.clear();
			if (!this.isFilter) {
				this.inputDateFrom.value = '';
				this.inputDateTo.value = '';
			}
		});
	}


	expand(flag) {
		if (flag) {
			this.clWrapper.classList.
				remove(`${this.elemName}__calendar-wrapper_hidden`);
			if (!this.isFilter) {
				this.tipFrom.classList.add(`${this.elemName}__img-expanded`);
				this.tipTo.classList.add(`${this.elemName}__img-expanded`);
				this.tipFrom.classList.
					remove(`${this.elemName}__img_collapsed`);
				this.tipTo.classList.
					remove(`${this.elemName}__img_collapsed`);
			} else {
				this.tip.classList.add(`${this.elemName}__img-expanded`);
				this.tip.classList.remove(`${this.elemName}__img_collapsed`);
			}

		} else {
			this.clWrapper.classList.
				add(`${this.elemName}__calendar-wrapper_hidden`);
			if (!this.isFilter) {
				this.tipFrom.classList.
					remove(`${this.elemName}__img-expanded`);
				this.tipTo.classList.remove(`${this.elemName}__img-expanded`);
				this.tipFrom.classList.add(`${this.elemName}__img_collapsed`);
				this.tipTo.classList.add(`${this.elemName}__img_collapsed`);
			} else {
				this.tip.classList.remove(`${this.elemName}__img-expanded`);
				this.tip.classList.add(`${this.elemName}__img_collapsed`);
			}
		}
	}
}


new DatePicker('dateDropDown');
new DatePicker('filterDateDropDown');

