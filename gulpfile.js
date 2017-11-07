const gulp     = require('gulp');
const clean    = require('./tasks/deleteFilesByGlob')();
const sassLint = require('gulp-sass-lint');
const tslint   = require("gulp-tslint");
var sass       = require('gulp-sass');
var glob       = require('glob');
var del        = require('del');

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
    glob('client/src/**/*.js*, {}, function (err, files) {
    if (typeof err !== 'undefined') {
        done(err);
    }

    del(files, function () {
        done();
    });
});

gulp.task('sass-lint', function () {
    return gulp.src('client/src/**/*.scss')
        .pipe(sassLint({
            configFile: '.sass-lint.yml'
        }))
        .pipe(sassLint.format())
        .pipe(sassLint.failOnError())
});

gulp.task('sass', function () {
    return gulp.src('./client/src/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./client/src/'));
});

gulp.task('sass:watch', function () {
    gulp.watch('./sass/**/*.scss', ['sass']);
});

//todo copy knockout to node modules or target via bowerrc and copy min as index
