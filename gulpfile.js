var fs   = require('fs'),
	argv = require('yargs').argv,
	os   = require('os');

var build     = require('./tools/build.js'),
	project   = require('./tools/getProject.js'),
	movefiles = require('./tools/moveFiles.js'),
	pagename  = require('./tools/getFilesName.js');

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
							'../themes/all.css?v='+ version,
							'../themes/'+ name +'.css?v='+ version,
						],
						'js': [
							'../cordova.js?v='+ version,
							'../cordova_plugins.js?v='+ version,
							'../common/app.frame.js?v='+ version,
							'js/common/unit.config.js?v='+ version
							// 'js/common/unit.router.js?v='+ version,
							// '../common/unit.common.js?v='+ version
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

	_getCommonName: function(){
		var strPath = {
		        'zepto':      'empty:',
		        'underscore': 'empty:',
		        'backbone':   'empty:',
		        'handlebars': 'empty:',
		        'require':    'empty:'
			};

		var cName = pagename(2);

		cName.forEach(function(name){
			var tmpName = name;
			
			tmpName = tmpName.replace(/^./, tmpName.charAt(0).toUpperCase());

			strPath['app'+ tmpName] = 'empty:';
		});

		return JSON.parse(JSON.stringify(strPath));
	},

	_getUnitName: function() {
		var self = this;

		var result = {},
			prj = project(),
			dName = JSON.parse(JSON.stringify(pagename(3)));

		prj.forEach(function(v){
			result[v] = {};

			dName[v].forEach(function(name){
				var tmpName = name;

				tmpName = tmpName.replace(/^./, tmpName.charAt(0).toUpperCase());

				result[v]['unit'+ tmpName] = 'empty:';
			});
		});

		return JSON.parse(JSON.stringify(result));
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
			fileName = 'frame.js',
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
					path +'/js/config.js',
					path +'/js/app.js'
				])
				.pipe(uglify({outSourceMap: false}))
				.pipe(concat('unit.config.js'))
				.pipe(gulp.dest(buildPath + name +'/js/common/'))
		});

	},

	/*
	* common 定义 和 common 函数生成
	* 公共common app.*filename*.js
	* 项目公共common prj.*filename*.js
	*/
	createCommon: function() {
		var self = this;

		var prj = project(),
			cName = pagename(2),
			dName = JSON.parse(JSON.stringify(pagename(3)));

		cName.forEach(function(name){

			var tmpPath = self._getCommonName(),
				tmpName = name;
			
			tmpName = tmpName.replace(/^./, tmpName.charAt(0).toUpperCase());

			tmpPath['app'+ tmpName] = 'common/'+ name;

			rjs({
				baseUrl: sourcePath,
				out: 'common/app.'+ name +'.js',
				include: [
					'app'+ tmpName
				],
				paths: tmpPath
			})
			.pipe(uglify({outSourceMap: false}))
			.pipe(gulp.dest(buildPath));

		});

		prj.forEach(function(v){

			dName[v].forEach(function(name){

				var tmpPath = self._getUnitName()[v],
					tmpName = name;

				tmpName = tmpName.replace(/^./, tmpName.charAt(0).toUpperCase());

				for(i in self._getCommonName()) tmpPath[i] = 'empty:';

				tmpPath['unit'+ tmpName] = 'js/common/'+ name;

				rjs({
					baseUrl: sourcePath + v,
					out: 'js/common/unit.'+ name +'.js',
					include: [
						'unit'+ tmpName
					],
					paths: tmpPath
				})
				.pipe(uglify({outSourceMap: false}))
				.pipe(gulp.dest(buildPath + v));
			});

		});
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
		var self = this;

		var strPath = self._getCommonName(),
			prj = project(),
			files = pagename(1);

		prj.forEach(function(v){
			var tmpPath = self._getUnitName()[v];

			for(i in strPath) tmpPath[i] = 'empty:';

			files[v].forEach(function(name) {
				rjs({
					baseUrl: sourcePath + v +'/js',
					out: 'page/'+ name +'.js',
					include: [ 'page/'+ name],
					paths: tmpPath
				})
				// .pipe(uglify({outSourceMap: false}))
				.pipe(gulp.dest(buildPath + v +'/js'));
			});
		});
	}
}

gulp.task('default', function(){
	task.templates();
	task.sass('source');
	task.createFrame('source');

	if (dev == 'debug') {
		task.connect('source');
	}
});

gulp.task('build', function(){
	// task.templates();
	task.sass('build');
	task.createFrame('build');
	task.createConfig();
	task.createCommon();
	task.moveHtml();
	task.minrjs();

	if (dev == 'debug') {
		task.connect('build');
	}
});