var gulp = require('gulp');
var concat = require('gulp-concat');

var sass = require('gulp-sass'),
	sourcemaps = require('gulp-sourcemaps')
	postcss      = require('gulp-postcss');
	
const babel = require('gulp-babel');
	
var connect = require('gulp-connect-php');

var autoprefixer = require('autoprefixer');
var cssnano = require('cssnano');

var browserSync = require('browser-sync').create();

var src  = "./src/";
var dist = "./dist/";

gulp.task('connect', function() {
  connect.server({
    port: 3002,
  }, function(){
  		browserSync.init({
			proxy: '127.0.0.1:3002',
			open: false,
			ghostMode: false
		});
  });
});

gulp.task('styles', function() {
    gulp.src( src + 'sass/**/*.scss')
    	.pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss([
        	autoprefixer({ browsers: ['last 2 versions', 'ie >= 9', 'ChromeAndroid >= 2.3'] }),
        	cssnano()
        ]))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest( dist + 'css/'));
});

gulp.task('scripts', function() {
    gulp.src(src + 'js/**/*.js')
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(gulp.dest( dist + 'js/'));
});

//Watch task
gulp.task('default', ['styles', 'scripts', 'connect'], function() {
	
   gulp.watch( src + 'sass/**/*.scss',['styles']);
   gulp.watch( src + 'js/**/*.js',['scripts']);
    
   gulp.watch( dist + 'css/*.css', function(){
	    gulp.src(dist + 'css/*.css')
	   		.pipe(browserSync.stream());
   }); 

   gulp.watch( dist + 'js/**/*.js').on('change', browserSync.reload);

   
   gulp.watch( './**/*.php').on('change', browserSync.reload);
   gulp.watch( './**/*.html').on('change', browserSync.reload);
 
});