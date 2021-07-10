class RoomCard {
	constructor(elemName, elem) {
		this.elemName = elemName;
		this.wrapper = elem;
		this.render();
		this.createDots();
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
		this.slider = this.getElem('slider');
		this.btnPrev = this.getElem('prev');
		this.btnNext = this.getElem('next');
		this.images = this.getElems(['photo']);
		this.imagesArr = Array.from(this.images);
		// this.dots = this.getElems(['dot']);
		// this.dotsArr = Array.from(this.dots);
		this.btnPrev.addEventListener('click', () => this.prev());
		this.btnNext.addEventListener('click', () => this.next());
		this.i = 0;
	}


	prev() {
		//определяем текущее фото
		let currentPhoto = this.imagesArr.find(item =>
			item.classList.contains(`${this.elemName}__photo_showed`));
		//определяем текущую точку
		let currentDot = this.dotsArr.find(item =>
			item.classList.contains(`${this.elemName}__dot_active`));
		let i = parseInt(currentPhoto.getAttribute('data-sec'));
		let newPhoto;
		let newDot;
		if (i != 1) {
			newPhoto = this.imagesArr.find(item =>
				item.getAttribute('data-sec') ==
				i - 1);
			newDot = this.dotsArr.find(item =>
				item.getAttribute('data-sec') ==
				i - 1);
		} else {
			newPhoto = this.imagesArr.find(item =>
				item.getAttribute('data-sec') ==
				this.images.length);
			newDot = this.dotsArr.find(item =>
				item.getAttribute('data-sec') ==
				this.images.length);
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

	next() {
		//определяем текущее фото
		let currentPhoto = this.imagesArr.find(item =>
			item.classList.contains(`${this.elemName}__photo_showed`));
		//определяем текущую точку
		let currentDot = this.dotsArr.find(item =>
			item.classList.contains(`${this.elemName}__dot_active`));

		let i = parseInt(currentPhoto.getAttribute('data-sec'));
		let newPhoto;
		let newDot;
		if (i != this.images.length) {
			newPhoto = this.imagesArr.find(item =>
				item.getAttribute('data-sec') ==
				i + 1);
			newDot = this.dotsArr.find(item =>
				item.getAttribute('data-sec') ==
				i + 1);
		} else {
			newPhoto = this.imagesArr.find(item =>
				item.getAttribute('data-sec') ==
				'1');
			newDot = this.dotsArr.find(item =>
				item.getAttribute('data-sec') ==
				'1');
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
		for (let i = 1; i <= this.imagesArr.length; i++) {
			let dot = document.createElement('div');
			dot.classList.add(this.elemName + '__dot');
			dot.classList.add(this.elemName + '__dot');
			dot.setAttribute('data-sec', i);
			this.dotsWrapper.append(dot);
		}
		this.dots = this.getElems(['dot']);
		this.dots[0].classList.add(`${this.elemName}__dot_active`);
		this.dotsArr = Array.from(this.dots);
	}

	clickDot() {
		this.dots.forEach((dot) => {
			//dot - точка, по которой кликнули (должна стать активной)
			dot.addEventListener('click', () => {
				console.log('CLICK');
				let sec = dot.getAttribute('data-sec');
				//определяем текущее фото
				let currentPhoto = this.imagesArr.find(item =>
					item.classList.contains(`${this.elemName}__photo_showed`));
				//определяем активную точку
				let currentDot = this.dotsArr.find(item =>
					item.classList.contains(`${this.elemName}__dot_active`));
				//определяем новое фото (атрибут data-sec равен атрибуту data-sec нажатой точки [т.е. новой активной])
				let newPhoto = this.imagesArr.find(item =>
					item.getAttribute('data-sec') ==
					sec);
				//скрываем текущее фото	
				currentPhoto.classList.remove(`${this.elemName}__photo_showed`);
				//обесцвечиваем текущую точку
				currentDot.classList.remove(`${this.elemName}__dot_active`);
				// отображаем новое фото
				newPhoto.classList.add(`${this.elemName}__photo_showed`);
				//закрашиваем новую точку
				dot.classList.add(`${this.elemName}__dot_active`);
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