define([
    'gsAppAgent'
], function (
    appAgent
) {

    var isHybrid = appAgent.
    
    var routerRedirect = {
        /*
        * 点返回按钮（http://conf.ctripcorp.com/display/Wireless/c.widget.guider）
        * @params
        *     url: 指定页面返回到具体的URL【只对H5有用】
        *     param: APP 返回上一页 带回参数
        */
        toBack: function (params) {
            var self = this;

            var url = params && params.url ? params.url : '',
                opts = params && params.param ? params.param : '';

            if (self.isHybrid) {

                if (typeof (opts) == "object") {
                    self.Guider.backToLastPage({ param: JSON.stringify(opts) });
                } else {
                    self.Guider.backToLastPage({ param: opts });
                }

            } else {

                var from = Lizard.P('from');

                if (from) {

                    window.location.href = from;

                } else {

                    if (url) {
                        window.location.href = url;
                    } else {
                        window.history.back();
                    }

                }

            }

        },

        // 返回首页
        toHome: function () {
            var self = this;

            if (self.isHybrid) {
                Guider.home();
            } else {
                this.toJump({
                    url: ['http://m.ctrip.com']
                });
            }
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
        },

        /*
        * 页面跳转
        * @params
        *     host: 是否启用m.ctrip.com访问页面，启用填true，默认不启用
        *     url: 数组【第一个值是H5 URL，第二个值APP URL，如果两个都一样就填一个, URL传空点击就是刷新当前页】
        *     targetModel: 
        *          1: 处理ctrip://协议
        *          2: 开启新的H5页面
        *          3: 使用系统浏览器打开
        *          4: 开启本地新的H5页面，此时URL为相对路径；5.6版本加入
        */
        toJump: function (params) {
            var self = this;

            var url = params && params.url ? params.url : '',
                targetModel = params && params.targetModel ? params.targetModel : '4';
        }
    };

    return routerRedirect;
});