
class FilterForm {
	constructor(elemName, elem) {
		this.elemName = elemName.replace(/^./, '');
		this.wrapper = elem;
		this.render();
		this.toggleForm();
		this.hideForm();
	}

	getElem(selector, wrapper = this.wrapper) {
		return wrapper.
			querySelector('.' + this.elemName + '__' + selector);
	}

	render() {
		this.btn = this.getElem('show-filter');
		this.form = this.getElem('wrapper');
	}


	toggleForm() {
		this.btn.addEventListener("click", () => {
			console.log('CLICK');
			this.form.classList.toggle(`${this.elemName}__wrapper_hidden`);
			this.wrapper.classList.toggle(`${this.elemName}_hidden`);
		});
	}

	hideForm() {
		window.addEventListener('resize', (e) => {
			console.log(window.innerWidth);
			if (window.innerWidth <= 575) {
				this.form.classList.add(`${this.elemName}__wrapper_hidden`);
				this.wrapper.classList.add(`${this.elemName}_hidden`);
			} else {
				this.form.classList.remove(`${this.elemName}__wrapper_hidden`);
				this.wrapper.classList.remove(`${this.elemName}_hidden`);
			}
		});



		window.addEventListener('load', (e) => {
			console.log(window.innerWidth);
			if (window.innerWidth <= 575) {
				this.form.classList.add(`${this.elemName}__wrapper_hidden`);
				this.wrapper.classList.add(`${this.elemName}_hidden`);
			}
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

