
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
		//this.getColors();
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

		for (let categ in this.options.data) {
			let val = this.options.data[categ].rate;
			console.log(val);
			totalValue += val;
		}
		let startAngle = 0;
		for (let categ in this.options.data) {
			let val = this.options.data[categ].rate;
			let sliceAngle = 2 * Math.PI * val / totalValue;
			let color = {
				'x1': this.canvas.width - 180,
				'y1': this.canvas.height,
				'x2': this.canvas.width,
				'y2': this.canvas.height - 180,
				'colorStops': [
					{ 'stop': 0, 'color': this.options.data[categ].color1 },
					{ 'stop': 1, 'color': this.options.data[categ].color2 }
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
			console.log(grad);
			//Сектора
			drawPieSlice(
				this.ctx,
				this.canvas.width / 2,
				this.canvas.height / 2,
				Math.min(this.canvas.width / 2, this.canvas.height / 2),
				startAngle,
				startAngle + sliceAngle,
				grad,
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
				'Хорошо':
					{ rate: 65, color1: '#6FCF97', color2: '#66D2EA' },
				'Великолепно':
					{ rate: 130, color1: '#FFE39C', color2: '#FFBA9C' },
				'Удовлетворительно':
					{ rate: 65, color1: '#BC9CFF', color2: '#8BA4F9' },
				'Разочарован':
					{ rate: 0, color1: '#909090', color2: '#3D4975' },
			},

			borderColor: '#fff',
			doughnutHoleSize: 0.9
		});
	}
}
renderCharts('.chart');




