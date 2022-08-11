import CheckList from './checklist';

function renderCheckLists(selector) {
  const checkLists = document.querySelectorAll(selector);
  checkLists.forEach((checkList) => new CheckList(selector, checkList));
}
renderCheckLists('.js-checklist');
