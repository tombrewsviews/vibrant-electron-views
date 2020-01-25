const { addWebpackPlugin, override } = require('customize-cra');
const { addReactRefresh } = require('customize-cra-react-refresh');

class ViewsPlugin {
  // Define `apply` as its prototype method which is supplied with compiler as its argument
  apply(compiler) {
    // Specify the event hook to attach to
    compiler.hooks.emit.tapAsync('ViewsPlugin', (compilation, callback) => {
      console.log('This is an example plugin!');
      // console.log(
      //   'Here’s the `compilation` object which represents a single build of assets:',
      //   compilation
      // )

      // // Manipulate the build using the plugin API provided by webpack
      // compilation.addModule(/* ... */)

      callback();
    });
  }
}

const isDevelopment = process.env.NODE_ENV !== 'production';
const addViews = options =>
  override(isDevelopment && addWebpackPlugin(new ViewsPlugin(options)));

/* config-overrides.js */
module.exports = override(
  addReactRefresh({ disableRefreshCheck: true }),
  addViews()
);
