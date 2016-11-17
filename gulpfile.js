var gulp = require('gulp'),
    gulpWatch = require('gulp-watch'),
    del = require('del'),
    shell = require('gulp-shell'),
    runSequence = require('run-sequence'),
    tslint = require('gulp-tslint'),
    karma = require('karma'),
    argv = process.argv;

/***
 * Intercept command line variables
 */

// Explicitly live reloading (used for run)
var isLiveReloading = argv.indexOf('-l') > -1 || argv.indexOf('--livereload') > -1;
// Explicitly not live reloading (used for serve)
var isNotLiveReloading = argv.indexOf('-d') > -1 || argv.indexOf('--nolivereload') > -1;

/**
 * Ionic hooks
 * Add ':before' or ':after' to any Ionic project command name to run the specified
 * tasks before or after the command.
 */
gulp.task('serve:before',[isNotLiveReloading ? 'build' : 'watch']);
gulp.task('emulate:before', ['build']);
gulp.task('deploy:before', ['build']);
gulp.task('build:before', ['build']);
gulp.task('upload:before', ['build']);
gulp.task('run:before', [isLiveReloading ? 'watch' : 'build']);

/**
 * Ionic Gulp tasks, for more information on each see
 * https://github.com/driftyco/ionic-gulp-tasks
 *
 * Using these will allow you to stay up to date if the default Ionic 2 build
 * changes, but you are of course welcome (and encouraged) to customize your
 * build however you see fit.
 */
var buildBrowserify = require('ionic-gulp-browserify-typescript');
var buildSass = require('ionic-gulp-sass-build');
var copyHTML = require('ionic-gulp-html-copy');
var copyFonts = require('ionic-gulp-fonts-copy');
var copyScripts = require('ionic-gulp-scripts-copy');

var isRelease = argv.indexOf('--release') > -1;

gulp.task('watch', ['clean', 'configure'], function(done){
  runSequence(
    ['sass', 'html', 'fonts', 'scripts'],
    function(){
      gulpWatch('app/**/*.scss', function(){ gulp.start('sass'); });
      gulpWatch('app/**/*.html', function(){ gulp.start('html'); });
      buildBrowserify({
          src: ['./app/app.ts', './typings/index.d.ts'],
          watch: true
      }).on('end', done);
    }
  );
});

gulp.task('configure', [], shell.task('./configure.sh'));

gulp.task('platform-clean', shell.task('cordova clean'));

gulp.task('platform-build', ['platform-clean', 'build'], shell.task('ionic build'));

gulp.task('run-ios', ['platform-build'], shell.task('ionic run --target="iPhone-5s, 9.3" ios -s -c'));

gulp.task('run-android', ['platform-build'], shell.task('ionic run --target="Nexus_4_API_16" android -s -c'));

gulp.task('build', ['clean', 'configure'], function(done){
  runSequence(
    ['sass', 'html', 'fonts', 'scripts'],
    function(){
      buildBrowserify({
        src: ['./app/app.ts', './typings/index.d.ts'],
        minify: isRelease,
        browserifyOptions: {
          debug: !isRelease
        },
        uglifyOptions: {
          mangle: false
        }
      }).on('end', done);
    }
  );
});

gulp.task('sass', buildSass);
gulp.task('html', copyHTML);
gulp.task('fonts', copyFonts);
gulp.task('scripts', copyScripts);
gulp.task('clean', function(){
  return del('www/build');
});

gulp.task('unit-test', function (done) {
    runSequence(
        ['lint', 'html'],
        'karma',
        done
    );
});

gulp.task('lint', function() {

    return gulp.src('app/**/*.ts')
        .pipe(tslint())
        .pipe(tslint.report('verbose'));
});

gulp.task('karma-debug', function (done) {

    var karmaOpts = {
        configFile: process.cwd() + '/karma.config.js',
        singleRun: false,
        debug: true,
        browsers: ['Chrome'],
        reporters: ['mocha']
    };

    new karma.Server(karmaOpts, done).start();
});

gulp.task('karma', function (done)  {

    var karmaOpts = {
        configFile: process.cwd() + '/karma.config.js',
        singleRun: true
    };

    new karma.Server(karmaOpts, done).start();
});
