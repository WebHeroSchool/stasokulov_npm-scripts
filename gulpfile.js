const gulp = require('gulp');
gulp.task('js', () => {
    return gulp.src('source/*js')
    .pipe(gulp.dest('target'));
});

gulp.task('css', () => {
    return gulp.src('source/*css')
    .pipe(gulp.dest('target'));
});