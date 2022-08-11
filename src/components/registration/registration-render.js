import Registration from './registration';

function renderRegistrations(selector) {
  const registrations = document.querySelectorAll(selector);
  registrations.forEach((registration) => new Registration(selector, registration));
}
renderRegistrations('.js-registration');
