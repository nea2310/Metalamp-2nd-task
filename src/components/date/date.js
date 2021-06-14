


// onShow: function onShow() {
// 	$('.date__input-left').datepicker({
// 		minDate: new Date("2021-06-26")
// 	});
// }





class DatePicker {
	constructor(root) {
		this.wrapper = document.querySelector(root);
		this.inputLeft = this.wrapper.querySelector('.date__input-left');
		this.inputRight = this.wrapper.querySelector('.date__input-right');
		this.clWrapper = this.wrapper.querySelector('.date__calendarWrapper');
		this.init();

	}

	init() {

		this.myDatepicker = $(this.clWrapper).datepicker({
			minDate: new Date(),
			range: true,
			onSelect: (selectedDate) => {
				let arr = selectedDate.split(',');
				console.log(arr);
				if (arr.length == 1) {
					this.inputLeft.value = arr[0];
					this.inputRight.value = '';
				} else {
					this.inputLeft.value = arr[0];
					this.inputRight.value = arr[1];
				}
			}
		}).data('datepicker');
	}
}

new DatePicker('.date__wrapper');
