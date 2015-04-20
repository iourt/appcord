define([
    'appPath/routerRedirect',
	'layout/index.hbs'
], function(
    routerRedirect,
    tmpl
){

	var View = Backbone.View.extend({

		template: tmpl,

        events: {
            'click .js_link': 'toList'
        },

        initialize: function() {
            var self = this;

            self.tel = 0;
        },

        render: function() {
            var self = this;

            self.setElement( self.template() );

            return self;
        },

        toList: function() {
            var self = this;

            routerRedirect.toJump({
                opts: {
                    'direction': 'left',
                    'href': '#list'
                },
                callback: function(){
                    alert(2);
                }
            });
        }
	});

	return View;
});
