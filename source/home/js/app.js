require([
    'zepto',
	'backbone',
    'require',
    'common/router'
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

    // router start
    Backbone.history.start();
});