App = Ember.Application.create();

Server = DS.Model.extend({
  ip_address: DS.attr('string'),

  connect: function() {
    console.log("supposed to connect to " + this.get('ip_address'));
  }
});

App.Router.map(function() {
  this.route("connect", { path: "/connect/:server" });
  this.route("build", { path: "/build" });
});

App.IndexRoute = Ember.Route.extend({
  model: Server.createRecord()
});

App.ConnectRoute = Ember.Route.extend({
  enter: function(p) {
    console.log('bototm');
  }
});

App.BuildRoute = Ember.Route.extend({
  model: function() {
    return ['fire', 'water', 'wind', 'stone', 'magic', 'ice'];
  }
});
