define([
    'appPath/routerRedirect',
	'layout/list.hbs'
], function(
    routerRedirect,
    tmpl
){

	var View = Backbone.View.extend({

		template: tmpl,

        events: {
            'click .js_back': 'toBack'
        },

        initialize: function() {
            var self = this;

            self.tel = 0;
        },

        render: function() {
            this.setElement( this.template() );

            return this;
        },

        toBack: function() {
            var self = this;

            routerRedirect.toBack({
                opts: {
                    'href': '#index'
                },
                callback: function(){
                    alert(2);
                }
            });
        }
	});

	return View;
});
