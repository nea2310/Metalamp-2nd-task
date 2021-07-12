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
	render() {
		this.burger = this.getElem('burger');
		this.nav = this.getElem('nav');
		this.burger.addEventListener('click', (e) => {
			this.toggleMobileMenu();
		});

		this.burger.addEventListener('keypress', (e) => {
			if (e.keyCode == 13) {
				this.toggleMobileMenu();
			}
		});

	}

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