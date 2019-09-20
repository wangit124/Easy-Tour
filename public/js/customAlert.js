// override default browser alert
window.alert = function(msg, callback) {
  $(".custom-message").text(msg);
  $(".custom-alert").css("animation", "fadeIn 0.3s linear");
  $(".custom-alert").css("display", "flex");
  $(".LA-container").css("animation", "fadeIn 0.3s linear");
  $(".LA-container").css("background", "rgba(0, 0, 0, 0.5)");
  setTimeout(function() {
    $(".custom-alert").css("animation", "none");
    $(".LA-container").css("animation", "none");
  }, 300);
};

$(function() {
  // add listener for when our confirmation button is clicked
  $("#confirm-button").click(function() {
    $(".custom-alert").css("animation", "fadeOut 0.3s linear");
    $(".LA-container").css("background", "rgba(0, 0, 0, 0)");
    setTimeout(function() {
      $(".custom-alert").css("display", "none");
      $(".custom-alert").css("animation", "none");
      $(".LA-container").css("animation", "none");
    }, 300);
  });
});
