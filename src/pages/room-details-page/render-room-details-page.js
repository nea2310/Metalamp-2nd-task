import Booking from '../../components/booking/Booking';
import Chart from '../../components/chart/Chart';
import Feedback from '../../components/feedback/Feedback';

const components = [
  { booking: Booking },
  { chart: Chart },
  { feedback: Feedback },
];

(() => {
  const selectorName = '.js-room-details-page';
  const page = document.querySelector(selectorName);

  if (page) {
    components.forEach((component) => {
      Object.entries(component).forEach(([key, Value]) => {
        const elements = page.querySelectorAll(`${selectorName}__${key}`);
        elements.forEach((item) => {
          const element = item.querySelector(`.js-${key}`);
          return new Value(`.js-${key}`, element);
        });
      });
    });
  }
})();
