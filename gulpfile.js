var fs   = require('fs'),
	argv = require('yargs').argv,
	os   = require('os');

var projectType = require('./tools/projectType.js'),
	build       = require('./tools/build.js'),
	project     = require('./tools/project.js'),
	movefiles   = require('./tools/moveFiles.js'),
	pagename    = require('./tools/pageFiles.js');

var gulp 		 = require('gulp'),
	sass         = require('gulp-sass'),
	minifycss    = require('gulp-minify-css'),
	minifyHTML   = require('gulp-minify-html'),
	replace      = require('gulp-replace'),
	concat       = require('gulp-concat'),
	handlebars   = require('gulp-handlebars'),
	connect 	 = require('gulp-connect'),
	rjs          = require('gulp-requirejs'),
	uglify       = require('gulp-uglify'),
	shell        = require('gulp-shell'),
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
	},

	/*
	* router文件对应 和 requirejs.config 生成
	* lib.config.js
	* npm install --save-dev gulp-concat
	*/
	createConfig: function() {
		var prj = project();

		prj.forEach(function(name) {
			var path = sourcePath + name;
			gulp.src([
					path +'/js/app.js',
					path +'/js/common/config.js'
				])
				.pipe(uglify({outSourceMap: false}))
				.pipe(concat('lib.config.js'))
				.pipe(gulp.dest(buildPath + name +'/js/'))
		});

	},

	/*
	* router 定义 和 common 函数生成 各项目
	* lib.common.js
	*/
	createRouter: function() {
		var strpath = {
	        'zepto':      'empty:',
	        'underscore': 'empty:',
	        'backbone':   'empty:',
	        'handlebars': 'empty:',
	        'require':    'empty:',
	        'router':     'home/js/common/router',
	        'appCommon':  'common/common'
		};

	    rjs({
	        baseUrl: sourcePath,
	        out: 'home/js/lib.common.js',
	        include: [
	        	'router', 
	        	'appCommon'
	        ],
		    paths: strpath
	    })
		.pipe(uglify({outSourceMap: false}))
		.pipe(gulp.dest(buildPath));
	},

	/*
	* 开启服务
	* npm install --save-dev gulp-connect
	* npm install --save-dev gulp-shell
	*/
	connect: function(type) {

        var version = os.platform(),
        	url = '';

        connect.server({
            root: type,
            port: "9999",
            livereload: true
        });

        switch (version) {
            case 'win32':
                url = 'start http://localhost:9999';
                break;
            case 'darwin':
                url = 'open http://localhost:9999';
                break;
        }

        gulp.src('')
            .pipe(shell(url));
            
    }
}

gulp.task('default', function(){
	// task.templates();
	// task.sass();
	// task.createFrame();
	// task.connect('source');
	task.createConfig();
	console.log(project());
});