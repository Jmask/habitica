import gulp from 'gulp';
import runSequence from 'run-sequence';
import babel from 'gulp-babel';
import webpackProductionBuild from '../webpack/build';
require('gulp-grunt')(gulp);

gulp.task('build', () => {
  if (process.env.NODE_ENV === 'production') {
    gulp.start('build:prod');
  } else {
    gulp.start('build:dev');
  }
});

gulp.task('build:src', () => {
  return gulp.src('website/server/**/*.js')
    .pipe(babel())
    .pipe(gulp.dest('website/transpiled-babel/'));
});

gulp.task('build:common', () => {
  return gulp.src('website/common/script/**/*.js')
    .pipe(babel())
    .pipe(gulp.dest('website/common/transpiled-babel/'));
});

gulp.task('build:server', ['build:src', 'build:common']);

// Client Production Build
gulp.task('build:client', ['bootstrap'], (done) => {
  webpackProductionBuild((err, output) => {
    if (err) return done(err);
    console.log(output);
  });
});

gulp.task('build:dev', ['browserify', 'prepare:staticNewStuff'], (done) => {
  gulp.start('grunt-build:dev', done);
});

gulp.task('build:dev:watch', ['build:dev'], () => {
  gulp.watch(['website/client-old/**/*.styl', 'website/common/script/*']);
});

gulp.task('build:prod', [
  'browserify', 
  'build:server', 
  'prepare:staticNewStuff', 
  'build:client',
  'apidoc',
]);
