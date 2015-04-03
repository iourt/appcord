require([
    'zepto',
	'backbone',
    'router',
    'require'
],function(
    $, 
    Backbone, 
    router, 
    require
){
    // homepage
    router.on('route:list', function(){
        require(['Page/List'], function(ShowView){
            ShowView.init();
        });
    });

    // login page
    router.on('route:login', function(){
        require(['Page/Login'], function(ShowView){
            ShowView.init();
        });
    });

    // comment page
    router.on('route:comment', function(){
        require(['Page/Comment'], function(ShowView){
            ShowView.init();
        });
    });

    // detail page
    router.on('route:detail', function(){
        require(['Page/Detail'], function(ShowView){
            ShowView.init();
        });
    });

    // detail page
    router.on('route:add', function(){
        require(['Page/Add'], function(ShowView){
            ShowView.init();
        });
    });

    // router start
    Backbone.history.start();
});