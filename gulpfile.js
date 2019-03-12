const autoprefixer = require('autoprefixer');
const assets  = require('postcss-assets');
const babel = require('gulp-babel');
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const clean = require('gulp-clean');
const cssnano = require('gulp-cssnano');
const env = require('gulp-env');
const eslint = require('gulp-eslint');
const filter = require('gulp-filter');
const gulp = require('gulp');
const glob = require("glob");
const gulpif = require('gulp-if');
const handlebars = require('gulp-compile-handlebars');
const nested = require('postcss-nested');
const postcss = require('gulp-postcss');
const postcssCustomProperties = require('postcss-custom-properties');
const postcssPresetEnv = require('postcss-preset-env');
const rename = require('gulp-rename');
const rulesScripts = require('./eslintrc.json');
const reporter  = require('postcss-reporter');
const rulesStyles = require('./stylelintrc.json');
const sourcemaps = require('gulp-sourcemaps');
const short = require('postcss-short');
const stylelint = require('stylelint');
const templateContext = require('./templates/test.json');
const uglify = require('gulp-uglify');

const paths = {
    src: {
        styles: 'source/**/*css',
        scripts: 'source/*js',
        dir: './source',
        assets: './source/img/**/*',
    },
    target: {
        styles: 'target',
        scripts: 'target',
        dir: './'
    },
    targetNames: {
        styles: 'index.min.css',
        scripts: 'index.min.js'
    },
    templates: 'templates/**/*.hbs',

    lint: {
        scripts: ['**/*.js', '!node_modules/**/*', '!target/**/*'],
        styles: ['**/*.css', '!node_modules/**/*', '!target/**/*']
    }
};

env({
    file: '.env',
    type: 'ini',
});

switch (process.env.NODE_ENV) {
    case 'dev':
        gulp.task('dev', [
            'default',
            'browser-sync'
        ]);
        break;
    case 'prod':
        gulp.task('prod', [
            'default'
        ]);
        break;
};

gulp.task('default', [
    'clean',
    'fonts',
    'assets',
    'css',
    'js',
    'compile'
]);

gulp.task('clean', () => {
    return gulp.src('target/*', {read: false})
    .pipe(clean());
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

gulp.task('js', () => {
    return gulp.src(paths.src.scripts)
    .pipe(sourcemaps.init())
        .pipe(concat(paths.targetNames.scripts))
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(gulpif( process.env.NODE_ENV === 'production', uglify() ))
        .pipe( sourcemaps.write() )
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
        postcssCustomProperties({
            preserve: false
        }),
    ];

    return gulp.src([paths.src.styles])
    .pipe(sourcemaps.init())
    .pipe(concat(paths.targetNames.styles))
    .pipe(postcss(plugins))
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
    gulp.watch([paths.templates, `${paths.src.dir}/index.hbs`], ['compile-watch']);
});

gulp.task('js-watch', ['js'], () => browserSync.reload());
gulp.task('css-watch', ['css'], () => browserSync.reload());
gulp.task('compile-watch', ['compile'], () => browserSync.reload());

gulp.task('lint', ['stylelint', 'eslint']);

gulp.task('eslint', () => {
    gulp.src(paths.lint.scripts)
        .pipe( eslint(rulesScripts) )
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('stylelint', () => {
    gulp.src(paths.lint.styles)
        .pipe(postcss([
            stylelint(rulesStyles),
            reporter({
                clearMessages: true,
                throwError: true
            })
        ]));
});

gulp.task('fonts', () => {
    gulp.src('./source/fonts/**/*')
        .pipe(filter( ['**/*.woff', '**/*.woff2', '**/*.otf'] ))
        .pipe(gulp.dest(`./target/fonts`));
});

gulp.task('assets', () => {
    glob(paths.src.assets, (err, files) => {
        if (!err) {
            gulp.src(files)
                .pipe(gulp.dest(`${paths.target.dir}img`));
        } else {
            throw err;
        }
    });
});