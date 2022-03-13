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

//?? Why is the image becoming grayed out once it changes???
$("#cube_images").change(function(){
    //cube_image is a number, as defined in the html
    cube_image = $("#cube_images").val();
    console.log(cube_image);
    $(".face").css("background", "url(" + cube_images[cube_image] + ") repeat");
})


$("#speed").change(function() {
  
  var speed_value = $(this).val() + "s";

  $(".eye").css("animation-duration", speed_value);

});
