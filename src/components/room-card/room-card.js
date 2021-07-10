class RoomCard {
	constructor(elemName, elem) {
		this.elemName = elemName;
		this.wrapper = elem;
		this.render();
		this.btnPrev.addEventListener('click', () => this.prev());
		this.btnNext.addEventListener('click', () => this.next());

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
		this.btnPrev = this.getElem('prev');
		this.btnNext = this.getElem('next');
		this.images = this.getElems(['photo']);
		this.dots = this.getElems(['dot']);
		this.i = 0;
	}


	prev() {
		this.images[this.i].classList.remove('js-photo-showed');
		this.i--;
		if (this.i < 0) {
			this.i = this.images.length - 1;
		}
		this.images[this.i].classList.add('js-photo-showed');
	}

	next() {
		this.images[this.i].classList.remove('js-photo-showed');
		this.i++;

		if (this.i >= this.images.length) {
			this.i = 0;
		}

		this.images[this.i].classList.add('js-photo-showed');
	}


}

function renderRoomCards() {
	let roomCards = document.querySelectorAll('.room-card');
	for (let roomCard of roomCards) {
		new RoomCard('room-card', roomCard);
	}
}
renderRoomCards();