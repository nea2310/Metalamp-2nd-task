import './chart.scss';

class Chart {
  constructor(elemName, elem) {
    this.elemName = elemName.replace(/^.js-/, '');
    this.wrapper = elem;
    this.render();
    this.drawCircles();
    this.writeText();
  }

  getElem(selector, wrapper = this.wrapper) {
    return wrapper
      .querySelector(`.js-${this.elemName}__${selector}`);
  }

  getElems(selectors) {
    let sel = '';
    // разрешить for..of
    // eslint-disable-next-line no-restricted-syntax
    for (const selector of selectors) {
      sel += `.js-${this.elemName}__${selector},`;
    }
    sel = sel.substring(0, sel.length - 1);
    return this.wrapper
      .querySelectorAll(sel);
  }

  render() {
    this.canvas = this.getElem('img');
    if (this.canvas.getContext) {
      this.ctx = this.canvas.getContext('2d');
      this.legendItems = this.getElems(['legend-item']);
      this.data = {};
      this.colors = {
        good:
          { color1: '#66D2EA', color2: '#6FCF97' },
        exc:
          { color1: '#FFBA9C', color2: '#FFE39C' },
        sat:
          { color1: '#8BA4F9', color2: '#BC9CFF' },
        bad:
          { color1: '#3D4975', color2: '#909090' },
      };
      const getColor = (rateType) => this.colors[rateType];
      this.legendItems = Array.from(this.legendItems).reverse();
      // создаем объект конфигурации
      this.votes = 0;
      // разрешить for..of
      // eslint-disable-next-line no-restricted-syntax
      for (const item of this.legendItems) {
        const rate = item.getAttribute('data-rate');
        const mark = item.getAttribute('data-mark');
        this.data[item.innerText] = {
          rate,
          color1:
            getColor(mark).color1,
          color2:
            getColor(mark).color2,
        };
        this.votes += parseInt(rate);
      }
      this.draw();
    } else {
      // canvas-unsupported code here
    }
  }

  drawCircles() {
    // Градиентная заливка маркеров списка
    const getColor = (rateType) => this.colors[rateType];
    // разрешить for..of
    // eslint-disable-next-line no-restricted-syntax
    for (const item of this.legendItems) {
      const circle = document.createElement('span');
      circle.className = `${this.elemName}__legend-item-mark`;
      circle.style.backgroundImage = `-webkit-gradient(linear, left bottom, left top, color-stop(0, 
				${getColor(item.getAttribute('data-mark')).color1}), 
				color-stop(1,
					 ${getColor(item.getAttribute('data-mark')).color2})`;
      item.prepend(circle);

      // добавление скрытых DOM-элементов с кол-вом голосов (для экр. читалок)
      const label = document.createElement('span');
      label.className = `${this.elemName}__legend-item-label`;
      label.innerText = item.getAttribute('data-rate');
      item.prepend(label);
    }
  }

  writeText() {
    document.fonts.ready.then(() => {
      this.ctx.font = '700 24px Montserrat';
      this.ctx.fillStyle = '#BC9CFF';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(
        this.votes,
        this.canvas.width / 2,

        this.canvas.height / 2,
      );
      this.ctx.font = 'normal 15px Montserrat';
      this.ctx.fillStyle = '#BC9CFF';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(
        'голосов',
        this.canvas.width / 2,

        this.canvas.height / 2 + 20,
      );
    });
  }

  draw() {
    const drawPieSlice = (
      ctx,
      centerX,
      centerY,
      radius,
      startAngle,
      endAngle,
      color,
      isFilled,
    ) => {
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
    const shift = (Math.PI / 180) * 270;
    for (const categ in this.data) {
      const val = parseInt(this.data[categ].rate);
      totalValue += val;
    }
    let startAngle = 0;
    for (const categ in this.data) {
      const val = parseInt(this.data[categ].rate);
      const sliceAngle = 2 * Math.PI * val / totalValue;
      const color = {
        x1: this.canvas.width - 180,
        y1: this.canvas.height,
        x2: this.canvas.width,
        y2: this.canvas.height - 180,
        colorStops: [
          { stop: 0, color: this.data[categ].color1 },
          { stop: 1, color: this.data[categ].color2 },
        ],
      };

      const grad = this.ctx.createLinearGradient(
        color.x1,
        color.y1,
        color.x2,
        color.y2,
      );

      for (const cs of color.colorStops) {
        grad.addColorStop(cs.stop, cs.color);
      }

      // Сектора
      drawPieSlice(
        this.ctx,
        this.canvas.width / 2,
        this.canvas.height / 2,
        Math.min(this.canvas.width / 2, this.canvas.height / 2),
        startAngle + shift,
        startAngle + sliceAngle + shift,
        grad,
        true,
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
        false,
      );
      startAngle += sliceAngle;
    }

    // Центр диаграммы

    drawPieSlice(
      this.ctx,
      this.canvas.width / 2,
      this.canvas.height / 2,
      0.92
      * Math.min(this.canvas.width / 2, this.canvas.height / 2),
      0,
      2 * Math.PI,
      this.borderColor,
      true,
    );
  }
}

function renderCharts(selector) {
  const charts = document.querySelectorAll(selector);
  for (const chart of charts) {
    new Chart(selector, chart);
  }
}
renderCharts('.js-chart');
