define([
    'appCommon',
	'view/viewIndex'
], function(
    Common,
	PageView
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
