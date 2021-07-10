class RoomCard {
	constructor(elemName, elem) {
		this.elemName = elemName;
		this.wrapper = elem;
		this.render();
		this.createDots();
		//this.clickDot();

	}

	getElem(selector, wrapper = this.wrapper) {
		return wrapper.querySelector(
			'.' + this.elemName + '__' + selector);
	}
	getElemAdv(className, attrName, attrVal, wrap = this.wrapper) {
		return wrap.querySelector(
			'.' + this.elemName + '__' + className +
			'[' + attrName + '="' + attrVal + '"]');
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
		this.slider = this.getElem('slider');
		this.btnPrev = this.getElem('prev');
		this.btnNext = this.getElem('next');
		this.images = this.getElems(['photo']);
		this.btnPrev.addEventListener('click', (e) =>
			this.clickPrevNext(e.target));
		this.btnNext.addEventListener('click', (e) =>
			this.clickPrevNext(e.target));
	}


	clickPrevNext(elem) {
		//определяем текущее фото
		let currentPhoto = this.getElem('photo_showed');
		//определяем текущую точку
		let currentDot = this.getElem('dot_active');
		let i = parseInt(currentPhoto.getAttribute('data-sec'));
		let newPhoto;
		let newDot;
		//Кликнули [Назад]
		if (elem.className.match('prev')) {
			if (i != 1) {

				newPhoto = this.getElemAdv('photo', 'data-sec',
					i - 1);
				newDot = this.getElemAdv('dot', 'data-sec',
					i - 1);
			} else {
				newPhoto = this.getElemAdv('photo', 'data-sec',
					this.images.length);
				newDot = this.getElemAdv('dot', 'data-sec',
					this.images.length);

			}
			//Кликнули [Вперед]
		} else {
			if (i != this.images.length) {
				newPhoto = this.getElemAdv('photo', 'data-sec',
					i + 1);
				newDot = this.getElemAdv('dot', 'data-sec',
					i + 1);
			} else {

				newPhoto = this.getElemAdv('photo', 'data-sec', '1');
				newDot = this.getElemAdv('dot', 'data-sec', '1');
			}
		}
		//скрываем текущее фото	
		currentPhoto.classList.remove(`${this.elemName}__photo_showed`);
		// отображаем новое фото
		newPhoto.classList.add(`${this.elemName}__photo_showed`);
		//обесцвечиваем текущую точку
		currentDot.classList.remove(`${this.elemName}__dot_active`);
		// закрашиваем новую
		newDot.classList.add(`${this.elemName}__dot_active`);
	}


	createDots() {
		this.dotsWrapper = document.createElement('div');
		this.dotsWrapper.classList.add(this.elemName + '__dots');
		this.slider.append(this.dotsWrapper);
		for (let i = 1; i <= this.images.length; i++) {
			let dot = document.createElement('div');
			dot.classList.add(this.elemName + '__dot');
			dot.setAttribute('data-sec', i);
			this.dotsWrapper.append(dot);
		}
		this.dots = this.getElems(['dot']);
		this.dots[0].classList.add(`${this.elemName}__dot_active`);
		this.dots.forEach((dot) => {
			//dot - точка, по которой кликнули (должна стать активной)
			dot.addEventListener('click', () => this.clickDot(dot));
		});
	}


	clickDot(elem) {
		let sec = elem.getAttribute('data-sec');
		//определяем текущее фото
		let currentPhoto = this.getElem('photo_showed');
		//определяем активную точку
		let currentDot = this.getElem('dot_active');
		//определяем новое фото (атрибут data-sec равен атрибуту data-sec нажатой точки [т.е. новой активной])
		let newPhoto = this.getElemAdv('photo', 'data-sec', sec);
		//скрываем текущее фото	
		currentPhoto.classList.remove(`${this.elemName}__photo_showed`);
		//обесцвечиваем текущую точку
		currentDot.classList.remove(`${this.elemName}__dot_active`);
		// отображаем новое фото
		newPhoto.classList.add(`${this.elemName}__photo_showed`);
		//закрашиваем новую точку
		elem.classList.add(`${this.elemName}__dot_active`);
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