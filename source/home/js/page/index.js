define([
    'appCommon',
	'view/viewIndex',
    'appAppAgent'
    'appRouterRedirect'
], function(
    Common,
	PageView,
    appAgent,
    routerRedirect
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
