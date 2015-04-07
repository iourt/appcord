define([
    'appCommon',
	'view/viewIndex',
    'cPath/routerRedirect'
], function(
    Common,
	PageView,
    routerRedirect
){

	var ShowView = {

        init: function() {
            var self = this;

            var pageView = new PageView();
        
            $(".js_view").html(pageView.render().el);
        }
		
	};

	return ShowView;

});
