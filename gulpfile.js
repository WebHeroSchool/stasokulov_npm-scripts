const gulp = require('gulp');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const cssnano = require('gulp-cssnano');
const sourcemaps = require('gulp-sourcemaps');

gulp.task('default', ['js', 'css']);

gulp.task('js', () => {
    return gulp.src('source/*js')
    .pipe(sourcemaps.init())
        .pipe(concat('index.js'))
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(uglify())
        .pipe(sourcemaps.write())    
    .pipe(gulp.dest('target'));
});

gulp.task('css', () => {
    return gulp.src('source/*css')
    .pipe(sourcemaps.init())
        .pipe(concat('index.css'))
        .pipe(cssnano())
    .pipe(sourcemaps.write()) 
    .pipe(gulp.dest('target'));
});