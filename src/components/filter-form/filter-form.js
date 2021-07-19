
class FilterForm {
	constructor(elemName, elem) {
		this.elemName = elemName.replace(/^./, '');
		this.wrapper = elem;
		this.render();
		this.toggleForm();
	}

	getElem(selector, wrapper = this.wrapper) {
		return wrapper.
			querySelector('.' + this.elemName + '__' + selector);
	}

	render() {
		this.btn = this.wrapper.querySelector('.btn');
		this.form = this.getElem('wrapper');
	}

	// клик по инпуту
	toggleForm() {
		this.btn.addEventListener("click", () => {
			this.form.classList.toggle(`${this.elemName}__wrapper_hidden`);
			this.wrapper.classList.toggle(`${this.elemName}_hidden`);
			console.log(this.btn.innerText);
			let text = this.btn.innerText;
			text == 'Показать фильтр'.toUpperCase() ?
				this.btn.innerText = 'Скрыть фильтр'.toUpperCase()
				: this.btn.innerText = 'Показать фильтр'.toUpperCase();
		});
	}
}

function renderFilterForms(selector) {
	let filterForms = document.querySelectorAll(selector);
	for (let filterForm of filterForms) {
		new FilterForm(selector, filterForm);
	}
}
renderFilterForms('.filter-form');

