class RoomCard {
	constructor(elemName, elem) {
		this.elemName = elemName;
		this.wrapper = elem;
		this.render();
		this.clickDot();

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
		this.imagesArr = Array.from(this.images);
		this.dots = this.getElems(['dot']);
		this.dotsArr = Array.from(this.dots);
		this.btnPrev.addEventListener('click', () => this.prev());
		this.btnNext.addEventListener('click', () => this.next());
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

	clickDot() {
		this.dots.forEach((dot) => {
			//dot - точка, по которой кликнули (должна стать активной)
			dot.addEventListener('click', (e) => {
				let sec = dot.getAttribute('data-sec');
				//определяем текущее фото
				let currentPhoto = this.imagesArr.find(item =>
					item.classList.contains('js-photo-showed'));
				//определяем активную точку
				let currentDot = this.dotsArr.find(item =>
					item.classList.contains('js-dot-active'));
				//определяем новое фото (атрибут data-sec равен атрибуту data-sec нажатой точки [т.е. новой активной])
				let newPhoto = this.imagesArr.find(item =>
					item.getAttribute('data-sec') ==
					sec);
				//скрываем текущее фото	
				currentPhoto.classList.remove('js-photo-showed');
				//обесцвечиваем текущую точку
				currentDot.classList.remove('js-dot-active');
				// отображаем новое фото
				newPhoto.classList.add('js-photo-showed');
				//закрашиваем новую точку
				dot.classList.add('js-dot-active');
			});
		});
	}
}

function renderRoomCards() {
	let roomCards = document.querySelectorAll('.room-card');
	console.log(roomCards);
	for (let roomCard of roomCards) {
		new RoomCard('room-card', roomCard);
	}
}
renderRoomCards();