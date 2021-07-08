class Booking {
	constructor(elemName, elem) {
		this.elemName = elemName;
		this.wrapper = elem;
		//	this.render();

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
	}


}

function renderBookings() {
	let bookings = document.querySelectorAll('.booking');
	for (let booking of bookings) {
		new Booking('booking', booking);
	}
}
//renderBookings();