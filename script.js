(function($){
  "use strict";

  var $qr    = $('#qr'),
      width  = $qr.width(),
      height = $qr.height(),

      updateQR = function(message) {
        $qr.children('canvas').remove();
        $qr.qrcode({
          text: message,
          width: width,
          height: height
        });
      };

  updateQR("Start");

  $('#actions > li').on('click', function(e) {
    updateQR($(this).text());
    e.preventDefault();
  });

})(jQuery);
