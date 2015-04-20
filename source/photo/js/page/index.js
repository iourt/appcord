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

            appCommon.setMenu();

            // alert(JSON.stringify(window.navigator));

            // window.navigator.webkitGetUserMedia({ 'video': true }, function (stream) {

            //     alert(JSON.stringify(stream));

            // }, function(error){

            //     alert(error);

            // });
        }
		
	};

	return ShowView;

});
