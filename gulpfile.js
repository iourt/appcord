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
	minifyHTML   = require('gulp-minify-html'),
	replace      = require('gulp-replace'),
	handlebars   = require('gulp-handlebars'),
	rjs          = require('gulp-requirejs'),
	uglify       = require('gulp-uglify'),
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

	/*
	* 移动、压缩HTML文件到build目录
	* npm install --save-dev gulp-minify-html
	* npm install --save-dev gulp-replace
	*/
	moveHtml: function(){

		gulp.src('source/**/*.html')
			.pipe(replace(/\.css/g, '.css?v='+ version))
			.pipe(replace(/Frame\.js/g, 'lib.frame.js?v='+ version))
			.pipe(replace(/Config\.js/g, 'lib.config.js?v='+ version))
			.pipe(replace(/App\.js/g, 'lib.common.js?v='+ version))
			.pipe(minifyHTML({comments: true, spare: true}))
			.pipe(gulp.dest(buildpath));
	},

	/*
	* 框架frame.js生成
	* 源代码环境生成: frame.js
	* build环境生成: app.frame.js
	* npm install --save-dev gulp-requirejs
	* npm install --save-dev gulp-uglify
	*/ 
	createFrame: function(type) {
		var filePath = sourcePath,
			fileName = 'common/frame.js',
			isBuild = 0;

		if (type == 'build') {
			filePath = buildPath;
			isBuild = version;
			fileName = 'common/app.frame.js';
		}

	    rjs({
	        baseUrl: sourcePath +'library',
	        out: fileName,
	        include: [
	        	'zepto', 
	        	'underscore', 
	        	'backbone',
	        	'handlebars',
	        	'requirejs',
	        	'lib.config'
	        ],
		    paths: {
		        'zepto':      'code/zepto.min-1.1.6',
		        'underscore': 'code/underscore-min-1.7.0',
		        'backbone':   'code/backbone-min-1.1.2',
		        'handlebars': 'code/handlebars-v2.0.0',
		        'requirejs':  'code/require-2.1.15'
		    },
	        shim: {
	        	zepto: {
	        		'exports': '$'
	        	},
		    	backbone: {
		    		'deps': ['zepto', 'underscore'],
		    		'exports': 'Backbone'
		    	},
		    	underscore: {
		    		'exports': '_'
		    	},
		        handlebars: {
		            exports: 'Handlebars',

		            init: function() {

		                this.Handlebars = Handlebars;

		                return this.Handlebars;
		                
		            }
		        }
	        }
	        // ... more require.js options 
	    })
		.pipe(uglify({outSourceMap: false}))
		.pipe(replace(/createMinFileVersion=0/g, 'createMinFileVersion='+ isBuild))
		.pipe(gulp.dest(filePath)); // pipe it to the output DIR 
	}
}

gulp.task('default', function(){
	// task.templates();
	task.createFrame();
});