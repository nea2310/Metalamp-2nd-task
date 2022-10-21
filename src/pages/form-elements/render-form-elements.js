import DropDown from '../../components/dropdown/Dropdown';
import DateDropDown from '../../components/date-dropdown/DateDropdown';
import CheckList from '../../components/checklist/CheckList';
import InputDate from '../../components/input-date/InputDate';
import InputEmail from '../../components/input-email/InputEmail';
import LikeButton from '../../components/like-button/LikeButton';
import RangeSlider from '../../components/range-slider/RangeSlider';
import Feedback from '../../components/feedback/Feedback';

const components = [
  { dropdown: DropDown },
  { 'date-dropdown': DateDropDown },
  { checklist: CheckList },
  { 'input-date': InputDate },
  { 'input-email': InputEmail },
  { 'like-button': LikeButton },
  { 'range-slider': RangeSlider },
  { feedback: Feedback },
];

(() => {
  const selectorName = '.js-form-elements';
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
