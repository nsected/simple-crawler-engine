var gulp = require('gulp');
var sourceMaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var _if = require('gulp-if');
var ts = require('gulp-typescript');
var typescript = require('typescript');
var config = require('./../config');
var plumber = require('./../plumber-wrapper');
var util = require('gulp-concat-util');
var concat = require('gulp-concat');

gulp.task('server.ts.patent', function () {
    var destinationFolder = config.dest.bin;
    var project = ts.createProject('./tsconfig.json',{typescript:typescript});
    return gulp.src(config.src.server)
        .pipe(plumber())
        .pipe(ts(project))
        .js
        .pipe(concat('patent.txt'))
        .pipe(gulp.dest(config.dest.bin));
});