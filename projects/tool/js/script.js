//// load the airtable library
//var Airtable = require('airtable');
//Airtable.configure({
//    endpointUrl: 'https://api.airtable.com',
//    apiKey: 'keyiOgSOViugCdt6V'
//});
//var base = Airtable.base('appGBbeFkCMCZx8Nv');
//
//
//// set up a blank array for all your rows
//const rows = [];
//
//// this line of code says to get all the info from AirTable
//base('critters').select({
//    // If you want to sort the records, include that here:
//    //  sort: [
//    //     {field: 'Title', direction: 'asc'}
//    // ],
//}).eachPage(gotPageofRows, gotAllRows);
//
//// Here, we're going to get batches of rows from the airtable, 
//// and add each row to our rows array.
//function gotPageofRows(records, fetchNextPage) {
//    console.log("gotPageofRows()");
//
//    rows.push(...records);
//
//    fetchNextPage();
//}
//
//// once we've got all rows in our array, the following code runs.
//function gotAllRows(err) {
//    console.log("gotAllRows()");
//
//    // first, if there's an error we're going to log that.
//    if (err) {
//        console.log("Error loading rows");
//        console.error(err);
//        return;
//    }
//
//    // if no error, we're going to run two more functions.
//    consoleLogRows();
//    showRows();
//}
//
//// consoleLogRows simply logs each row to the console, 
//// so you can see it's data and fields.
//function consoleLogRows() {
//    
//    console.log("consoleLogRows()");
//    
//    rows.forEach((row) => {
//        console.log("Row:", row);
//    });
//
//}
//
//var data_index = 0;
//
//// showRows is what puts the content onto the HTML page
//function showRows() {
//    console.log("showRows()");
//    rows.forEach((row) => {
//        
//        const caption = document.createElement("div");
//        caption.innerText = row.fields.name;
//        caption.classList.add("caption");
//        document.body.appendChild(caption);
//
//         //add the images from the table, if there is an image to be added
//        if (row.fields.photo) {
//            
//            //??This isn't working??
//            const critter = document.createElement("div");
//            critter.classList.add("critter");
//            critter.dataset.index = data_index;
//
//            const image = document.createElement("img");
//            image.src = row.fields.photo[0].url;
//            
//            const size = row.fields.size;
//            //the critter sizes are submitted in cm, and 1 cm = 37.8px
//            image.style.width = size*37.8 + "px";
//            
//            critter.appendChild(image);
//            
//            console.log(size);
//            console.log("critter width is" + image.style.width);
//        }
//        
//        console.log(data_index);
//        data_index++;
//    })
//}








































//trying to randomize start positions of .critters

var random_speed,
    global_caught = false;

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
};


    //define function that assigns random starting Y
   function randomY() {
       //5 times window height (as large as .bg_wrapper) but minus .critter height (200px)
       var height = $(window).height() * 5 - 200;

        var randomY = getRandomInt(height, 0);

        $(this).css({
            top: randomY
        });
   }; 

//apply randomY function to each instance of .critter and .caption
$(".critter").each(randomY);

 $(".caption").each(randomY);

//randomize opacity for critters
function random_opacity() {
    //??Is this right for an opacity between 0.5 and 1?
    var random_opacity = Math.random() * (1 - 0.3 + 1) + 0.3;
    
    $(this).css({
        opacity: random_opacity
    });
    
    //console.log("random opacity is" + random_opacity);
};

$(".critter > img").each(random_opacity);


//randomize bluriness for critters
function random_blur() {
    var random_blur = getRandomInt(30, 5);
    
    $(this).css({
        "filter": "blur("+random_blur+"px)"
    });
    
    //console.log("random blur is" + random_blur);
};

$(".critter > img").each(random_blur);

//randomize swimming and bouncing animations: using callback instead of setInterval to loop animations (because otherwise when I clearInterval on $("img").click, it would clear ALL the animations on other critters as well, not just the animation on the clicked critter)

//Had to use data-index to randomize bounces and speeds, previously console.log was showing that the values were being randomized but the critters weren't actually

var critters = $(".critter");
var random_bounces_small = [],
    random_bounces_big = [],
    random_speeds = [],
    caughts = [],
    directions = [],
    critters_length = critters.length;

// create random bounce amounts, add to array
for (let i = 0; i < critters.length; i++) {

    var random_bounce_big = Math.floor(Math.random() * 200 + 50);
    random_bounces_big.push(random_bounce_big);

    var random_bounce_small = Math.floor(Math.random() * 100 + 50);
    random_bounces_small.push(random_bounce_small);

    var random_speed = Math.floor(Math.random() * 200 + 100);

    random_speeds.push(random_speed);

    var critter_caught = false;

    caughts.push(critter_caught);


    var direction = "right";

    directions.push(direction);
};


    console.log(caughts);


function big_bounce(){

    var index = $(this).attr("data-index");
//            console.log("index =" + index);

    $(this).animate(
        {top:"+=" + random_bounces_big[index],
            left:"+=" + random_speeds[index]}, 2100);

    $(this).animate(
        {top:"-=" + random_bounces_big[index],
        left:"+=" + random_speeds[index]}, 2100, small_bounce);

    console.log("big bounce");
};


function small_bounce(){

    var index = $(this).attr("data-index");
//            console.log("index =" + index);

    $(this).animate({
        top: "+=" + random_bounces_small[index],
        left: "+=" + random_speeds[index]
    }, 2100);

    $(this).animate({
        top: "-=" + random_bounces_small[index],
        left: "+=" + random_speeds[index]
    }, 2100, big_bounce);

    console.log("small bounce");

};


    //??How do I add easing to this so it's not so 走走停停???
    $(".critter").each(big_bounce); 

//          $(".caption").each(big_bounce); 


function big_bounce_reverse(){

    var index = $(this).attr("data-index");
//            console.log("index =" + index);

    $(this).animate(
        {top:"+=" + random_bounces_big[index],
        left:"-=" + random_speeds[index]}, 2100);

    $(this).animate(
        {top:"-=" + random_bounces_big[index],
        left:"-=" + random_speeds[index]}, 2100, small_bounce_reverse);

    console.log("big bounce reverse");
};

function small_bounce_reverse(){

    var index = $(this).attr("data-index");
//                console.log("index =" + index);

        $(this).animate({
            top: "+=" + random_bounces_small[index],
            left: "-=" + random_speeds[index]
        }, 2100);

        $(this).animate({
            top: "-=" + random_bounces_small[index],
            left: "-=" + random_speeds[index]
        }, 2100, big_bounce_reverse);

    console.log("small bounce reverse");
};


//??Why does the critter bounce back and forth at the boundary that triggers the reverse_bounce (i.e. at offset_left > 300 or width)
function check_offset() {

    var offset = $(this).offset();
    var offset_left = offset.left;

    var width = $(".bg_wrapper").width();

    var index = $(this).attr("data-index");

       console.log("offset is" + offset_left);
//               console.log("window width is" + width);

    if ((offset_left > 500) && (directions[index] == "right") && (caughts[index] == false)) {
        $(this).stop();

        //have to specify a starting animate, can't just do $(this).animate( {}, large_bounce_reverse — for whatever reason that makes everything just go up, no bounce down
        $(this).animate({
            top: "+=" + random_bounces_small[index],
            left: "-=" + random_speeds[index]
        }, 2100);

        $(this).animate({
            top: "-=" + random_bounces_small[index],
            left: "-=" + random_speeds[index]
        }, 2100, big_bounce_reverse);

        directions[index] = "left";

    }

   else if ((offset_left < 0) && (directions[index] == "left") && (caughts[index] == false)) {

        $(this).animate({
            top: "+=" + random_bounces_small[index],
            left: "+=" + random_speeds[index]
        }, 2100);

        $(this).animate({
            top: "-=" + random_bounces_small[index],
            left: "+=" + random_speeds[index]
        }, 2100, big_bounce);

       directions[index] = "right";

    };

  //??the directions don't seem to actually be changing??
   console.log(index + "direction is" + directions[index]);
};


function checking_offset(){
    $(".critter").each(check_offset);
//            $(".caption").each(check_offset);

};


var checking_offset = setInterval(checking_offset, 1000);

// resume bounce after mouseover
function resume_animation(e) {
    var index = $(this).attr("data-index");
//            console.log("index =" + index);

    if (directions[index] === "right") {
        e.animate({
            top:"+=" + random_bounces_big[index],
            left:"+=" + random_speeds[index]}, 2100);

        e.animate({
            top:"-=" + random_bounces_big[index],
            left:"+=" + random_speeds[index]}, 2100, small_bounce);

    } else if (directions[index] === "left") {
        e.animate({
            top:"+=" + random_bounces_big[index],
            left:"-=" + random_speeds[index]}, 2100);

        e.animate({
            top:"-=" + random_bounces_big[index],
            left:"-=" + random_speeds[index]}, 2100, small_bounce_reverse);
    };
}

//?? There seems to be a delay between when console logs "escaping!" and when the critter moves, if at all
//Make image escape cursor
$(".critter").mouseenter(function() {

    var index = $(this).attr("data-index");

    console.log("escaping!");

  //MUST PUT if statement INSIDE a function for it to check for truth/false on each mouseover, rather than only on page load
  if (caughts[index] == false) { 

      // subtract image width and height from document dimensions if you don't wnat image to escape offscreen
      var wWidth = $(window).width(),
          wHeight = $(window).height(),

      //dWidth/2 is maximum value, + 100 is minimum
          nextX = Math.floor(Math.random() * (wWidth)) + 100,
          nextY = Math.floor(Math.random() * (wHeight)) + 100;

        $(this).stop();

        $(this).animate({
          left: nextX + "px",
          top: nextY + "px"
        });


      //?? some critters don't resume animations after mouseover???
      var current_critter = $(this);

        setTimeout(function() {
            console.log("resume");
            resume_animation(current_critter);

        }, 150);

    };

  });


    
function click_critter() {

    var index = $(this).parent().attr("data-index");

    console.log(caughts[index]);

    var currentX,
        currentY,
        offset;

    offset = $(this).offset();
    currentX = offset.left;
    currentY = offset.top;

//                console.log(currentX);
//                console.log(currentY);

    //if current critter isn't caught, and no other critter is caught, make current critter large
    if ((caughts[index] == false) && (
    global_caught == false)) {

        //stop animation on clicked .critter, not img
        $(this).parent().stop();

        $(this).css({
            width: "100%",
            filter: "blur(0px)",
            opacity: "1",
        });

        $(this).parent().css({
            top: "0vh",
            left: "0vw",
            width: "100vw",
            height: "100vh",
            //?? How to write this filter properly??
            //filter: url("#turbulence_critter");
        });


        var caught_sfx = new Audio("sfx/victory.mp3");
        caught_sfx.play();

        caughts[index] = true;
        global_caught = true;

        //Do special thing for .welcome critter
        //??? Why is this not replacing innerHTML even thoug console.log is showing the if condition is being met properly??
        if ($(this).hasClass("welcome")) {
           //console.log("WELCOME SELECTED!!!");
            $(this).innerHTML = "What does it mean to capture a living thing in a photograph?"
        };
    }

    //if current critter has been caught, release it
    else if (caughts[index] == true) {
        var random_opacity = Math.random() * (1 - 0.3 + 1) + 0.3;
    
        var random_blur = getRandomInt(30, 5);
    
        $(this).css({
            width: "100px",
            opacity: random_opacity,
            "filter": "blur("+random_blur+"px)"
        });

        $(this).parent().css({
            top: currentY + "px",
            left: currentX + "px",
            width: "400px",
            height: "400px"
        });

        var current_critter = $(this).parent();

        //?? Animation does not resume for all critters?? It seems that it doesn't resume for the ones that stop successfully??
        setTimeout(function() {
            console.log("resume");
            resume_animation(current_critter);

        }, 150);

        caughts[index] = false;
        global_caught = false;


        }

    //display catch and release reqs
    else {

        //?? How to make type seem like it's enlarging from center, not top-left corner??
        //?? Why is .info showing up on page load and then disappearing??
        $(".info").css({
            visibility: "visible",
            opacity: "1",
            fontSize: "1.25em"
        });

        setTimeout(function() {
            $(".info").css({
                visibility: "hidden",
                opacity: "0",
                fontSize: "1em"
                });
            }, 2500);
    };

        console.log("caught is" + caughts[index]);  
    };


$("img").click(click_critter);
$("p.welcome").click(click_critter);
