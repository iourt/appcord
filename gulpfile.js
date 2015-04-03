var fs   = require('fs'),
	argv = require('yargs').argv,
	os   = require('os');

var projectType = require('./tools/projectType.js'),
	build       = require('./tools/build.js'),
	movefiles   = require('./tools/moveFiles.js'),
	pagename    = require('./tools/pageFiles.js');

var gulp 		 = require('gulp'),
	sass         = require('gulp-sass'),
	minifycss    = require('gulp-minify-css'),
	handlebars   = require('gulp-handlebars'),
	defineModule = require('gulp-define-module');

var dev = argv.dev,
	sourcePath = './source/', //--------源代码目录
	buildPath = build().toString(); //--代码生成目录

var d = new Date(),
    version = d.getTime();


var task = {

	/*
	* 生成handlebars模板
	* npm install --save-dev gulp-handlebars
	* npm install --save-dev gulp-define-module
	*/
	templates: function() {
		gulp.src('./source/**/*.hbs')
			.pipe(handlebars())
			.pipe(defineModule('amd'))
			.pipe(movefiles(function(path){
				// path.dirname = strpath;
				path.basename += '.hbs';
				path.extname = '.js'
			}))
			.pipe(gulp.dest(''))
	},

	/*
	* sass编译
	* npm install --save-dev gulp-sass
	* npm install --save-dev gulp-minify-css
	*/
	sass: function(type) {

		if (type == 'build') {

			gulp.src(sourcePath +'themes/*.scss')
				.pipe(sass())
				.pipe(minifycss())
				.pipe(gulp.dest(buildPath +'themes'));

		} else {

			gulp.src(sourcePath +'themes/*.scss')
				.pipe(sass())
				.pipe(gulp.dest(sourcePath +'themes'));

		}
	},
}

gulp.task('default', function(){
	task.templates();
	task.sass();
});