import './assets/styles/fonts.scss';
import './assets/styles/glob.scss';

function requireAll(requireContext) {
  return requireContext.keys().map(requireContext);
}
const regexp = /.*\.js$/;

requireAll(require.context('./components/', true, regexp));
requireAll(require.context('./pages/', true, regexp));
