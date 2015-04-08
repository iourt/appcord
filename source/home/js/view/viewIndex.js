define([
	'zepto',
	'backbone',
    'cPath/common',

	'layout/index.hbs'
], function(
    $, 
    Backbone,
    Common,

    tmpl
){

	var View = Backbone.View.extend({

		template: tmpl,

        events: {
        },

        initialize: function() {
            var self = this;

            self.tel = 0;
        },

        render: function() {
            this.setElement( this.template() );

            return this;
        }
	});

	return View;
});
