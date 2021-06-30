
class CheckList {
	constructor(elemName, elem) {
		this.elemName = elemName;
		this.wrapper = elem;
		this.render();
		this.clickInput();
		this.insideListClick();
		this.collapseByClick();
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
		if (this.label.classList.contains(wrap + 'label_collapsed') ||
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
}

function renderCheckLists() {
	let checkLists = document.querySelectorAll('.checklist');
	for (let checkList of checkLists) {
		new CheckList('checklist', checkList);
	}
}
renderCheckLists();

