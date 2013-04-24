(function($, window){
  "use strict";

  var Application = function() {
    var app = this;

    var $pages = $('.page');

    app.Pages = {
      _showOnly: function(id) {
        $pages.not(id).hide();
        return $pages.filter(id).show();
      },

      _controllers: {
        index: function($page) {
        },

        build: function($page) {
        },

        shoot: function($page) {
        }
      },

      go: function(page) {
        var $page = this._showOnly('#' + page);
        if (page in this._controllers) {
          this._controllers[page].call(this, $page);
        }
      }
    };

    app.start = function(){
      app.Pages.go('index');
    };

  };

  window.App = new Application();
  window.App.start();

})(jQuery, window);
