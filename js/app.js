(function($, window){
  "use strict";

  var Application = function() {
    var app = this;

    app.debug = false;
    app.WEAPON_APPEARING_INTERVAL = 100;
    app.WEAPON_COMBINATION_SIZE = 3;
    app.SHOOTING_TIME = 1000;

    app.$templates = $('.template').hide();
    app.$content   = $('#content');

    var log = function() {
      if (app.debug && window.console) {
        Function.prototype.apply.call(window.console.log, window.console,
                                        Array.prototype.slice.call(arguments));
      }
    };

    app.$ = function(selector) {
      return $(selector, app.$content);
    };

    app.Connection = {
      connection: null,
      active: false,

      start: function(host) {
        log("[Connection] Starting connection to:", host);
        this.connection = "http://" + host;
        $(this).trigger("opened");
      },

      stop: function() {
        this.active = false;
        $(this).trigger("closed");
      },

      send: function(data) {
        log("[Connection] Sending to server:", data);
        $.ajax(this.connection, { dataType: "jsonp", data: data });
      }
    },

    app.Controllers = {
      _app: app,

      _render: function(id) {
        var $template = app.$templates.filter(id);
        app.$content.html($template.html());
      },

      _getParam: function(key) {
        var query = window.location.search.substring(1),
            vars = query.split('&');
        for (var i = 0; i < vars.length; i++) {
          var pair = vars[i].split('=');
          if (decodeURIComponent(pair[0]) == key) {
            return decodeURIComponent(pair[1]);
          }
        }
      },

      _controllers: {
        index: function() {
          var app = this._app;

          var serverHost = this._getParam("server");
          if (!serverHost) {
            log("[Controller] [index] No server address provided");
            app.$("h2").text("Please supply a server address.");

          } else {
            $(app.Connection).on("opened", function() {
              app.Controllers.go("build");
            });
            app.Connection.start(serverHost);
          }
        },

        build: function() {
          // show weapons one-by-one
          var app = this._app;
          var $weapons = app.$("#weapons button");
          var addWeapon = function() {
            var $hidden = $weapons.filter(".hidden");
            var random = Math.round(Math.random() * $hidden.length-1);
            $hidden.eq(random).removeClass("hidden");
          };
          $weapons.addClass("hidden").removeAttr('disabled');
          window.setInterval(addWeapon, app.WEAPON_APPEARING_INTERVAL);

          // weapon construction
          var selectedWeapons = [];
          $weapons.on('click', function() {
            var weapon = $(this).text();
            selectedWeapons.push(weapon);
            log("[Controller] [build] weapons selected:", selectedWeapons);

            $(this).attr('disabled', true);

            if (selectedWeapons.length >= app.WEAPON_COMBINATION_SIZE) {
              // time to shoot
              app.Controllers.go('shoot', { weapons: selectedWeapons });
            }
          });
        },

        shoot: function(params) {
          var app = this._app;

          log("[Controller] [Shoot] Shooting with weapons:", params.weapons);

          // send fire
          app.Connection.send({
            w: params.weapons.join(',')
          });

          // go back after shooting time ended
          var goBack = function() {
            app.Controllers.go('build');
          };
          window.setTimeout(goBack, app.SHOOTING_TIME);
        }
      },

      go: function(page, params) {
        params = params || null;
        log("[Controller] viewing page:", page, params);

        this._render('#' + page);
        if (page in this._controllers) {
          this._controllers[page].call(this, params);
        }
      }
    };

    app.start = function(){
      app.debug = !!(app.Controllers._getParam('debug'));
      app.Controllers.go('index');
    };

  };

  window.App = new Application();
  window.App.start();

})(jQuery, window);
