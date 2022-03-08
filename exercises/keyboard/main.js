//must have padding var set outside of keydown function, or else padding is reset to 0 every time a key is pressed and therefore doesn't accumulate across presses
var padding = 0;
var new_img_set = [
    "img/snowglobe1.png",
    "img/snowglobe2.png",
    "img/snowglobe3.png",
    "img/snowglobe4.png",
    "img/snowglobe5.png",
    "img/snowglobe6.png"
];

var sequential_img = 0,
    remembered = false,
    img_width = $("img.recall").width();

setInterval(function(){ 
    if ((sequential_img == 6) && (padding == 30)) {
        $(".message").html("Enter");
        remembered = true;
        //????$("#audio"); doesn't work????
        var enter_sfx = document.getElementById("audio");
        enter_sfx.play();
    }   
    
    else if (sequential_img != 6) {
        $(".message").html("I am trying to remember a scene, will you help me?<br><br>&#9731;<br><br> Your options are: +, -, space, capslock, delete, enter");
         }
    
    console.log("padding:" + padding);
    
    //??why is img_width always undefined???
    console.log ("img width:" + img_width);
    console.log("sequence:" + sequential_img);
}, 500);


$(window).keydown(function(e){

  var key = e.key,
      new_img = document.createElement("img");
    
    
  console.log(key);
    console.log(sequential_img);

    //If I wanted to check for a word typed, I would have to make an array and check its contents ... (I haven't done that)
    if ((remembered == true) && (key == "Enter")) {
        window.location.replace("memory.html");
    }

         
    // add new images for + pressed
    else if ((key == "+") && (sequential_img < 6)) {
       /*
        var random_img = [Math.floor(Math.random() * new_img_set.length)];

        new_img.setAttribute("src", new_img_set[random_img]);

        */

        new_img.setAttribute("src", new_img_set[sequential_img]); $(new_img).addClass("recall");

        $("body").append(new_img); console.log(new_img_set[sequential_img]);
        console.log("sequence:" + sequential_img);

        sequential_img +=1;    

    }

    else if ((key == "-") && (sequential_img > 0)) {

       console.log(sequential_img);
        $("img.recall").last().remove(); 

        sequential_img -=1;  
     }


    // add padding between images for space key pressed
    else if (key == " ") {

            padding = padding + 10;

            padding_increment = padding + "px";

            $("img.recall").css("padding", padding_increment);

            console.log("padding:" + padding);

    }

    // add img size for capslock pressed
    else if (key == "CapsLock") {
            var img_width = $("img.recall").width() + 10;

            img_width_px = img_width + "px";

             $("img.recall").css(
              "width", img_width_px);
        
            console.log ("img width:" + img_width);
    }

      else if (key == "Backspace") {
        $("img.recall").remove();
        sequential_img = 0;
        padding = 0;
      }
    
    
});




//MEMORY HTML JS
function playSound() {
    var sound = document.getElementById("audio");
     if (sound.paused == false) {
      sound.pause();
  } else {
      sound.play();
  }
};