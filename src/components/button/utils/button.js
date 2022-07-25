/* eslint-disable import/prefer-default-export */
import * as utils from '../../../utils/helpers';

function prepareOptions(options) {
  let {
    type = 'button',
    length = 'short',
    width = 'wide',
    color = 'dark',
    href = 'https://test/test',
  } = options;

  const {
    text = '',
    hasArrow = false,
  } = options;

  const elementName = 'button';
  const arrowModifier = hasArrow ? `${elementName}_has-arrow` : '';

  const validTypes = ['button', 'submit', 'link', 'plain-text'];
  type = utils.getValidValue(validTypes, type, 'button');

  const validLengths = ['very-long', 'long', 'short', 'very-short'];
  length = utils.getValidValue(validLengths, length, 'short');

  const validWidths = ['wide', 'narrow'];
  width = utils.getValidValue(validWidths, width, 'wide');

  const validColors = ['dark', 'light'];
  color = utils.getValidValue(validColors, color, 'dark');

  href = utils.checkType('string', href, 'https://test/test');

  return {
    text, elementName, arrowModifier, type, length, width, color, href,
  };
}

export { prepareOptions };
