# gulp-rollup-starter
This repository shows a simple config for using rollup for bundling your JS files along with gulp.js as a task runner.
The following configuration will be shown:
* gulp (inc. sourcemaps), rollup 
* gulp (inc. sourcemaps), rollup, babel
* gulp (inc. sourcemaps), rollup, babel, requiring modules

### gulp (inc. sourcemaps), rollup 
```
const gulp = require('gulp');
const rollup = require('rollup-stream');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const sourcemaps = require('gulp-sourcemaps');

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
      sourcemap: options.sourcemap
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
```

### gulp (inc. sourcemaps), rollup, babel
```
// require the babel plugin
const babel = require('rollup-plugin-babel');

// use explicit babel config for rollup, but you could omit this file and just use a regular .babelrc file
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
      // add the plugin configuration
      plugins: [
        babel(babelConfig)
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
```

### gulp (inc. sourcemaps), rollup, babel
```
const commonJs = require('rollup-plugin-commonjs');
const resolveNodeModules = require('rollup-plugin-node-resolve');

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
```
