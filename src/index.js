// import './assets/styles/fonts.scss';
// import './assets/styles/glob.scss';
import './assets/styles/styles';

function requireAll(requireContext) {
  return requireContext.keys().map(requireContext);
}
requireAll(require.context('./assets/styles/', true, /.*\.(scss)$/));

requireAll(require.context('./components/', true, /.*\.(scss|js)$/));
requireAll(require.context('./pages/', true, /.*\.(scss|js)$/));
