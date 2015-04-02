define(function() {
    var appAgent = {

        ua: navigator.userAgent.toLowerCase(),

        //是微信环境
        isWeixinBrowser:function(){

            var type = /micromessenger/.test(this.ua);
            return type;
            
        },

        // 是APP环境
        isHybrid: function() {

            var type = /ctripwireless/.test(this.ua);
            return type;

        },

        // 是否苹果
        isApple: function() {

            var type = /iphone|ipad|ipod/.test(this.ua);
            return type;

        },

        // 是否Android
        isAndroid: function() {

            var type = /android/.test(this.ua);
            return type;

        },

        // APP版本
        appVersion: function() {

            var type = '';
            type = this.ua.slice(this.ua.indexOf("ctripwireless"));
            type = type.slice(type.indexOf("_") + 1);
            return type;

        }
    };

    return appAgent;
});