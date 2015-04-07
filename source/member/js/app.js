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
    router.on('route:index', function(){
        require(['page/index'], function(ShowView){
            ShowView.init();
        });
    });

    // router start
    Backbone.history.start();
});