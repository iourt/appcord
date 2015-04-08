define([
    'appPath/common',
    'appPath/appAgent',
    'appPath/routerRedirect',
    'view/viewIndex'
], function(
    Common,
    appAgent,
    routerRedirect,
    PageView
){

	var ShowView = {

        init: function() {
            var self = this;

            var pageView = new PageView();
        
            $(".js_view").html(pageView.render().el);

            var ua = navigator.userAgent.toLowerCase();

            alert(ua);
        }
		
	};

	return ShowView;

});
