
class CheckList {
	constructor(elemName, elem) {
		this.elemName = elemName.replace(/^./, '');
		this.wrapper = elem;
		this.render();
		this.clickInput();
		this.focusInput();
		this.insideListClick();
		this.collapseByClick();
		this.insideListFocus();
		this.collapseByFocus();
	}

	getElem(selector, wrapper = this.wrapper) {
		return wrapper.
			querySelector('.' + this.elemName + '__' + selector);
	}

	render() {
		this.clickOnList = false;
		this.focusOnList = false;
		this.mouseDown = false;
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
		this.label.addEventListener("mousedown", () => {
			this.mouseDown = true;
		});
		this.label.addEventListener("mouseup", () => {
			this.toggle(true);
			this.mouseDown = false;
		});
	}

	// фокус на лейбл
	focusInput() {
		this.label.addEventListener("focus", (e) => {
			if (this.listWrapper.classList.
				contains(this.elemName + '__list-wrapper_hidden') &&
				this.mouseDown == false) {
				this.toggle(true);
			}
		});
	}

	//проверка, клик был снаружи или внутри списка
	insideListClick() {
		this.wrapper.addEventListener('click', (e) => {
			this.clickOnList = true;
		});
	}

	//отлавливаем все клики по документу, если клик снаружи виджета - сворачиваем виджет
	collapseByClick() {
		document.addEventListener("click", (e) => {
			if (e.target.closest(`.${this.elemName}` == null) ||
				this.clickOnList == false) {
				//	console.log('КЛИК СНАРУЖИ');
				this.toggle(false);
			}
			else {
				//	console.log('КЛИК ВНУТРИ');
				this.clickOnList = false;
			}
		});
	}

	//проверка, фокус был снаружи или внутри списка
	insideListFocus() {
		this.wrapper.addEventListener('focusin', (e) => {
			//	console.log('FOCUS INSIDE');
			this.focusOnList = true;
		});
	}

	//отлавливаем все фокусы по документу, если фокус снаружи виджета - сворачиваем виджет
	collapseByFocus() {
		document.addEventListener("focusin", (e) => {
			if (e.target.closest(`.${this.elemName}` == null) ||
				this.focusOnList == false) {
				//	console.log('ФОКУС СНАРУЖИ');
				this.toggle(false);
			} else {
				//	console.log('ФОКУС ВНУТРИ');
				this.focusOnList = false;
			}
		});
	}
}

function renderCheckLists(selector) {
	let checkLists = document.querySelectorAll(selector);
	for (let checkList of checkLists) {
		new CheckList(selector, checkList);
	}
}
renderCheckLists('.checklist');

