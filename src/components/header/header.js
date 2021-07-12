class Header {
	constructor(elemName, elem) {
		this.elemName = elemName.replace(/^./, '');
		this.wrapper = elem;
		this.render();
	}
	getElem(selector, wrapper = this.wrapper) {
		return wrapper.
			querySelector('.' + this.elemName + '__' + selector);
	}

	getElems(selectors) {
		let sel = '';
		for (let selector of selectors) {
			sel += '.' + this.elemName + '__' + selector + ',';
		}
		sel = sel.substring(0, sel.length - 1);
		return this.wrapper.
			querySelectorAll(sel);
	}
	render() {
		this.burger = this.getElem('burger');
		this.navLevel1 = this.getElem('nav-level1');
		this.navLevel2 = this.getElems(['nav-level2']);
		this.tips = this.getElems(['nav-level1-item-img']);

		this.navLevel1.addEventListener('mouseover', (e) => {
			this.toggleLevel2Menu(e.relatedTarget);
			this.toggleLevel2Menu(e.target);
		});

		this.tips.forEach(element => {
			element.addEventListener('click', () => {
				this.toggleLevel2Menu(element);
			});
		});

		this.burger.addEventListener('click', (e) => {
			this.toggleMobileMenu();
		});

		this.burger.addEventListener('keypress', (e) => {
			if (e.keyCode == 13) {
				this.toggleMobileMenu();
			}
		});

		document.addEventListener('click', (e) => {
			if (!e.target.closest(`.${this.elemName}__nav-level2`)) {
				for (let item of this.navLevel2) {
					item.classList.remove('expanded');
				}
			}
		});
	}

	// показать/ скрыть меню второго уровня
	toggleLevel2Menu(elem) {
		//для ссылки
		if (elem.
			matches(`.${this.elemName}__nav-level1-item-link`) &&
			elem.firstElementChild != null &&
			elem.firstElementChild.
				matches(`.${this.elemName}__nav-level1-item-img`)
		) {
			this.closeLevel2Menu();
			elem.parentElement.
				lastElementChild.classList.add('expanded');
		}
		// для стрелки
		else if (elem.
			matches(`.${this.elemName}__nav-level1-item-img`)) {
			this.closeLevel2Menu();
			elem.parentElement.parentElement.
				lastElementChild.classList.add('expanded');
		}
	}

	//скрыть меню второго уровня
	closeLevel2Menu() {
		for (let item of this.navLevel2) {
			item.classList.remove('expanded');
		}
	}
	// показать/ скрыть мобильное меню
	toggleMobileMenu() {
		this.burger.classList.toggle('active');
		this.nav.classList.toggle('active-nav');
	}
}

function renderHeaders(selector) {
	let headers = document.querySelectorAll(selector);
	for (let header of headers) {
		new Header(selector, header);
	}
}
renderHeaders('.header');