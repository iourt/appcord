define([
    'underscore',
    'backbone'
], function(
    _,
    Backbone
) {
    var AppRouter = Backbone.Router.extend({
        routes: {
            '': 'index',
            'index': 'index'
        }
    });

    var appRouter = new AppRouter();

    return appRouter;
});
