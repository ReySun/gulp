var gulp = require('gulp'),  
    // sass = require('gulp-ruby-sass'),
    // autoprefixer = require('gulp-autoprefixer'),
    // minifycss = require('gulp-minify-css'),
    // jshint = require('gulp-jshint'),
    // uglify = require('gulp-uglify'),
    // imagemin = require('gulp-imagemin'),
    // rename = require('gulp-rename'),
    // clean = require('gulp-clean'),
    // concat = require('gulp-concat'),
    // notify = require('gulp-notify'),
    // cache = require('gulp-cache'),
    // livereload = require('gulp-livereload');
    // gulpStripDebug = require('gulp-strip-debug');
     plugins = require('gulp-load-plugins')();

//编译Sass，Autoprefix及缩小化
gulp.task('styles', function() {
  return gulp.src('src/**/*.scss')
    .pipe(plugins.sass({ style: 'expanded' }))
    .pipe(plugins.autoprefixer('last 2 version', 'safari 5', 'ie 6', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(gulp.dest('build'))
    .pipe(plugins.rename({suffix: '.min'}))
    .pipe(plugins.minifyCss())
    .pipe(gulp.dest('build/min'))
    .pipe(plugins.notify({ message: 'Styles task complete' }));//windows右下角任务提升
});
gulp.task('minify', function () {
   gulp.src('src/**/*.js')
      .pipe(plugins.uglify())//压缩js
      .pipe(plugins.stripDebug())//去掉调试语句
      .pipe(gulp.dest('build'))
});
gulp.task('js', function () {
   return gulp.src('src/**/*.js')
      .pipe(plugins.jshint())
      .pipe(plugins.jshint.reporter('default'))
      .pipe(plugins.concat('app.js'))//将所有文件合并到一个叫app.js的文件中
      .pipe(plugins.uglify())//压缩js
      .pipe(plugins.stripDebug())//去掉调试语句
      .pipe(gulp.dest('build'));
});
gulp.task('watch', function () {
   gulp.watch(['src/**/*.scss','src/**/*.js'], ['styles','minify','js'],function(){
        console.log('Event type: ' + event.type); // added, changed, or deleted
        console.log('Event path: ' + event.path); // The path of the modified file
   }).on('change', function (event) {
        console.log('Event type: ' + event.type); // added, changed, or deleted
        console.log('Event path: ' + event.path); // The path of the modified file
    });
});