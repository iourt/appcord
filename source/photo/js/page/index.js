define([
    'appPath/appAgent',
    'appPath/common',
    'view/viewIndex'
], function(
    appAgent,
    appCommon,
    PageView
){
    var isHybrid = appAgent.isHybrid();

	var ShowView = {

        init: function() {
            var self = this;

            var pageView = new PageView();
        
            $(".js_view").html(pageView.render().el);

            appCommon.scrollFix('.js_view');
            
            appCommon.setMenu();
        }
		
	};

	return ShowView;

});
