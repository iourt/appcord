var fs   = require('fs'),
	argv = require('yargs').argv,
	os   = require('os');

var build     = require('./tools/build.js'),
	project   = require('./tools/getProject.js'),
	movefiles = require('./tools/moveFiles.js'),
	pagename  = require('./tools/getPageName.js');

var gulp 		 = require('gulp'),
	sass         = require('gulp-sass'),
	minifycss    = require('gulp-minify-css'),
	minifyHTML   = require('gulp-minify-html'),
	replace      = require('gulp-replace'),
	htmlreplace  = require('gulp-html-replace'),
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
		var prj = project();

		prj.forEach(function(name){
			gulp.src(sourcePath + name + '/*.html')
				.pipe(
					htmlreplace({
						'css': [
							'/themes/all.css?v='+ version,
							'/themes/'+ name +'.css?v='+ version,
						],
						'js': [
							'/cordova.js?v='+ version,
							'/cordova_plugins.js?v='+ version,
							'/common/app.frame.js?v='+ version,
							'js/common/prj.config.js?v='+ version,
							'js/common/prj.router.js?v='+ version,
							'/common/app.common.js?v='+ version
						]
					})
				)
				.pipe(gulp.dest(buildPath + name));
		});

		// gulp.src('source/**/*.html')
		// 	.pipe(htmlreplace({
		// 		'css': ['all.css?v='+ version],
		// 		'js': [
		// 			'/cordova.js?v='+ version,
		// 			'/cordova_plugins.js?v='+ version,
		// 			'/common/app.frame.js?v='+ version,
		// 			'js/common/prj.config.js?v='+ version,
		// 			'js/common/prj.router.js?v='+ version,
		// 			'/common/app.common.js?v='+ version
		// 		]
		// 	}))
		// 	.pipe(gulp.dest(buildPath));
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
	* prj.config.js
	* npm install --save-dev gulp-concat
	*/
	createConfig: function() {
		var prj = project();

		prj.forEach(function(name) {
			var path = sourcePath + name;
			gulp.src([
					path +'/js/common/config.js',
					path +'/js/app.js'
				])
				// .pipe(uglify({outSourceMap: false}))
				.pipe(concat('prj.config.js'))
				.pipe(gulp.dest(buildPath + name +'/js/common/'))
		});

	},

	/*
	* router 定义 和 common 函数生成 各项目
	* lib.common.js
	*/
	createRouter: function() {
		var prj = project();

		prj.forEach(function(name) {
		    rjs({
		        baseUrl: sourcePath,
		        out: name +'/js/common/prj.router.js',
		        include: [
		        	'router'
		        ],
			    paths: {
			        'zepto':      'empty:',
			        'underscore': 'empty:',
			        'backbone':   'empty:',
			        'handlebars': 'empty:',
			        'require':    'empty:',
			        'router':     name +'/js/common/router'
				}
		    })
			.pipe(uglify({outSourceMap: false}))
			.pipe(gulp.dest(buildPath));
		});
	},


	/*
	* common 定义 和 common 函数生成
	* app.common.js
	*/
	createCommon: function() {
		var strpath = {
	        'zepto':      'empty:',
	        'underscore': 'empty:',
	        'backbone':   'empty:',
	        'handlebars': 'empty:',
	        'require':    'empty:',
	        'router':     'empty:',
	        'appCommon':  'common/common'
		};

	    rjs({
	        baseUrl: sourcePath,
	        out: 'common/app.common.js',
	        include: [
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
        	path = sourcePath,
        	url = '';

        if (type == 'build') {
        	path = buildPath;
        }

        connect.server({
            root: path,
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
            
    },

    /*
    * 压缩JS
    */
	minrjs: function() {
		var strpath = {
	        'zepto':      'empty:',
	        'underscore': 'empty:',
	        'backbone':   'empty:',
	        'handlebars': 'empty:',
	        'require':    'empty:',
	        'router':     'empty:',
	        'appCommon':  'empty:',
	        'cPath':      '../../common'
		};

		var prj = project(),
			files = pagename();

		prj.forEach(function(v){
			files[v].forEach(function(name) {
				rjs({
					baseUrl: sourcePath + v +'/js',
					out: 'page/'+ name +'.js',
					include: [ 'page/'+ name],
					paths: strpath
				})
				.pipe(uglify({outSourceMap: false}))
				.pipe(gulp.dest(buildPath + v +'/js'));
			});
		});
	}
}

gulp.task('default', function(){
	task.templates();
	task.sass('source');
	task.createFrame('source');
	// task.connect('source');
});

gulp.task('build', function(){
	// task.templates();
	task.sass('build');
	task.createFrame('build');
	task.createConfig();
	task.createRouter();
	task.createCommon();
	task.moveHtml();
	task.minrjs();
	task.connect('build');
});