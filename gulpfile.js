var gulp = require('gulp');

var sass       = require( 'gulp-sass' );
var cssmin     = require( 'gulp-minify-css' );
var sourcemaps = require('gulp-sourcemaps');
var runSequence  = require('run-sequence');
var plumber = require('gulp-plumber');
var notify = require('gulp-notify');

var source     = require( 'vinyl-source-stream' );
var buffer     = require( 'vinyl-buffer' );
var uglifyjs   = require( 'gulp-uglifyjs' );
var browserify = require( 'browserify' );

var cssSrcPath        = 'source/stylesheets';
var cssDestPath       = 'source/stylesheets';

gulp.task( 'css.scss', function() {
    return gulp.src( cssSrcPath + '/*.scss')
        .pipe(plumber({errorHandler: notify.onError('<%= error.message %>')}))
        .pipe(sourcemaps.init())
        .pipe( sass({
                outputStyle : 'compact',
                }) )
        .pipe(sourcemaps.write('./'))
        .pipe( gulp.dest(cssDestPath ) )
});
gulp.task('css.cssmin', function(){
  return gulp.src('source/stylesheets/*.css')
    .pipe(plumber({errorHandler: notify.onError('<%= error.message %>')}))
    .pipe(cssmin())
    .pipe(gulp.dest('build/stylesheets'));
});

gulp.task( 'browserify', function() {
    return browserify( './source/javascripts/main.js' )
        .bundle()
        .pipe( source( 'app.js' ) )
        .pipe( buffer() )
        .pipe( gulp.dest( './source/javascripts/' ) )
} );
gulp.task('js.uglify', function(){
  return gulp.src('source/javascripts/app.js')
    .pipe(uglifyjs())
    .pipe(gulp.dest('build/javascripts'))
});

gulp.task('default', function(){
  //
});

gulp.task('watch', function(){
  //
  gulp.watch(['source/stylesheets/**/*.scss', '!source/stylesheets/assets/**/*.scss'],  ['css.scss']);
  gulp.watch(['source/javascripts/**/*.js'],  ['browserify']);
});

//build時に実行
gulp.task('build', function(callback){
  return runSequence(
    ['css.scss', 'browserify'],
    ['css.cssmin', 'js.uglify'],
    callback
  );
});
