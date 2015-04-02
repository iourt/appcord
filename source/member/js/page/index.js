define([
    'Common',
	'View/LoginView'
], function(
    Common,
	PageView
){

	var ShowView = {

        init: function() {
            var self = this;

            console.log(Common.getParams('code'));

            if (!Common.isWx()) {
                $('#app_view').html('<div class="app_wx">请在微信中浏览页面</div>');
                return;
            }

            Common.setTitle("手机号码绑定");

            var pageView = new PageView();
        
            $("#app_view").html(pageView.render().el);
        }
		
	};

	return ShowView;

});
