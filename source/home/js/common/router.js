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
            'index': 'index', //--首页
        }
    });

    var appRouter = new AppRouter();

    return appRouter;
});
