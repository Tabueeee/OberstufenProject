const gulp     = require('gulp');
const clean    = require('./tasks/deleteFilesByGlob')();
const sassLint = require('gulp-sass-lint');
const tslint   = require("gulp-tslint");

gulp.task("tslint", function () {
    gulp.src("src/**/*.ts")
        .pipe(tslint({
            formatter: "stylish"
        }))
        .pipe(tslint.report({
            emitError: false
        }));
});


gulp.task('clean:css', function (done) {
    clean.deleteFilesByGlob('src/**/*.css*', done);
})

gulp.task('clean:js', function (done) {
    clean.deleteFilesByGlob('src/**/*.js*', done);
})

gulp.task('sass-lint', function () {
    return gulp.src('client/src/**/*.scss')
        .pipe(sassLint({
            configFile: '.sass-lint.yml'
        }))
        .pipe(sassLint.format())
        .pipe(sassLint.failOnError())
});
