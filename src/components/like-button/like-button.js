
class LikeButton {
	constructor(elemName, elem) {
		this.elemName = elemName;
		this.wrapper = elem;
		// this.render();
		// this.clickInput();

	}

	getElem(selector, wrapper = this.wrapper) {
		return wrapper.
			querySelector('.' + this.elemName + '__' + selector);
	}

	render() {
		this.clicked = false;
		this.clickedInside = false;
		this.label = this.getElem('label');
		this.listWrapper = this.getElem('list-wrapper');
		this.tip = this.getElem('img');
		this.clickOnList = false;
	}

	// Открывание/ закрывание дропдауна
	toggle(flag) {
		let wrap = this.elemName + '__';
		if (this.label.classList.contains(wrap + 'label_collapsing') ||
			this.label.classList.contains(wrap + 'label_expanded')) {
			if (flag) {
				this.listWrapper.classList.
					toggle(wrap + 'list-wrapper_hidden');
				this.tip.classList.toggle(wrap + 'img-expanded');
				this.tip.classList.toggle(wrap + 'img_collapsed');
			} else {
				this.listWrapper.classList.
					add(wrap + 'list-wrapper_hidden');
				this.tip.classList.remove(wrap + 'img-expanded');
				this.tip.classList.add(wrap + 'img_collapsed');
			}
		}
	}
	// клик по лейблу
	clickInput() {
		this.label.addEventListener("click", () => {
			this.toggle(true);
		});
	}




}

function renderLikeButtons() {
	let likeButtons = document.querySelectorAll('.like-button');
	for (let likeButton of likeButtons) {
		new LikeButton('like-button', likeButton);
	}
}
renderLikeButtons();

