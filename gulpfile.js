
'use strict'

const gulp = require ('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const del = require('del');
const newer = require('gulp-newer');
const browserSync = require('browser-sync');


gulp.task('sass', function(){
    return gulp.src("src/style/*.scss")
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(autoprefixer({ browsers: ['last 2 versions', 'ie 10'] }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest("dist/style"))
});

gulp.task('clean', function() {
  return del('build')
});

gulp.task('resources', function() {
  return gulp.src('src/resources/**', {since: gulp.lastRun('resources')})
      .pipe(newer('dist/resources'))
      .pipe(gulp.dest('dist/resources'))
});

gulp.task('page', function() {
  return gulp.src('src/index.html', {since: gulp.lastRun('page')})
      .pipe(newer('dist'))
      .pipe(gulp.dest('dist'))
});

gulp.task('build', gulp.series(
  'clean',
  gulp.parallel('sass','page','resources'))
);

gulp.task('watch', function() {
  gulp.watch('src', gulp.series('sass'))
  gulp.watch('src/resources/', gulp.series('resources'))
  gulp.watch('src/', gulp.series('page'))
});

gulp.task('serve', function() {
  browserSync.init({
    server: 'dist'
  });

  browserSync.watch('dist/**/*.*').on('change', browserSync.reload);
});

gulp.task('dev', gulp.series('build',gulp.parallel('watch', 'serve')));
gulp.task('default', gulp.series('dev'));
