var gulp = require('gulp'),
	plumber = require('gulp-plumber'),
	rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin'),
	cache = require('gulp-cache');
var minifycss = require('gulp-minify-css');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: "./"
		}
	});
});

gulp.task('bs-reload', function () {
	browserSync.reload();
});

// images
gulp.task('images', function(){
	gulp.src('src/images/**/*')
		.pipe(cache(imagemin({ optimizationLevel: 9, progressive: true, interlaced: true })))
		.pipe(gulp.dest('dist/images/'))
});

//styles
gulp.task('styles', function(){
	gulp.src(['src/styles/**/*.scss'])
		.pipe(plumber({
		errorHandler: function (error) {
			console.log(error.message);
			this.emit('end');
		}}))
		.pipe(sourcemaps.init())
		.pipe(sass())
		.pipe(autoprefixer('last 2 versions'))
		.pipe(gulp.dest('dist/styles/'))
		.pipe(rename({suffix: '.min'}))
		.pipe(minifycss())
		.pipe(sourcemaps.write('dist/styles/'))
		.pipe(gulp.dest('dist/styles/'))
		.pipe(browserSync.reload({stream:true}))
});

//componentsCss
gulp.task('componentsCss', function(){
	gulp.src(['src/components/styles/**/*.scss'])
		.pipe(plumber({
		errorHandler: function (error) {
			console.log(error.message);
			this.emit('end');
		}}))
		.pipe(concat('componentsMain.css'))
		.pipe(sourcemaps.init())
		.pipe(sass())
		.pipe(autoprefixer('last 2 versions'))
		.pipe(gulp.dest('dist/components/'))
		.pipe(rename({suffix: '.min'}))
		.pipe(minifycss())
		.pipe(sourcemaps.write('dist/styles/'))
		.pipe(gulp.dest('dist/components/'))
		.pipe(browserSync.reload({stream:true}))
});

//scripts
gulp.task('scripts', function(){
	return gulp.src('src/scripts/**/*.js')
		.pipe(plumber({
		errorHandler: function (error) {
			console.log(error.message);
			this.emit('end');
		}}))
		.pipe(concat('main.js'))
		.pipe(babel())
		.pipe(gulp.dest('dist/scripts/'))
		.pipe(rename({suffix: '.min'}))
		.pipe(uglify())
		.pipe(gulp.dest('dist/scripts/'))
		.pipe(browserSync.reload({stream:true}))
});

//components Js
gulp.task('componentsJs', function(){
	return gulp.src('src/components/js**/*.js')
		.pipe(plumber({
		errorHandler: function (error) {
			console.log(error.message);
			this.emit('end');
		}}))
		.pipe(concat('components.js'))
		.pipe(babel())
		.pipe(gulp.dest('dist/components/'))
		.pipe(rename({suffix: '.min'}))
		.pipe(uglify())
		.pipe(gulp.dest('dist/scripts/'))
		.pipe(browserSync.reload({stream:true}))
});

gulp.task('default', ['browser-sync'], function(){
	gulp.watch("src/styles/**/*.scss", ['styles']);
	gulp.watch("src/components/styles/**/*.scss", ['componentsCss']);
	gulp.watch("src/scripts/**/*.js", ['scripts']);
	gulp.watch("src/components/js/**/*.js", ['componentsJs']);
	gulp.watch("src/images/**/*", ['images']);
	gulp.watch("*.html", ['bs-reload']);
});