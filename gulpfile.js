const gulp = require('gulp');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const cssnano = require('gulp-cssnano');
const sourcemaps = require('gulp-sourcemaps');

const paths = {
    src: {
        styles: 'source/*css',
        scripts: 'source/*js',
    },
    target: {
        styles: 'target',
        scripts: 'target',
    },
    targetNames: {
        styles: 'index.min.css',
        scripts: 'index.min.js',
    },
  };

gulp.task('default', ['js', 'css']);

gulp.task('js', () => {
    return gulp.src(paths.src.scripts)
    .pipe(sourcemaps.init())
        .pipe(concat(paths.targetNames.scripts))
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(uglify())
        .pipe(sourcemaps.write())    
    .pipe(gulp.dest(paths.target.scripts));
});

gulp.task('css', () => {
    return gulp.src([paths.src.styles])
    .pipe(sourcemaps.init())
        .pipe(concat(paths.targetNames.styles))
        .pipe(cssnano())
    .pipe(sourcemaps.write()) 
    .pipe(gulp.dest(paths.target.styles));
});

gulp.task('watch', () => {
    gulp.watch(paths.src.scripts, ['js']);
    gulp.watch(paths.src.styles, ['css']);
});

