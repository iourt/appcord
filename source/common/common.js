define([
    'appPath/routerRedirect',
    'appPath/appAgent'
], function (
    routerRedirect,
    appAgent
) {

    var isHybrid = appAgent.isHybrid();

    var setCommon = {

        loading: {
            show: function(){
                var $loading = $('.loading');
                $loading.css('display', 'block');
            },
            hide: function(){
                var $loading = $('.loading');
                $loading.css('display', 'none');
            }
        },
        
        scrollFix: function(elem) {
            // Variables to track inputs
            var startY, startTopScroll;

            elem = (typeof elem == "object") ? elem : document.querySelector(elem);

            // If there is no element, then do nothing    
            if (!elem)
                return;

            // Handle the start of interactions
            elem.addEventListener('touchstart', function (event) {
                startY = event.touches[0].pageY;
                startTopScroll = elem.scrollTop;

                if (startTopScroll <= 0)
                    elem.scrollTop = 1;

                if (startTopScroll + elem.offsetHeight >= elem.scrollHeight)
                    elem.scrollTop = elem.scrollHeight - elem.offsetHeight - 1;

            }, false);
        },

        setMenu: function(callback) {
            var self = this;

            var direction = 'left';
                url = [];

            $('.js_menu li').off().on('click', function(){

                var type = $(this).data('type');

                switch (type){
                    case 'home':
                        url = [
                            'home/#index',
                            '/home/index.html#index'
                        ];
                    break;

                    case 'find':
                        url = [
                            'home/#list',
                            '/home/index.html#list'
                        ];
                    break;

                    case 'user':
                        url = [
                            'member/#index',
                            '/member/index.html#index'
                        ];
                    break;
                }

                routerRedirect.toJump({
                    opts: {
                        'direction': direction,
                        'href': url
                    },
                    callback: function(){

                        if ( typeof (callback) == "function" ) {
                            callback();
                        } else {
                            console.log('success');
                        }
                        
                    }
                });
                
            });
        }
    }

    return setCommon;
});