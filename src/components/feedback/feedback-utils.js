import isImage from '../../shared/helpers/isImage';

export default function prepareOptions(options) {
  const { imageName } = options;

  return {
    elementName: 'feedback',
    imagePathChecked: isImage(imageName),
  };
}
