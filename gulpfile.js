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
    glob('client/src/**/*.js*', {}, function (err, files) {
        if (typeof err !== 'undefined') {
            done(err);
        }

        del(files, function () {
            done();
        });
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




gulp.task('clean:build', function (done) {
    glob('build/**/*', {}, function (err, files) {
        if (typeof err !== 'undefined') {
            done(err);
        }

        del(files, function () {
            done();
        });
    });
})

gulp.task('build-assets', ['sass'], function () {
    return gulp.src(['./client/src/styles/main.css', './client/src/styles/gso-bk-logo.jpg', './client/src/styles/edit.png'])
        .pipe(gulp.dest('./build/client/styles/'));
});
gulp.task('build-server-config', function () {
    return gulp.src(['./server/config/*.json'])
        .pipe(gulp.dest('./build/server/config'));
});

gulp.task('build-server-data', function () {
    return gulp.src(['./server/data/*.json'])
        .pipe(gulp.dest('./build/server/data'));
});

gulp.task('build-server-files', function () {
    return gulp.src(['./server/package.json', './server/README.md'])
        .pipe(gulp.dest('./build/server/'));
});

gulp.task('build-server', ['build-server-config', 'build-server-data', 'build-server-files'], function () {
    return gulp.src(['./server/src/*.js'])
        .pipe(gulp.dest('./build/server/src'));
});

gulp.task('build-client', ['build-assets'], function () {
    return gulp.src(['./client/src/index.html', './client/src/app.js', './client/package.json'])
        .pipe(gulp.dest('./build/client/'));
});


gulp.task('build', ['build-client', 'build-server'], function () {
});

gulp.task('sass:watch', function () {
    gulp.watch('./client/src/**/*.scss', ['sass']);
});

//todo copy knockout to node modules or target via bowerrc and copy min as index
