(function($, window){
  "use strict";

  var Application = function() {
    var app = this;

    var $pages = $('.page');

    var log = function() {
      if (app.debug && window.console) {
        Function.prototype.apply.call(window.console.log, window.console,
                                        Array.prototype.slice.call(arguments));
      }
    };

    app.debug = false;
    app.WEAPON_APPEARING_INTERVAL = 1000;

    app.Connection = {
      connection: null,
      active: false,

      start: function(host) {
        log("[Connection] Starting connection to", host);
        this.connection = host;
        $(this).trigger("opened");
      },

      stop: function() {
        this.active = false;
        $(this).trigger("closed");
      }
    },

    app.Controllers = {
      _app: app,

      _showOnly: function(id) {
        $pages.not(id).hide();
        return $pages.filter(id).show();
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
        index: function($page) {
          var serverHost = this._getParam("server");
          if (!serverHost) {
            log("[Controller] [index] No server address provided");
            $("h2", $page).text("Please supply a server address.");
          } else {
            $(this._app.Connection).on("opened", function() {
              app.Controllers.go("build");
            });
            this._app.Connection.start(serverHost);
          }
        },

        build: function($page) {
          // show weapons one-by-one
          var $weapons = $("#weapons button", $page);
          var addWeapon = function() {
            var $hidden = $weapons.filter(".hidden");
            var random = Math.round(Math.random() * $hidden.length-1);
            $hidden.eq(random).removeClass("hidden");
          };
          $weapons.addClass("hidden");
          window.setInterval(addWeapon, this._app.WEAPON_APPEARING_INTERVAL);

          // weapon construction
          var selectedWeapons = [];
          $weapons.on('click', function() {
            var weapon = $(this).text();
            selectedWeapons.push(weapon);
            log("[Controller] [build] weapons selected:", selectedWeapons);

            $(this).attr('disabled', true);

            if (selectedWeapons.length >= 3) { // time to shoot
              app.Controllers.go('shoot', { weapons: selectedWeapons });
            }
          });
        },

        shoot: function($page, params) {
          log("[Controller] [Shoot] Shooting with weapons", params.weapons);
        }
      },

      go: function(page, params) {
        log("[Controller] viewing page", page, params);

        var $page = this._showOnly('#' + page);
        if (page in this._controllers) {
          this._controllers[page].call(this, $page, params);
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
