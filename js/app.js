App = Ember.Application.create();

App.Router.map(function() {
  this.route("build", { path: "/build" });
});

App.IndexRoute = Ember.Route.extend({
});

App.BuildRoute = Ember.Route.extend({
  model: function() {
    return ['fire', 'water', 'wind', 'stone', 'magic', 'ice'];
  }
});
