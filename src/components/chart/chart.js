
class Chart {
	constructor(elemName, elem, options) {
		this.elemName = elemName.replace(/^./, '');
		this.options = options;
		this.canvas = elem;
		this.colors = options.colors;
		this.borderColor = options.borderColor;
		if (this.canvas.getContext) {
			this.ctx = this.canvas.getContext('2d');
			// drawing code here
		} else {
			// canvas-unsupported code here
		}




		//	this.render();
		this.getColors();
		this.draw();

	}

	getElem(selector, wrapper = this.wrapper) {
		return wrapper.
			querySelector('.' + this.elemName + '__' + selector);
	}

	// render() {
	// 	this.wrapper.width = 300;
	// 	this.wrapper.height = 300;
	// 	this.ctx = this.wrapper.getContext('2d');
	// 	this.colors = ['#fde23e', '#f16e23', '#57d9ff', '#937e88'];

	// 	this.myVinyls = {
	// 		'Classical music': 10,
	// 		'Alternative rock': 14,
	// 		'Pop': 2,
	// 		'Jazz': 12
	// 	};
	// }


	getColors() {

		let center = { 'x': this.canvas.width, 'y': this.canvas.height };
		let radiusQ = 180;

		let quadrants = [
			{
				'x1': center.x,
				'y1': center.y - radiusQ,
				'x2': center.x + radiusQ,
				'y2': center.y,
				'colorStops': [
					{ 'stop': 0, 'color': '#6FCF97' },
					{ 'stop': 1, 'color': '#66D2EA' }
				]
			},
			{
				'x1': center.x + radiusQ,
				'y1': center.y,
				'x2': center.x,
				'y2': center.y + radiusQ,
				'colorStops': [
					{ 'stop': 0, 'color': '#FFE39C' },
					{ 'stop': 1, 'color': '#FFBA9C' }
				]
			},
			{
				'x1': center.x,
				'y1': center.y - radiusQ,
				'x2': center.x + radiusQ,
				'y2': center.y,
				'colorStops': [
					{ 'stop': 0, 'color': '#BC9CFF' },
					{ 'stop': 1, 'color': '#8BA4F9' }
				]
			},
			{
				'x1': center.x - radiusQ,
				'y1': center.y,
				'x2': center.x,
				'y2': center.y - radiusQ,
				'colorStops': [
					{ 'stop': 0, 'color': '#909090' },
					{ 'stop': 1, 'color': '#3D4975' }
				]
			}
		];

		this.color = [];

		for (let item of quadrants) {
			let grad = this.ctx.createLinearGradient(
				item.x1,
				item.y1,
				item.x2,
				item.y2);

			for (let cs of item.colorStops) {
				grad.addColorStop(cs.stop, cs.color);
			}
			this.color.push(grad);
		}

		//	return color;
		console.log(this.color);
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
		let colorIndex = 0;
		for (let categ in this.options.data) {
			let val = this.options.data[categ];
			totalValue += val;
		}
		let startAngle = 0;
		for (let categ in this.options.data) {
			let val = this.options.data[categ];
			let sliceAngle = 2 * Math.PI * val / totalValue;
			//Сектора
			drawPieSlice(
				this.ctx,
				this.canvas.width / 2,
				this.canvas.height / 2,
				Math.min(this.canvas.width / 2, this.canvas.height / 2),
				startAngle,
				startAngle + sliceAngle,
				this.color[colorIndex % this.color.length],
				true
			);

			// Обводка секторов
			drawPieSlice(
				this.ctx,
				this.canvas.width / 2,
				this.canvas.height / 2,
				Math.min(this.canvas.width / 2, this.canvas.height / 2),
				startAngle,
				startAngle + sliceAngle,
				this.borderColor,
				false
			);
			startAngle += sliceAngle;
			colorIndex++;
		}

		//Центр диаграммы
		if (this.options.doughnutHoleSize) {
			drawPieSlice(
				this.ctx,
				this.canvas.width / 2,
				this.canvas.height / 2,
				this.options.doughnutHoleSize *
				Math.min(this.canvas.width / 2, this.canvas.height / 2),
				0,
				2 * Math.PI,
				this.borderColor,
				true
			);
		}
	}





}

function renderCharts(selector) {
	let charts = document.querySelectorAll(selector);
	for (let chart of charts) {
		new Chart(selector, chart, {
			data: {
				'Хорошо': 65,
				'Великолепно': 130,
				'Удовлетворительно': 65,
				'Разочарован': 0
			},
			colors: ['#fde23e', '#f16e23', '#57d9ff', '#937e88'],
			borderColor: '#fff',
			doughnutHoleSize: 0.5
		});
	}
}
renderCharts('.chart');




