var gulp = require('gulp');
// var sass = require('gulp-sass');
// var autoprefixer = require('gulp-autoprefixer');
var $=require('gulp-load-plugins')();
// 使用 gulp.task() 方法注册一个任务 // 第一个参数是任务名称 // 第二个参数是任务的执行逻辑 
// gulp.task('styles', function () {
//     return gulp.src('sass/demo.scss')
//         .pipe(sass())
//         .pipe(autoprefixer())
//         .pipe(gulp.dest('./css'));
// });
gulp.task('styles', function () {
    return gulp.src('sass/demo.scss')
        .pipe($.sass())
        .pipe($.autoprefixer())
        .pipe(gulp.dest('./css'));
});

gulp.task('watch', function () {
    gulp.watch('sass/demo.scss', ['styles']);
});