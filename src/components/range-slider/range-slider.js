class RangeSlider {
	constructor(elemName, elem) {
		this.elemName = elemName;
		this.wrapper = elem;
		//		this.render();

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

	}


}

function renderRangeSliders() {
	let rangeSliders = document.querySelectorAll('.range-slider');
	for (let rangeSlider of rangeSliders) {
		new RangeSlider('range-slider', rangeSlider);
	}
}
//renderRangeSliders();