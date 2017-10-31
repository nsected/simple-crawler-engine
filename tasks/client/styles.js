var gulp = require('gulp');
var concat = require('gulp-concat');
var less = require('gulp-less');
var autoprefixPlugin = require('less-plugin-autoprefix');
var cleancssPlugin = require('less-plugin-clean-css');
var config = require('./../config');
var plumber = require('./../plumber-wrapper');

gulp.task('client.less', function () {
    var autoprefix = new autoprefixPlugin(config.pluginsOptions.autoprefix);
    var cleancss = new cleancssPlugin(config.pluginsOptions.cleancss);
    var lessOpt = {
        plugins: [autoprefix, cleancss]
    };
    return gulp.src(config.src.styles)
        .pipe(plumber())
        .pipe(less(lessOpt))
        .pipe(gulp.dest(config.dest.assets + '/css'));
});
