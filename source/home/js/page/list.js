define([
    'appPath/appAgent',
    'view/viewList'
], function(
    appAgent,
    PageView
){
    var isHybrid = appAgent.isHybrid();

	var ShowView = {

        init: function() {
            var self = this;

            var pageView = new PageView();
        
            $(".js_view").html(pageView.render().el);
        }
		
	};

	return ShowView;

});
