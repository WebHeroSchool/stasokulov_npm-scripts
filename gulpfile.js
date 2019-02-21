const gulp = require('gulp');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');

gulp.task('js', () => {
    return gulp.src('source/*js')
    .pipe(concat('index.js'))
    .pipe(babel({
        presets: ['@babel/env']
    }))
    .pipe(uglify())
    .pipe(gulp.dest('target'));
});

gulp.task('css', () => {
    return gulp.src('source/*css')
    .pipe(gulp.dest('target'));
});