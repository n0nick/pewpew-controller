(function($, window){
  "use strict";

  var Application = function(debug) {
    var app = this;

    var $pages = $('.page');

    var log = function() {
      if (app.debug && window.console) {
        Function.prototype.apply.call(window.console.log, window.console,
                                        Array.prototype.slice.call(arguments));
      }
    };

    app.debug = false;

    app.Connection = {
      socket: null,

      start: function(host) {
        log("[Connection] Starting connection to", host);
        this.socket = new window.WebSocket("ws://" + host);
        this.socket.onopen = this.opened;
        this.socket.onclose = this.closed;
      },
      opened: function() {
      },
      closed: function() {
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
          var serverHost = this._getParam('server');
          if (!serverHost) {
            log("[Controller] No server address provided");
            $('h2', $page).text('Please supply a server address.');
          } else {
            this._app.Connection.start(serverHost);
          }
        },

        build: function($page) {
        },

        shoot: function($page) {
        }
      },

      go: function(page) {
        log("[Controller] viewing page", page);

        var $page = this._showOnly('#' + page);
        if (page in this._controllers) {
          this._controllers[page].call(this, $page);
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
