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
			querySelectorAll(`.${this.elemName}__inputWrapper`);
		a.length == 1 ? this.isFilter = true : this.isFilter = false;
		if (!this.isFilter) {
			this.inputDateFrom =
				this.wrapper.
					querySelector(`.${this.elemName}__input-from`);
			this.tipFrom = this.wrapper.
				querySelector(`.${this.elemName}__img-from`);
			this.inputDateTo =
				this.wrapper.
					querySelector(`.${this.elemName}__input-to`);
			this.tipTo = this.wrapper.
				querySelector(`.${this.elemName}__img-to`);
		} else {
			this.inputDate =
				this.wrapper.
					querySelector(`.${this.elemName}__input-fromto`);
			this.tip = this.wrapper.
				querySelector(`.${this.elemName}__img-fromto`);
			this.defaultDates = this.inputDate.value.split(',');
		}

		this.tips = this.wrapper.
			querySelectorAll(`.${this.elemName}__img`);
		this.clWrapper =
			this.wrapper.querySelector(`.${this.elemName}__calendarWrapper`);
		this.btnClear =
			this.wrapper.querySelector(`.${this.elemName}__button-clear`);
		this.btnApply =
			this.wrapper.querySelector(`.${this.elemName}__button-apply`);
		//console.log(this.tipTo);
	}

	/*Выбор даты в календаре*/
	init() {
		let separator;
		this.isFilter ? separator = " - " : separator = ",";
		this.myDatepicker = $(this.clWrapper).datepicker({
			altField: $(this.inputDate),
			altFieldDateFormat: "dd M",
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
					contains(`.${this.elemName}__input-from`) ?
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
			tip.addEventListener('click', (e) => {
				this.expand(true);
			});
		}
	}



	apply() {
		this.btnApply.addEventListener('click', () => {
			if (this.myDatepicker.selectedDates.length == 1) {
				alert("Введите дату выезда");
			} else {
				this.clWrapper.classList.add('hidden');
				if (!this.isFilter) {
					this.expand(false);
				} else {
					this.expand(false);
				}
			}
		});
	}


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
			this.clWrapper.classList.remove('hidden');
			if (!this.isFilter) {
				this.tipFrom.classList.add("expanded");
				this.tipTo.classList.add("expanded");
				this.tipFrom.classList.remove("collapsed");
				this.tipTo.classList.remove("collapsed");
			} else {
				this.tip.classList.add("expanded");
				this.tip.classList.remove("collapsed");
			}

		} else {
			this.clWrapper.classList.add('hidden');
			if (!this.isFilter) {
				this.tipFrom.classList.remove("expanded");
				this.tipTo.classList.remove("expanded");
				this.tipFrom.classList.add("collapsed");
				this.tipTo.classList.add("collapsed");
			} else {
				this.tip.classList.remove("expanded");
				this.tip.classList.add("collapsed");
			}
		}
	}
}


new DatePicker("dateDropDown");
new DatePicker("filterDateDropDown");

