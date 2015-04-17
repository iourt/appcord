require([
    'zepto',
	'backbone',
    'require',
    'unitPath/router'
],function(
    $, 
    Backbone, 
    require,
    router
){
    // homepage
    router.on('route:index', function(){
        require(['page/index'], function(ShowView){
            ShowView.init();
        });
    });

    // list
    router.on('route:list', function(){
        require(['page/list'], function(ShowView){
            ShowView.init();
        });
    });

    // router start
    Backbone.history.start();
});