
$(function() {
  $('form').submit(function(event) {
    event.preventDefault(); 
    var dream = $('input').val();
    $(location).attr('href','https://url-shortener-andres.glitch.me/new/' + dream);
  });

});
