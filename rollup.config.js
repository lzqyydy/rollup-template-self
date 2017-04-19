// Rollup plugins
import babel from 'rollup-plugin-babel';
import eslint from 'rollup-plugin-eslint';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';
import uglify from 'rollup-plugin-uglify';
import postcss from 'rollup-plugin-postcss';

// PostCSS plugins
import cssnano from 'cssnano';
import stylus from 'stylus';

// PostCSS pre-processor
const preprocessor = (content, id) => new Promise((resolve, reject) => {
  const renderer = stylus(content, {
    filename: id,
    sourcemap: {inline: true}
  });
  renderer.render((err, code) => {
    if (err) {
      return reject(err);
    }
    resolve({code, map: renderer.sourcemap});
  });
});

export default {
  entry: 'src/scripts/main.js',
  dest: 'build/js/main.min.js',
  format: 'iife',
  sourceMap: 'inline',
  plugins: [
    postcss({
      plugins: [
        cssnano()
      ],
      preprocessor,
      extensions: [ '.styl' ],
    }),
    resolve({
      jsnext: true,
      main: true,
      browser: true,
    }),
    commonjs(),
    eslint({
      exclude: [
        'src/styles/**',
      ]
    }),
    babel({
      exclude: 'node_modules/**',
    }),
    replace({
      exclude: 'node_modules/**',
      ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
    }),
    (process.env.NODE_ENV === 'production' && uglify()),
  ],
};
