define([
    'appPath/common',
    'appPath/appAgent'
], function (
    appCommon,
    appAgent
) {
    var isHybrid = appAgent.isHybrid();

    var routerRedirect = {
        /*
        * 页面返回
        */
        toBack: function (params) {
            var self = this;

            if (!isHybrid) {
                
                window.location.href = window.location.origin + params.opts.href[0];

                return;
            }

            params.opts.direction = 'right';

            self._slide(params);
        },

        /*
        * 页面跳转
        * var options = {
        *     "direction": "left", //-----'left|right|up|down', default 'left' (which is like 'next')
        *     "duration": 500, //---------in milliseconds (ms), default 400
        *     "slowdownfactor": 3, //-----overlap views (higher number is more) or no overlap (1), default 4
        *     "iosdelay": 100, //---------ms to wait for the iOS webview to update before animation kicks in, default 60
        *     "androiddelay": 150, //-----same as above but for Android, default 70
        *     "winphonedelay": 250, //----same as above but for Windows Phone, default 200,
        *     "fixedPixelsTop": 0, //-----the number of pixels of your fixed header, default 0 (iOS and Android)
        *     "fixedPixelsBottom": 48 //--the number of pixels of your fixed footer (f.i. a tab bar), default 0 (iOS and Android)
        *     'href': '' //---------------跳转的地址
        * };
        * @params:
        *     opts: {
        *         direction: 页面转动方向[left|right|up|down]
        *         href: 页面跳转的URL
        *         success: 成功回调函数
        *         error: 失败回调函数
        *     },
        *     callback: function(){},
        *     failure: function(){}
        */
        toJump: function (params) {
            var self = this;

            if (!isHybrid) {

                window.location.href = window.location.origin + params.opts.href[0];

                return;
            }

            self._slide(params);
        },

        _slide: function(params){
            var self = this;

            var options = {
                    'direction': 'left',
                    'duration': 500, 
                    'slowdownfactor': 3, 
                    'iosdelay': 100,
                    'androiddelay': 150,
                    'winphonedelay': 250, 
                    'fixedPixelsTop': 0,
                    'fixedPixelsBottom': 48
                },
                callback = params.callback ? params.callback : '';

            if (params.opts) {

                var len = params.opts.href ? params.opts.href.length : 0;

                if (len == 0) {

                    appCommon.loading.show();

                }

                for (i in params.opts) options[i] = params.opts[i];

                if (len > 1) {

                    options.href = params.opts.href[1];

                } else if (len == 1) {

                    options.href = params.opts.href[0];

                }

            }
            
            window.plugins.nativepagetransitions.slide(
                options,
                function (msg) {
                    callback();
                },
                function (msg) {
                    if (params.failure) {
                        params.failure();
                    } else {
                        console.log(msg);
                    }
                }
            );
        },

        /*
        * 抽屉效果
        * @params:
        * {
        *     'origin': 'left', //--left|right', open the drawer from this side of the view, default 'left'
        *     'action': 'open', //--'open|close', default 'open'
        *     'duration': 300, //---in milliseconds (ms), default 400
        *     'iosdelay': 50, //----ms to wait for the iOS webview to update before animation kicks in, default 60
        *     'href': '' //---------url
        * }
        */
        toMenu: function(params) {
            var self = this;

            var options = {
                'origin': 'left',
                'action': 'open',
                'duration': 300,
                'iosdelay': 50,
                'href': ''
            };

            for (i in params) options[i] = params[i];

            window.plugins.nativepagetransitions.drawer(options);
        },

        /*
        * 获取事件元素
        * @options
        *     elem: 元素[默认是a]
        */
        getTarget: function (e, options) {
            var target = e.target,
                $that = '';

            var el = options && options.elem ? options.elem : 'a';

            if (target.nodeName !== el.toUpperCase()) {

                $that = $(target).closest(el);

            } else {

                $that = $(target);

            }

            return $that;
        }
    };

    return routerRedirect;
});