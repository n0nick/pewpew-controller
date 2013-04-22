(function($){
  "use strict";

  var $qr    = $('#qr'),
      width  = $qr.width(),
      height = $qr.height(),
      $buttons = $('#actions button'),

      updateQR = function(message) {
        $qr.children('canvas').remove();
        $qr.qrcode({
          text: message,
          width: width,
          height: height
        });
      };

  updateQR("Start");

  $buttons.on('click', function(e) {
    updateQR($(this).text());
    e.preventDefault();
  });

  $buttons.on('touchstart', function() {
    $(this).addClass('active');
  });
  $buttons.on('touchend', function() {
    $(this).removeClass('active');
  });

})(jQuery);
