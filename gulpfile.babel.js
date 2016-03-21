/* eslint strict: 0, arrow-body-style: 0 */
'use strict';

import del from 'del';
import runSequence from 'run-sequence';
import gulp from 'gulp';
import mainBowerFiles from 'main-bower-files';
import gulpLoadPlugins from 'gulp-load-plugins';
import imageminJpegtran from 'imagemin-jpegtran';
import imageminOptipng from 'imagemin-optipng';

const $ = gulpLoadPlugins();

gulp.task('clean', () => del(['dist/**/*.html', 'dist/**/*.css', 'dist/**/**.js', 'tmp/*.html']));

gulp.task('lib', () => {
  return gulp.src(mainBowerFiles())
    .pipe(gulp.dest('dist/lib'));
});

gulp.task('img:jpg', () => {
  return gulp.src('src/images/*.(jpg|jpeg)')
    .pipe(imageminJpegtran()())
    .pipe(gulp.dest('dist/images'));
});

gulp.task('img:png', () => {
  return gulp.src('src/images/*.png')
    .pipe(imageminOptipng()())
    .pipe(gulp.dest('dist/images'));
});

gulp.task('style', () => {
  return gulp.src('src/sass/*.scss')
    .pipe($.plumber({
      errorHandler: $.notify.onError('<%= error.message %>'),
    }))
    .pipe($.compass({
      config_file: 'src/config.rb',
      comments: false,
      css: 'dist/css',
      sass: 'src/sass',
      image: 'src/images',
    }))
    .pipe($.autoprefixer())
    .pipe($.minifyCss())
    .pipe(gulp.dest('dist/css'));
});

gulp.task('script', () => {
  return gulp.src('src/js/*.js')
    .pipe($.plumber({
      errorHandler: $.notify.onError('<%= error.message %>'),
    }))
    .pipe($.babel())
    .pipe(gulp.dest('dist/js'));
});

gulp.task('markup', () => {
  return gulp.src('src/extend/views/**/*.html')
    .pipe($.plumber({
      errorHandler: $.notify.onError('<%= error.message %>'),
    }))
    .pipe($.htmlExtend())
    .pipe(gulp.dest('tmp'));
});

gulp.task('minify-html', () => {
  return gulp.src('tmp/*.html')
    .pipe($.plumber({
      errorHandler: $.notify.onError('<%= error.message %>'),
    }))
    .pipe($.minifyHtml({
      empty: true,
      cdata: true,
      conditionals: true,
      spare: true,
      quotes: true,
    }))
    .pipe(gulp.dest('dist'));
});

gulp.task('watch', () => {
  gulp.watch('src/sass/*.scss', ['style']);
  gulp.watch('src/js/*.js', ['script']);
  gulp.watch('src/extend/**/*.html', ['markup']);
  gulp.watch('tmp/*.html', ['minify-html']);
});

gulp.task('default', ['clean'], cb => {
  runSequence(
    ['lib', 'img:jpg', 'img:png', 'style', 'script', 'markup'],
    ['minify-html'],
    cb
  );
});
