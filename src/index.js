import 'normalize.css';

function requireAll(requireContext) {
  return requireContext.keys().map(requireContext);
}
requireAll(require.context('./assets/styles/', true, /.*\.(scss)$/));

requireAll(require.context('./components/', true, /.*\.(scss|js)$/));
requireAll(require.context('./pages/', true, /.*\.(scss|js)$/));
