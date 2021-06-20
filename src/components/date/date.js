class DatePicker {
	constructor(root, isFilter) {
		this.wrapper = document.querySelector(root);
		this.blockName = this.wrapper.classList[0].match(/^.*_/)[0];
		this.isFilter = isFilter;
		this.render();
		this.datePick();
		this.setDefaultDate();
		this.datePrint();
		this.preventDateReset();
		this.clear();
		this.apply();
		this.show();

	}


	setDefaultDate() {
		if (this.isFilter) {
			console.log(this.defaultDates);
			let dateFrom = this.defaultDates[0];
			let dateTo = this.defaultDates[1];
			this.myDatepicker.selectDate(new Date(dateFrom));
			this.myDatepicker.selectDate(new Date(dateTo));
			console.log(dateFrom);
		}
	}

	render() {


		if (!this.isFilter) {
			this.inputDateFrom =
				this.wrapper.querySelector(`.${this.blockName}input-from`);
			this.inputDateTo =
				this.wrapper.querySelector(`.${this.blockName}input-to`);
		} else {
			this.inputDate =
				this.wrapper.querySelector(`.${this.blockName}input-fromto`);

			this.defaultDates = this.inputDate.value.split(',');


		}
		this.clWrapper =
			this.wrapper.querySelector(`.${this.blockName}calendarWrapper`);
		this.btnClear =
			this.wrapper.querySelector(`.${this.blockName}button-clear`);
		this.btnApply =
			this.wrapper.querySelector(`.${this.blockName}button-apply`);
	}


	clear() {
		this.btnClear.addEventListener('click', (e) => {
			this.myDatepicker.clear();
			if (!this.isFilter) {
				this.inputDateFrom.value = '';
				this.inputDateTo.value = '';
			} else {
				this.setDefaultDate();
			}
		});
	}


	apply() {
		this.btnApply.addEventListener('click', (e) => {
			this.clWrapper.classList.add('hidden');
		});
	}


	show() {
		if (!this.isFilter) {
			this.inputDateFrom.addEventListener('click', (e) => {
				this.clWrapper.classList.remove('hidden');
			});
			this.inputDateTo.addEventListener('click', (e) => {
				this.clWrapper.classList.remove('hidden');
			});
		} else {
			this.inputDate.addEventListener('click', (e) => {
				this.clWrapper.classList.remove('hidden');
			});
		}
	}


	/*Запретить деактивацию ранее выбранной даты при повторном клике на нее же*/
	preventDateReset() {
		if (!this.isFilter) {
			this.clWrapper.addEventListener('click', (e) => {
				if (e.target.classList.contains('-selected-')) {
					console.log('SELECTED');
					if (this.inputDateTo.value) {
						let dateArr = [];
						let a = this.inputDateFrom.value.split('.');
						let b = this.inputDateTo.value.split('.');
						dateArr.push(a[2] + '-' + a[1] + '-' + a[0]);
						dateArr.push(b[2] + '-' + b[1] + '-' + b[0]);
						this.myDatepicker.clear();
						this.myDatepicker.selectDate(new Date(dateArr[0]));
						this.myDatepicker.selectDate(new Date(dateArr[1]));
					}
				}
			});
		}
	}

	/*Выбор даты в календаре*/
	datePick() {
		let separator;
		let datePrevArr;
		this.isFilter ? separator = " - " : separator = " , "
		let conf = {
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
					if (dateArr.length == 2) {// если выбран диапазон
						datePrevArr = dateArr;
						console.log(dateArr);
						console.log(datePrevArr);
					}
					if (dateArr.length == 1) {//если выбрана одиночная дата
						if (datePrevArr == undefined) {//первичный выбор первой даты (вторая еще не выбиралась)
							this.inputDateFrom.value = dateArr[0];
							this.inputDateTo.value = '';
						} else {/*очередной выбор даты, когда уже есть выбранный диапазон
						(в соотв. с дефолтными настройками календаря, при этом диапазон деактивируется и активируется одиночная вновь выбранная дата)
						*/

							let a = dateArr[0].split('.');
							let b = datePrevArr[0].split('.');
							let c = datePrevArr[1].split('.');
							let currentDate =
								new Date(a[2] + '-' + a[1] + '-' + a[0]);
							let prevDateFrom =
								new Date(b[2] + '-' + b[1] + '-' + b[0]);
							let prevDateTo =
								new Date(c[2] + '-' + c[1] + '-' + c[0]);
							if (currentDate < prevDateFrom) {//Новая дата раньше обеих старых дат
								this.myDatepicker.selectDate(currentDate);
								this.myDatepicker.selectDate(prevDateFrom);
							}
							else if
								(currentDate > prevDateFrom &&
								currentDate < prevDateTo) {//Новая дата между старыми датами
								this.myDatepicker.clear();
								this.myDatepicker.selectDate(prevDateFrom);
								this.myDatepicker.selectDate(currentDate);
							}
							else if (currentDate > prevDateTo) {//Новая дата позже обеих старых дат
								this.myDatepicker.clear();
								this.myDatepicker.selectDate(prevDateTo);
								this.myDatepicker.selectDate(currentDate);
							}
						}
					} else {//первичный выбор второй даты (первая дата уже выбрана)
						this.inputDateFrom.value = dateArr[0];
						this.inputDateTo.value = dateArr[1];
					}
				}
			}
		};
		this.myDatepicker =
			$(this.clWrapper).datepicker(conf).data('datepicker');
	}


	dateSelect(selectedDate) {
		let datePrevArr;
		let dateArr = selectedDate.split(',');
		if (dateArr.length == 2) {// если выбран диапазон
			datePrevArr = dateArr;
		}
		if (dateArr.length == 1) {//если выбрана одиночная дата
			if (datePrevArr == undefined) {//первичный выбор первой даты (вторая еще не выбиралась)
				if (!this.isFilter) {
					this.inputDateFrom.value = dateArr[0];
					this.inputDateTo.value = '';
				}
			}
		} else {//первичный выбор второй даты (первая дата уже выбрана)
			if (!this.isFilter) {
				this.inputDateFrom.value = dateArr[0];
				this.inputDateTo.value = dateArr[1];
			}
		}
	}

	/*Ввод даты в инпут с клавиатуры или очистка инпута*/
	datePrint() {
		//обработчик кастомного события окончания ввода в инпут по маске ДД.ММ.ГГГГ
		if (!this.isFilter) {
			this.wrapper.addEventListener('inputDate', (e) => {
				if (e.target == this.inputDateFrom ||
					e.target == this.inputDateTo) {
					let dateArr = [];
					if (e.target.value) { //Если введена дата
						this.currentInput = e.target;
						this.currentInput.classList.contains(
							'date__input-from') ?
							this.secondInput = this.inputDateTo :
							this.secondInput = this.inputDateFrom;
						let a = this.currentInput.value.split('.');
						let b = this.secondInput.value.split('.');
						if (this.secondInput.value) {// заполнены оба инпута
							dateArr.push(b[2] + '-' + b[1] + '-' + b[0]);
							dateArr.push(a[2] + '-' + a[1] + '-' + a[0]);
							this.myDatepicker.clear();
							this.myDatepicker.selectDate(new Date(dateArr[0]));
							this.myDatepicker.selectDate(new Date(dateArr[1]));
						} else {//заполнен один инпут
							dateArr.push(a[2] + '-' + a[1] + '-' + a[0]);
							this.myDatepicker.selectDate(new Date(dateArr[0]));
						}
					} else {//Если инпут очищен
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
	}
}

new DatePicker(".date__wrapper-dateDropDown", false);
new DatePicker(".date__wrapper-dateFilter", true);

