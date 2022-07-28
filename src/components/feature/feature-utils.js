import isImage from '../../shared/helpers/isImage';

export default function prepareOptions(options) {
  const { imagePath } = options;

  return {
    elementName: 'feature',
    imagePathChecked: isImage(imagePath),
  };
}
