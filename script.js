(function(window, $){
  "use strict";

  var $qr    = $('#qr'),
      size = $qr.height(),
      $buttons = $('#actions button'),

      updateQR = function(message) {
        $qr.children('canvas').remove();
        $qr.qrcode({
          text: message.replace(/[^\w]/g, ''),
          width: $qr.width(),
          height: $qr.height()
        });
      };

  $qr.width(size).height(size);

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

  $(window).resize(function() {
    $qr.width(size).height(size);
  });

})(window, jQuery);
