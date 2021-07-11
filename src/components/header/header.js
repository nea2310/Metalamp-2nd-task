class Header {
	constructor(elemName, elem) {
		this.elemName = elemName.replace(/^./, '');
		this.wrapper = elem;
		this.render();
	}

	render() {
		this.form = this.wrapper.
			querySelector(`.${this.elemName}__login-form`);
		this.inputs = this.wrapper.
			querySelectorAll('.input-field__input');
	}



}

function renderHeaders(selector) {
	let headers = document.querySelectorAll(selector);
	for (let header of headers) {
		new Header(selector, header);
	}
}
//renderHeaders('.header');