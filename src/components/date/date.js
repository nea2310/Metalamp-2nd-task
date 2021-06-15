class DatePicker {
	constructor(root) {
		this.wrapper = document.querySelector(root);
		this.inputLeft = this.wrapper.querySelector('.date__input-left');
		this.inputRight = this.wrapper.querySelector('.date__input-right');
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
				if (this.inputRight.value) {
					let dateArr = [];
					let a = this.inputLeft.value.split('.');
					let b = this.inputRight.value.split('.');

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
			minDate: new Date(),
			range: true,
			multipleDates: true,
			onSelect: (selectedDate) => {
				let dateArr = selectedDate.split(',');
				if (dateArr.length == 2) {// если выбран диапазон
					datePrevArr = dateArr;
				}
				if (dateArr.length == 1) {//если выбрана одиночная дата
					if (datePrevArr == undefined) {//первичный выбор первой даты (вторая еще не выбиралась)
						this.inputLeft.value = dateArr[0];
						this.inputRight.value = '';
					} else {/*очередной выбор даты, когда уже есть выбранный диапазон
						(в соотв. с дефолтными настройками календаря, при этом диапазон деактивируется и активируется одиночная вновь выбранная дата)
						*/

						let a = dateArr[0].split('.');
						let b = datePrevArr[0].split('.');
						let c = datePrevArr[1].split('.');

						let currentDate =
							new Date(a[2] + '-' + a[1] + '-' + a[0]);
						let prevDateLeft =
							new Date(b[2] + '-' + b[1] + '-' + b[0]);
						let prevDateRight =
							new Date(c[2] + '-' + c[1] + '-' + c[0]);

						if (currentDate < prevDateLeft) {//Новая дата раньше обеих старых дат
							this.myDatepicker.selectDate(currentDate);
							this.myDatepicker.selectDate(prevDateLeft);
						}
						else if
							(currentDate > prevDateLeft &&
							currentDate < prevDateRight) {//Новая дата между старыми датами
							this.myDatepicker.clear();
							this.myDatepicker.selectDate(prevDateLeft);
							this.myDatepicker.selectDate(currentDate);
						}
						else if (currentDate > prevDateRight) {//Новая дата позже обеих старых дат
							this.myDatepicker.clear();
							this.myDatepicker.selectDate(prevDateRight);
							this.myDatepicker.selectDate(currentDate);
						}
					}
				} else {//первичный выбор второй даты (первая дата уже выбрана)
					this.inputLeft.value = dateArr[0];
					this.inputRight.value = dateArr[1];
				}
			}
		}).data('datepicker');
	}

	/*Ввод даты в инпут с клавиатуры или очистка инпута*/
	datePrint() {
		this.wrapper.addEventListener('change', (e) => {

			if (e.target == this.inputLeft || e.target == this.inputRight) {
				let dateArr = [];
				if (e.target.value) { //Если введена дата
					this.currentInput = e.target;
					this.currentInput.classList.contains('date__input-left') ?
						this.secondInput = this.inputRight :
						this.secondInput = this.inputLeft;
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
					if (e.target == this.inputLeft) { // очищен левый инпут
						this.inputRight.value = '';// очистить правый инпут
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


