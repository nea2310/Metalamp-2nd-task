class RangeSlider {
	constructor(elemName, elem) {
		this.elemName = elemName.replace(/^./, '');
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
		this.slider = this.getElem('slider');
		this.price = this.getElem('price');

		this.init();
	}

	init() {
		const { price } = this;
		let displayPrice = (data) => {
			const { from, to } = data;
			price.innerText = from.toLocaleString() + '₽ - '
				+ to.toLocaleString() + '₽';
		};
		$(this.slider).ionRangeSlider({
			onStart(data) {
				displayPrice(data);
				console.log(data.slider);
			},
			onChange(data) {
				displayPrice(data);
			}
		});
		this.from = this.wrapper.querySelector('.from');
		this.to = this.wrapper.querySelector('.to');
		this.from.setAttribute('tabindex', '0');
		this.to.setAttribute('tabindex', '0');
	}
}

function renderRangeSliders(selector) {
	let rangeSliders = document.querySelectorAll(selector);
	for (let rangeSlider of rangeSliders) {
		new RangeSlider(selector, rangeSlider);
	}
}
renderRangeSliders('.range-slider');