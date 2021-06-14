class DatePicker {
	constructor(root) {
		this.wrapper = document.querySelector(root);
		this.inputLeft = this.wrapper.querySelector('.date__input-left');
		this.inputRight = this.wrapper.querySelector('.date__input-right');
		this.clWrapper = this.wrapper.querySelector('.date__calendarWrapper');
		this.datePick();
		this.datePrint();

	}
	/*Выбор даты в календаре*/
	datePick() {
		this.myDatepicker = $(this.clWrapper).datepicker({
			minDate: new Date(),
			range: true,
			multipleDates: true,
			onSelect: (selectedDate) => {
				let arr = selectedDate.split(',');
				let val;
				if (arr.length == 1) {
					val = '';
				} else {
					val = arr[1];
				}
				this.inputLeft.value = arr[0];
				this.inputRight.value = val;
			}
		}).data('datepicker');
	}

	/*Ввод даты в инпут с клавиатуры или очистка инпута*/
	datePrint() {
		this.wrapper.addEventListener('change', (e) => {
			if (e.target == this.inputLeft || e.target == this.inputRight) {
				let arr = [];
				if (e.target.value) { //Если введена дата
					let a = e.target.value.split('.');
					arr.push(a[2] + '-' + a[1] + '-' + a[0]);
					this.myDatepicker.selectDate(new Date(arr[0]));
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
