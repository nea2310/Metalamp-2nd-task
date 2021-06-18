class DatePicker {
	constructor(root) {
		this.wrapper = document.querySelector(root);
		this.inputDateFrom = this.wrapper.querySelector('.date__input-from');
		this.inputDateTo = this.wrapper.querySelector('.date__input-to');
		this.clWrapper = this.wrapper.querySelector('.date__calendarWrapper');
		this.datePick();
		this.datePrint();
		this.preventDateReset();

	}




	/*Запретить деактивацию ранее выбранной даты при повторном клике на нее же*/
	preventDateReset() {
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

	/*Выбор даты в календаре*/
	datePick() {
		let datePrevArr;
		this.myDatepicker = $(this.clWrapper).datepicker({
			clearButton: true,
			navTitles: {
				days: 'MM <i>yyyy</i>',
			},
			minDate: new Date(),
			range: true,
			multipleDates: true,
			prevHtml: `<svg width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M16.1755 8.01562V9.98438H3.98801L9.56613 15.6094L8.15988 
			17.0156L0.144258 9L8.15988 0.984375L9.56613 2.39062L3.98801 
			8.01562H16.1755Z" fill="#BC9CFF"/>
			</svg>`,
			nextHtml: `<svg width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M8.36301 0.984375L16.3786 9L8.36301 17.0156L6.95676 
			15.6094L12.5349 9.98438H0.347383V8.01562H12.5349L6.95676
			 2.39062L8.36301 0.984375Z" fill="#BC9CFF"/>
			</svg>`,
			onSelect: (selectedDate) => {
				let dateArr = selectedDate.split(',');
				if (dateArr.length == 2) {// если выбран диапазон
					datePrevArr = dateArr;
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
		}).data('datepicker');
	}

	/*Ввод даты в инпут с клавиатуры или очистка инпута*/
	datePrint() {
		//обработчик кастомного события окончания ввода в инпут по маске ДД.ММ.ГГГГ
		this.wrapper.addEventListener('inputDate', (e) => {
			if (e.target == this.inputDateFrom ||
				e.target == this.inputDateTo) {
				let dateArr = [];
				if (e.target.value) { //Если введена дата
					this.currentInput = e.target;
					this.currentInput.classList.contains('date__input-from') ?
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

new DatePicker('#date__wrapper');

