import getWordForm from '../../shared/utils/getWordForm';
import './chart.scss';

class Chart {
  constructor(element, elementName = 'chart') {
    this.elementName = elementName;
    this.wrapper = element;
    this.wordForms = ['голос', 'голоса', 'голосов'];

    this._render();
  }

  _render() {
    this.canvas = this.wrapper.querySelector(`.js-${this.elementName}__image`);
    if (this.canvas.getContext) {
      this.ctx = this.canvas.getContext('2d');
      this.legendItems = this.wrapper.querySelectorAll(`.js-${this.elementName}__legend-item`);
      this.data = {};
      this.colors = {
        good: { color1: '#66D2EA', color2: '#6FCF97' },
        excellent: { color1: '#FFBA9C', color2: '#FFE39C' },
        satisfied: { color1: '#8BA4F9', color2: '#BC9CFF' },
        bad: { color1: '#3D4975', color2: '#909090' },
      };
      this.legendItems = Array.from(this.legendItems).reverse();
      this.votes = 0;
      this.legendItems.forEach((item) => {
        const rate = item.getAttribute('data-rate');
        const mark = item.getAttribute('data-mark');
        this.data[item.innerText] = {
          rate,
          color1: this.colors[mark].color1,
          color2: this.colors[mark].color2,
        };
        this.votes += parseInt(rate, 10);
      });

      this._draw();
    }
    this._drawCircles();
    this._writeText();
  }

  _drawCircles() {
    this.legendItems.forEach((item) => {
      const circle = document.createElement('span');
      circle.className = `${this.elementName}__legend-item-mark`;
      circle.style.backgroundImage = `
        -webkit-gradient(
          linear, left bottom, left top, color-stop(
            0, ${this.colors[item.getAttribute('data-mark')].color1}
            ), color-stop(
              1, ${this.colors[item.getAttribute('data-mark')].color2}
            )
          )
        `;

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
        this.canvas.height / 2 - 2,
      );
      this.ctx.font = 'normal 15px Montserrat';
      this.ctx.fillStyle = '#BC9CFF';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(
        getWordForm(this.votes, this.wordForms),
        this.canvas.width / 2,
        this.canvas.height / 2 + 16,
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

    const values = Object.values(this.data);

    let totalValue = 0;
    const shift = (Math.PI / 180) * 270;
    values.forEach((item) => {
      const value = parseInt(item.rate, 10);
      totalValue += value;
    });

    let startAngle = 0;
    values.forEach((item) => {
      const value = parseInt(item.rate, 10);
      const sliceAngle = (2 * Math.PI * value) / totalValue;
      const color = {
        x1: this.canvas.width - 180,
        y1: this.canvas.height,
        x2: this.canvas.width,
        y2: this.canvas.height - 180,
        colorStops: [
          { stop: 0, color: item.color1 },
          { stop: 1, color: item.color2 },
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
    });

    drawPieSlice(
      this.ctx,
      this.canvas.width / 2,
      this.canvas.height / 2,
      0.92 * Math.min(this.canvas.width / 2, this.canvas.height / 2),
      0,
      2 * Math.PI,
      this.borderColor,
      true,
    );
  }
}

export default Chart;
