import getValidValue from '../../shared/helpers/getValidValue';

export default function prepareOptions(options) {
  const { image } = options;
  const validImages = ['city', 'fireplace', 'smile'];

  return {
    elementName: 'feature',
    imageChecked: getValidValue(validImages, image, 'city'),
  };
}
