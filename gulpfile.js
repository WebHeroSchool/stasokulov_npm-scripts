const env = require('gulp-env');
const gulp = require('gulp');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const gulpif = require('gulp-if');
const clean = require('gulp-clean');
const uglify = require('gulp-uglify');
const cssnano = require('gulp-cssnano');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const assets  = require('postcss-assets');
const short = require('postcss-short');
const nested = require('postcss-nested');
const postcssPresetEnv = require('postcss-preset-env');
const handlebars = require('gulp-compile-handlebars');
const rename = require('gulp-rename');
const glob = require("glob");
const templateContext = require('./templates/test.json');

const paths = {
    src: {
        styles: 'source/*css',
        scripts: 'source/*js',
        dir: 'source',
    },
    target: {
        styles: 'target',
        scripts: 'target',
        dir: './'
    },
    targetNames: {
        styles: 'index.min.css',
        scripts: 'index.min.js',
    },
    templates: 'templates/**/*.hbs'
};

env({
    file: '.env',
    type: 'ini',
});

gulp.task('compile', () => {
    glob(paths.templates, (err, files) => {
        if(!err) {
            const options = {
                ignorePartials: true,
                batch: files.map( item => item.slice(0, item.lastIndexOf('/')) ),
                helpers: {
                    date: () => new Date,
                    numLetter: (name) => name.length
                }
                
            };
    
            return gulp.src(`${paths.src.dir}/index.hbs`)
                .pipe(handlebars(templateContext, options))
                .pipe(rename('index.html'))
                .pipe(gulp.dest(paths.target.dir));
        }
    });
});

gulp.task('default', ['clean', 'js', 'css']);

gulp.task('js', () => {
    return gulp.src(paths.src.scripts)
    .pipe(sourcemaps.init())
        .pipe(concat(paths.targetNames.scripts))
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(gulpif( process.env.NODE_ENV === 'production', uglify() ))
        .pipe(sourcemaps.write())    
    .pipe(gulp.dest(paths.target.scripts));
});

gulp.task('css', () => {
    const plugins = [
        autoprefixer({ browsers: ['last 1 version'] }),
        postcssPresetEnv({ browsers: 'last 2 versions' }),
        nested(),
        short(),
        assets({
          loadPaths: ['img/'],
          relativeTo: 'target/'
        }),
    ];

    return gulp.src([paths.src.styles])
    .pipe(sourcemaps.init())
        .pipe(postcss(plugins))
        .pipe(concat(paths.targetNames.styles))
        .pipe(gulpif( process.env.NODE_ENV === 'production', cssnano() ))
    .pipe(sourcemaps.write()) 
    .pipe(gulp.dest(paths.target.styles));
});

gulp.task('browser-sync', () => {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });

    gulp.watch(paths.src.scripts, ['js-watch']);
    gulp.watch(paths.src.styles, ['css-watch']);
});

gulp.task('js-watch', ['js'], () => browserSync.reload());
gulp.task('css-watch', ['css'], () => browserSync.reload());

gulp.task('prod', ['default']);
gulp.task('dev', ['default', 'browser-sync']);

gulp.task('clean', () => {
    return gulp.src('target/*', {read: false})
    .pipe(clean());
});