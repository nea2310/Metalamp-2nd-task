class RangeSlider {
	constructor(elemName, elem) {
		this.elemName = elemName;
		this.wrapper = elem;
		this.render();


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
		this.slider = this.wrapper.querySelector('.js-range-slider__slider');
		this.price = this.wrapper.querySelector('.js-range-slider__price');
		this.init();
	}

	init() {
		const { price } = this;
		//	console.log(price);
		$(this.slider).ionRangeSlider({
			onStart(data) {
				console.log(price);
				const { from, to } = data;
				console.log(from);
				console.log(to);
				price.value = (`${from.toLocaleString()}₽ -
				 ${to.toLocaleString()}₽`);
			},

			onChange(data) {
				const { from, to } = data;
				price.value = (`${from.toLocaleString()}₽ -
				 ${to.toLocaleString()}₽`);
			}

		});
	}


}

function renderRangeSliders() {
	let rangeSliders = document.querySelectorAll('.range-slider');
	for (let rangeSlider of rangeSliders) {
		new RangeSlider('range-slider', rangeSlider);
	}
}
renderRangeSliders();