const gulp = require('gulp');
const babel = require('gulp-babel');

gulp.task('js', () => {
    return gulp.src('source/*js')
    .pipe(babel({
        presets: ['@babel/env']
    }))
    .pipe(gulp.dest('target'));
});

gulp.task('css', () => {
    return gulp.src('source/*css')
    .pipe(gulp.dest('target'));
});