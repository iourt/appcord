define([
    'underscore',
    'backbone'
], function(
    _,
    Backbone
) {
    var AppRouter = Backbone.Router.extend({
        routes: {
            '': 'list',
            'list': 'list', //----------------list page
            'login': 'login', //--------------login page
            'comment': 'comment', //----------comment page
            'detail': 'detail', //------------detail page
            'add': 'add' //-------------------add page
        }
    });

    var appRouter = new AppRouter();

    return appRouter;
});
