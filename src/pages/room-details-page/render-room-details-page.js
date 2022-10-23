import Booking from '../../components/booking/Booking';
import Chart from '../../components/chart/Chart';
import Feedback from '../../components/feedback/Feedback';
import render from '../../shared/render/render';

const components = [
  { booking: Booking },
  { chart: Chart },
  { feedback: Feedback },
];

const selectorName = '.js-room-details-page';
const page = document.querySelector(selectorName);

if (page) {
  render(components, page, selectorName);
}
