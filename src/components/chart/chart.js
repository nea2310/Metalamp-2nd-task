
class Chart {
	constructor(elemName, elem) {
		this.elemName = elemName.replace(/^./, '');
		this.wrapper = elem;
		this.render();


	}

	getElem(selector, wrapper = this.wrapper) {
		return wrapper.
			querySelector('.' + this.elemName + '__' + selector);
	}

	getElems(selectors) {
		let sel = '';
		for (let selector of selectors) {
			sel += '.' + this.elemName + '__' + selector + ',';
		}
		sel = sel.substring(0, sel.length - 1);
		return this.wrapper.
			querySelectorAll(sel);
	}

	render() {
		this.canvas = this.getElem('img');

		if (this.canvas.getContext) {
			this.ctx = this.canvas.getContext('2d');
			this.legendItems = this.getElems(['legend-item']);
			this.data = {};

			let colors = {
				'good':
					{ color1: '#6FCF97', color2: '#66D2EA' },
				'exc':
					{ color1: '#FFE39C', color2: '#FFBA9C' },
				'sat':
					{ color1: '#BC9CFF', color2: '#8BA4F9' },
				'bad':
					{ color1: '#909090', color2: '#3D4975' },
			};
			let getColor = (rateType, colorsObj) => colorsObj[rateType];
			console.log(Array.from(this.legendItems).reverse());
			this.legendItems = Array.from(this.legendItems).reverse();
			//создаем объект конфишурации
			for (let item of this.legendItems) {
				this.data[item.innerText] = {
					rate:
						item.getAttribute('data-rate'),
					color1:
						getColor(item.getAttribute('data-mark'), colors).color1,
					color2:
						getColor(item.getAttribute('data-mark'), colors).color2,
				};
			}
			this.draw();
		} else {
			// canvas-unsupported code here
		}

	}

	draw() {
		let drawPieSlice =
			(ctx, centerX, centerY, radius, startAngle,
				endAngle, color, isFilled) => {
				ctx.fillStyle = color;
				ctx.strokeStyle = color; // Цвет обводки
				ctx.lineWidth = 1; // Ширина линии
				ctx.beginPath();
				ctx.moveTo(centerX, centerY);
				ctx.arc(centerX, centerY, radius, startAngle, endAngle);
				ctx.closePath();
				isFilled ? ctx.fill() : ctx.stroke();
			};


		let totalValue = 0;
		let shift = (Math.PI / 180) * 270;

		for (let categ in this.data) {
			let val = parseInt(this.data[categ].rate);
			totalValue += val;
		}
		let startAngle = 0;
		for (let categ in this.data) {
			let val = parseInt(this.data[categ].rate);
			let sliceAngle = 2 * Math.PI * val / totalValue;
			let color = {
				'x1': this.canvas.width - 180,
				'y1': this.canvas.height,
				'x2': this.canvas.width,
				'y2': this.canvas.height - 180,
				'colorStops': [
					{ 'stop': 0, 'color': this.data[categ].color1 },
					{ 'stop': 1, 'color': this.data[categ].color2 }
				]
			};

			let grad = this.ctx.createLinearGradient(
				color.x1,
				color.y1,
				color.x2,
				color.y2);

			for (let cs of color.colorStops) {
				grad.addColorStop(cs.stop, cs.color);
			}

			//Сектора
			drawPieSlice(
				this.ctx,
				this.canvas.width / 2,
				this.canvas.height / 2,
				Math.min(this.canvas.width / 2, this.canvas.height / 2),
				startAngle + shift,
				startAngle + sliceAngle + shift,
				grad,
				true
			);

			// Обводка секторов
			drawPieSlice(
				this.ctx,
				this.canvas.width / 2,
				this.canvas.height / 2,
				Math.min(this.canvas.width / 2, this.canvas.height / 2),
				startAngle + shift,
				startAngle + sliceAngle + shift,
				'#fff',
				false
			);
			startAngle += sliceAngle;
		}

		//Центр диаграммы

		drawPieSlice(
			this.ctx,
			this.canvas.width / 2,
			this.canvas.height / 2,
			0.9 *
			Math.min(this.canvas.width / 2, this.canvas.height / 2),
			0,
			2 * Math.PI,
			this.borderColor,
			true
		);
	}
}

function renderCharts(selector) {
	let charts = document.querySelectorAll(selector);
	for (let chart of charts) {
		new Chart(selector, chart);
	}
}
renderCharts('.chart');




