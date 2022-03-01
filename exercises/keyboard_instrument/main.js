// this is where you write your javascript

$(window).keydown(function(what){

  var key = what.key;

  console.log(key);

    //If I wanted to check for a word typed, I would have to make an array and check its contents
    
    $("body").append(key);
    
  if (key == "a") {
    $(".message").html("Apple");
  }
  else if (key == "A") {
    $(".message").html("APPLE");
  }
  else if (key == "b") {
    $(".message").html("Bagpipes");
  }
  else if (key == "c") {
    $(".message").html("Cadillac");
  } 
  else if (key == "Backspace") {
    $(".message").html("deleted!!!!");
  }

});



