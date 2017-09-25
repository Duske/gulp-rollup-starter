const gulp = require('gulp');
const rollup = require('rollup-stream');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('rollup-plugin-babel');
const commonJs = require('rollup-plugin-commonjs');
const resolveNodeModules = require('rollup-plugin-node-resolve');

const babelConfig = {
  "presets": [
    [
      "es2015",
      {
        "modules": false
      }
    ]
  ],
  "plugins": [
    "external-helpers"
  ],
  babelrc: false
};

/**
 * Use rollup in gulp making it compatible with streams
 * @param {String} inputFile path to main JS file
 * @param {Object} options configuration object containing format, basePath, und distPath
 */
const rollupJS = (inputFile, options) => {
  return () => {
    return rollup({
      input: options.basePath + inputFile,
      format: options.format,
      sourcemap: options.sourcemap,
      plugins: [
        babel(babelConfig),
        resolveNodeModules(),
        commonJs(),
      ]
    })
    // point to the entry file.
    .pipe(source(inputFile, options.basePath))
    // we need to buffer the output, since many gulp plugins don't support streams.
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    // some transformations like uglify, rename, etc.
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(options.distPath));
  };
}

/**
 * Bundle JS files starting from main.js
 */
gulp.task('rollup', rollupJS('main.js', {
  basePath: './src/',
  format: 'iife',
  distPath: './dist',
  sourcemap: true
}));

/**
 * Watch all JS files and rebuild on change
 */
gulp.task('watchBuildJS', ['rollup'], () => {
  gulp.watch('src/**/*.js', [/* do some linting etc., */ 'rollup']);
});
