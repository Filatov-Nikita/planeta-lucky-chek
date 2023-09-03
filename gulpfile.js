const gulp = require('gulp');
const { src, dest, watch, series } = gulp;
const sass = require('gulp-sass')(require('sass'));
const pugCompiler = require('gulp-pug');
const browserSync = require('browser-sync').create();
const del = require('del');
const babel = require('gulp-babel');
const minify = require('gulp-babel-minify');
const imagemin = require('gulp-imagemin');
const imageminPngquant = require('imagemin-pngquant');
const cleanCSS = require('gulp-clean-css');
const gcmq = require('gulp-group-css-media-queries');

function clean() {
  return del([ './dist/*/' ]);
}

function fonts() {
  return src('./src/assets/fonts/**')
  .pipe(dest('./dist/assets/fonts'));
}

function createImages(prod = false) {
  return function images() {
    let flow = src('./src/assets/images/**/*{.jpg,png,svg}');

    if(prod) {
      flow = flow.pipe(imagemin([
        imagemin.mozjpeg({ quality: 80, progressive: true }),
        imageminPngquant({ quality: [0.7, 0.8], speed: 7 })
      ]));
    }

    flow = flow
    .pipe(dest('./dist/assets/images'))
    .pipe(browserSync.stream());

    return flow;
  }
}

function js() {
  return src('./src/js/**/*.js')
  .pipe(babel({
    presets: ['@babel/env']
  }))
  .pipe(minify())
  .pipe(dest('./dist/js'))
  .pipe(browserSync.stream());
}

function styles() {
  return src('./src/css/app.scss')
  .pipe(sass())
  .pipe(gcmq())
  .pipe(cleanCSS())
  .pipe(dest('./dist/css'))
  .pipe(browserSync.stream());
}

function pug() {
  return src('./src/pug/*.pug')
  .pipe(pugCompiler())
  .pipe(dest('./dist'))
  .pipe(browserSync.stream());
}

function server() {
  browserSync.init({
    server: {
      baseDir: './dist',
    }
  });

  watch('./src/css/**/*.scss', series(styles));
  watch('./src/assets/images/**', series(createImages(false)));
  watch('./src/js/**/*.js', series(js));
  watch('./src/pug/**/*.pug', series(pug));
}

const serve = series(clean, fonts, createImages(false), js, styles, pug, server);
const build = series(clean, fonts, createImages(true), js, styles, pug);

module.exports = {
  styles,
  pug,
  build,
  default: serve,
  images: createImages(true)
};
