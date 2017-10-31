var gulp = require('gulp');
var sourceMaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var _if = require('gulp-if');
var ts = require('gulp-typescript');
var typescript = require('typescript');
var config = require('./../config');
var plumber = require('./../plumber-wrapper');
var util = require('gulp-concat-util');

gulp.task('server.ts', function () {
    var destinationFolder = config.dest.bin;
    var project = ts.createProject('./tsconfig.json',{typescript:typescript});
    return gulp.src(config.src.server)
        .pipe(plumber())
        .pipe(_if(!config.isProduction, sourceMaps.init()))
        .pipe(ts(project))
        .js
        .pipe(_if(config.isProduction, uglify()))
        .pipe(_if(!config.isProduction, sourceMaps.write('./maps')))
        .pipe(gulp.dest(config.dest.bin));
});