define([
    'appPath/routerRedirect'
], function (
    routerRedirect
) {

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

        setMenu: function() {
            var self = this;

            var direction = 'left';
                url = '';

            $('.js_menu li').on('click', function(){
                var type = $(this).data('type');

                switch (type){
                    case 'home':
                        url = '#index';
                    break;

                    case 'find':
                        url = '#list';
                    break;

                    case 'img':
                        url = '#list';
                    break;

                    case 'msg':
                        url = '#list';
                    break;

                    case 'user':
                        url = '../member/#index';
                    break;
                }

                routerRedirect.toJump({
                    opts: {
                        'direction': direction,
                        'href': url
                    },
                    callback: function(){
                        alert(2);
                    }
                });
            });
        }
    }

    return setCommon;
});