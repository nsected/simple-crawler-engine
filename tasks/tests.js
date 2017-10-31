var gulp = require('gulp');
var mocha = require('gulp-mocha');
var ts = require('gulp-typescript');
var plumber = require('./plumber-wrapper');
var replace = require('gulp-replace');
gulp.task('tests.compile', ['server.ts'], function () {
    gulp.src('tests/**/*.ts')
        .pipe(plumber())
        .pipe(ts({
            target: 'ES5',
            module: 'commonjs',
            noExternalResolve: true,
            isolatedModules: true,
            removeComments: true
        }))
        .js
        .pipe(replace('/src/server/', '/bin/'))
        .pipe(gulp.dest('tests'));
});

gulp.task('tests.server', ['tests.compile'], function () {
    gulp.src('tests/**/*.js')
        .pipe(plumber())
        .pipe(mocha({
            reporter: 'spec'
        }));
});