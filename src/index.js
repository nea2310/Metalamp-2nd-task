import './assets/styles/fonts.scss';
import './assets/styles/glob.scss';

function requireAll(requireContext) {
  return requireContext.keys().map(requireContext);
}

requireAll(require.context('./components/', true, /.*\.js$/));
requireAll(require.context('./pages/', true, /.*\.js$/));
