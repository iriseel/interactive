var cube_image;
var cube_images = [
    "img/beauty.jpg",
    "img/evil.jpg",
    "img/good.jpg",
    "img/hate.jpg",
    "img/love.jpg",
    "img/memory.jpg",
    "img/time.jpg",
    "img/ugly.jpg"
];

//For whatever reason, if you use background:url() instead of background-image:url() the image becomes grayed out once it changes. So just use background-image.
$("#cube_images").change(function(){
    //cube_image is a number, as defined in the html
    cube_image = $("#cube_images").val();
    console.log(cube_image);
    $(".face").css("background-image", "url(" + cube_images[cube_image] + ")");
})


$("#speed").change(function() {
  
  var speed_value = $(this).val() + "s";

  $(".eye").css("animation-duration", speed_value);

});


$("#spacing").change(function() {
  
  var spacing_value = $(this).val() + "%";

  $(".face").css("width", spacing_value);
  $(".face").css("height", spacing_value);

});
