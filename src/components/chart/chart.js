import './chart.scss';

class Chart {
  constructor(elementName, element) {
    this.elementName = elementName.replace(/^.js-/, '');
    this.wrapper = element;
    this._render();
    this._drawCircles();
    this._writeText();
  }

  _render() {
    this.canvas = this._getElement('image');
    if (this.canvas.getContext) {
      this.ctx = this.canvas.getContext('2d');
      this.legendItems = this._getElements(['legend-item']);
      this.data = {};
      this.colors = {
        good:
          { color1: '#66D2EA', color2: '#6FCF97' },
        excellent:
          { color1: '#FFBA9C', color2: '#FFE39C' },
        satisfied:
          { color1: '#8BA4F9', color2: '#BC9CFF' },
        bad:
          { color1: '#3D4975', color2: '#909090' },
      };
      const getColor = (rateType) => this.colors[rateType];
      this.legendItems = Array.from(this.legendItems).reverse();
      this.votes = 0;
      this.legendItems.forEach((item) => {
        const rate = item.getAttribute('data-rate');
        const mark = item.getAttribute('data-mark');
        this.data[item.innerText] = {
          rate,
          color1:
            getColor(mark).color1,
          color2:
            getColor(mark).color2,
        };
        this.votes += parseInt(rate, 10);
      });

      this._draw();
    }
  }

  _drawCircles() {
    const getColor = (rateType) => this.colors[rateType];
    this.legendItems.forEach((item) => {
      const circle = document.createElement('span');
      circle.className = `${this.elementName}__legend-item-mark`;
      circle.style.backgroundImage = `-webkit-gradient(linear, left bottom, left top, color-stop(0, 
      ${getColor(item.getAttribute('data-mark')).color1}), 
      color-stop(1,
      ${getColor(item.getAttribute('data-mark')).color2})`;
      item.prepend(circle);
      const label = document.createElement('span');
      label.className = `${this.elementName}__legend-item-label`;
      label.innerText = item.getAttribute('data-rate');
      item.prepend(label);
    });
  }

  _writeText() {
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

  _draw() {
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
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      if (isFilled) ctx.fill();
      else ctx.stroke();
    };

    const keys = Object.keys(this.data);
    const values = Object.values(this.data);

    let totalValue = 0;
    const shift = (Math.PI / 180) * 270;
    for (let i = 0; i < keys.length; i += 1) {
      const value = parseInt(values[i].rate, 10);
      totalValue += value;
    }

    let startAngle = 0;
    for (let i = 0; i < keys.length; i += 1) {
      const value = parseInt(values[i].rate, 10);
      const sliceAngle = (2 * Math.PI * value) / totalValue;
      const color = {
        x1: this.canvas.width - 180,
        y1: this.canvas.height,
        x2: this.canvas.width,
        y2: this.canvas.height - 180,
        colorStops: [
          { stop: 0, color: values[i].color1 },
          { stop: 1, color: values[i].color2 },
        ],
      };

      const grad = this.ctx.createLinearGradient(
        color.x1,
        color.y1,
        color.x2,
        color.y2,
      );

      color.colorStops.forEach((cs) => grad.addColorStop(cs.stop, cs.color));

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

  _getElement(selector, wrapper = this.wrapper) {
    return wrapper
      .querySelector(`.js-${this.elementName}__${selector}`);
  }

  _getElements(selectors) {
    let sel = '';
    selectors.forEach((selector) => { sel += `.js-${this.elementName}__${selector},`; });
    sel = sel.substring(0, sel.length - 1);
    return this.wrapper
      .querySelectorAll(sel);
  }
}

function renderCharts(selector) {
  const charts = document.querySelectorAll(selector);
  charts.forEach((booking) => new Chart(selector, booking));
}
renderCharts('.js-chart');
