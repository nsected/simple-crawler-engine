var gulp = require('gulp');
var watches = require('./tasks/watches');
var clean = require('./tasks/clean');
var serverTs = require('./tasks/server/scripts');
var views = require('./tasks/server/views');
var tests = require('./tasks/tests');
var patent = require('./tasks/server/patent');
var libraries = require('./tasks/libraries/libraries');

gulp.task('build', function () {
    gulp.start('libraries', 'server.ts', 'server.views');
});

gulp.task('default', function () {
    gulp.start('server.ts');
});

 gulp.task('watches', ['build'], function () {
     gulp.start('watches');
 });