import Chart from './Chart';

function renderCharts(selector) {
  const charts = document.querySelectorAll(selector);
  charts.forEach((chart) => new Chart(selector, chart));
}
renderCharts('.js-chart');
