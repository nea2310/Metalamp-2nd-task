import './assets/styles/fonts.scss';
import './assets/styles/glob.scss';


function requireAll(requireContext) {
  return requireContext.keys().map(requireContext);
}

requireAll(require.context('./components/', true, /^\.\/(?!.*(?:__tests__)).*\.((jsx?)|(tsx?))$/));
requireAll(require.context('./pages/', true, /^\.\/(?!.*(?:__tests__)).*\.((jsx?)|(tsx?))$/));


