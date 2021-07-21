
class GoUpButton {
	constructor(elemName, elem) {
		this.elemName = elemName.replace(/^./, '');
		this.wrapper = elem;
		this.click();
		this.checkScroll();
	}


	checkScroll() {
		window.addEventListener('scroll', () => {
			if (window.pageYOffset >= 300) {
				this.wrapper.classList.remove(`${this.elemName}_hidden`);
			} else {
				this.wrapper.classList.add(`${this.elemName}_hidden`);
			}
		});
	}
	// клик по кнопке
	click() {
		this.wrapper.addEventListener('click', () => {
			window.scrollTo(0, 0);
		});
	}
}

function renderGoUpButtons(selector) {
	let goUpButtons = document.querySelectorAll(selector);
	for (let goUpButton of goUpButtons) {
		new GoUpButton(selector, goUpButton);
	}
}
renderGoUpButtons('.go-up-button');

