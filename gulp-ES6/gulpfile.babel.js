import gulp from 'gulp';
import sass from 'gulp-sass';
import autoprefixer from 'gulp-autoprefixer';
const dirs = {
    src: 'sass',
    dest: 'css'
};
const sassPaths = {
    src: `${dirs.src}/demo.scss`,
    dest: `${dirs.dest}`
};
gulp.task('styles', () => {
    return gulp.src(paths.src)
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(gulp.dest(paths.dest));
});