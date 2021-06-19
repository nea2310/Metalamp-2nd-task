class DateFilter {
	constructor(root) {
		this.wrapper = document.querySelector(root);
		this.inputDate = this.wrapper.querySelector('.date__input');
		this.clWrapper = this.wrapper.querySelector('.dateFilter__input');
		// this.btnClear = this.wrapper.querySelector('.date__button-clear');
		// this.btnApply = this.wrapper.querySelector('.date__button-apply');

		this.datePick();
	}


	/*Выбор даты в календаре*/
	datePick() {
		console.log(this.clWrapper);
		let datePrevArr;
		this.myDatepicker = $(this.clWrapper).datepicker({
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
						// this.inputDateFrom.value = dateArr[0];
						// this.inputDateTo.value = '';
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
					// this.inputDateFrom.value = dateArr[0];
					// this.inputDateTo.value = dateArr[1];
				}
			}
		}).data('datepicker');
	}


}


new DateFilter("#dateFilter__wrapper");



