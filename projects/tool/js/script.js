// load the airtable library
var Airtable = require('airtable');
Airtable.configure({
    endpointUrl: 'https://api.airtable.com',
    apiKey: 'keyiOgSOViugCdt6V'
});
var base = Airtable.base('appGBbeFkCMCZx8Nv');


// set up a blank array for all your rows
const rows = [];

// this line of code says to get all the info from AirTable
base('critters').select({
    // If you want to sort the records, include that here:
    //  sort: [
    //     {field: 'Title', direction: 'asc'}
    // ],
}).eachPage(gotPageofRows, gotAllRows);

// Here, we're going to get batches of rows from the airtable, 
// and add each row to our rows array.
function gotPageofRows(records, fetchNextPage) {
    console.log("gotPageofRows()");

    rows.push(...records);

    fetchNextPage();
}

// once we've got all rows in our array, the following code runs.
function gotAllRows(err) {
    console.log("gotAllRows()");

    // first, if there's an error we're going to log that.
    if (err) {
        console.log("Error loading rows");
        console.error(err);
        return;
    }

    // if no error, we're going to run two more functions.
    consoleLogRows();
    
    //I'm nesting function setup_critters() into the function showRows in order to make it a callback. I have to make setup_critters a callback so that it runs only after showRows has fully executed, otherwise the browser will be trying to run functions on .critters before they've been loaded from airtable, thereby disabling all my functions ;A;
    showRows(setup_critters);
}

// consoleLogRows simply logs each row to the console, 
// so you can see its data and fields.
function consoleLogRows() {
    
    console.log("consoleLogRows()");
    
    rows.forEach((row) => {
        console.log("Row:", row);
    });

}

//declare data_index globally, then increment it for every .critter locally within function showRows
var data_index = 1,
    //setting size for welcome critter (data_index = 0) to be 96, since for airtable the data_index starts at 1 (see immediately above)
    sizes = ["auto"];

// showRows is what puts the content onto the HTML page
//again, putting setup_critters into showRows to make it a callback
function showRows(setup_critters) {
    console.log("showRows()");
    
    rows.forEach((row) => {
        
        /*
        const caption = document.createElement("div");
        caption.innerText = row.fields.name;
        caption.classList.add("caption");
        document.body.appendChild(caption);
        */

         //add the images from the airtable, if there is an image to be added (i.e. if someone uploaded an accompanying image)
        if (row.fields.photo) {
            
            //create div with class .critter and data-index
            const critter = document.createElement("div");
            critter.classList.add("critter");
            critter.dataset.index = data_index;
            
            
            //set .critter size based on size listed in airtable
            const cm_size = row.fields.size;
            const px_size = cm_size*37.8*2 + "px";
            //the critter sizes are submitted in cm, and 1 cm = 37.8px. Because img is 50% of .critter, double .critter size so that img is life-size
            critter.style.width = px_size;
            critter.style.height = px_size;
            
            sizes.push(px_size);
            
            document.body.appendChild(critter);
            
            //create img from airtable photos
            const image = document.createElement("img");
            image.src = row.fields.photo[0].url;
            
            //insert the image into div .critter, not just at end of document (as document.body)
            critter.appendChild(image);
            
            
        }
        
        //console.log(data_index);
        //increment data_index for every airtable row (i.e. for every critter)
        data_index++;
        
        
    }); 
    
    //again, callback!!
    setup_critters();
}
































//declaring global variables, outside of any functions. They are then updated within functions
var critters,
    random_bounces_small = [],
    random_bounces_big = [],
    random_speeds = [],
    random_opacities = [],
    random_blurs = [],
    caughts = [],
    directions = [],
    critters_length,
    checking_offset,
    global_caught = false;

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

//setting this up for callback: critters must be declared inside callback, or else browser will be looking to execute functions on critters before they've loaded from airtable
function setup_critters() {
    
    //Had to use arrays to randomize bounces, speeds etc. Will later use data-index and local var, index, to pinpoint/match .critter sequence in array with corresponding .random_speed value in array, for example

    critters = $(".critter");
    critters_length = critters.length;

    // create random bounce, speed, etc. values, add (push) to corresponding arrays
    for (let i = 0; i < critters.length; i++) {

        var random_bounce_big = Math.floor(Math.random() * 200 + 50);
        random_bounces_big.push(random_bounce_big);

        var random_bounce_small = Math.floor(Math.random() * 100 + 50);
        random_bounces_small.push(random_bounce_small);

        var random_speed = Math.floor(Math.random() * 200 + 100);
        random_speeds.push(random_speed);
        
        //??Is this right for an opacity between 0.5 and 1?
        var random_opacity = Math.random() * (1 - 0.3 + 1) + 0.3;
        random_opacities.push(random_opacity);
        
        var random_blur = getRandomInt(30, 5);
        random_blurs.push(random_blur);

        //all critters start out not caught, and going right
        var critter_caught = false;
        caughts.push(critter_caught);

        var direction = "right";
        directions.push(direction);
        
        
        //special settings for welcome critter, which has data-index = 0
        random_blurs[0] = 0;
        random_opacities[0] = 1;
        random_speeds[0] = 100;
        
    };

    //console.log(caughts);

    //console.log("welcome critter blur is" + random_blurs[0]);
    //console.log("welcome critter opacity is" + random_opacities[0]);
    
    //All these .each functions are calling functions, such as randomY(), which can be defined outside of setup_critters(). The functions are defined further down.
    
    //apply randomY function to each instance of .critter and .caption
    $(".critter").each(randomizeY);
    //$(".caption").each(randomizeY);
    
    $(".critter").each(randomize_opacity);
    
    $(".critter").each(randomize_blur);
    
    //??How do I add easing to this so it's not so 走走停停???
    $(".critter").each(big_bounce); 
    //$(".caption").each(big_bounce); 
    
    checking_offset = setInterval(checking_offset, 1000);
    
    //console.log("set up success!!!!");
    
    console.log("sizes are" + sizes);
    
    //?? There seems to be a delay between when console logs "escaping!" and when the critter moves, if at all
    //Make image escape cursor when hitbox .critter is mouseentered. Use mouseenter instead of mouseover, as mouseover fires multiple times when you hover over a .critter, rather than just once
    $(".critter").mouseenter(function() {

        var index = $(this).attr("data-index");

        console.log("escaping!");

        //MUST PUT if statement INSIDE a function for it to check for truth/false on each mouseover, rather than only on page load
        if (caughts[index] == false) { 

          // subtract image width and height from document dimensions if you don't wnat image to escape offscreen
          var wWidth = $(window).width(),
              wHeight = $(window).height(),
              nextX,
              nextY;
            
        //welcome critter doesn't escape on hover
          if (index == 0) {
          }
            
            else {
            //wWidth is maximum value, + 100 is minimum
              nextX = Math.floor(Math.random() * (wWidth)) + 100;
              nextY = Math.floor(Math.random() * (wHeight)) + 100;

                $(this).stop();

                $(this).animate({
                  left: nextX + "px",
                  top: nextY + "px"
                });
            };
          
          //?? some critters don't resume animations after mouseover???
        //have mouse-entered critter resume movement
          var current_critter = $(this);

            setTimeout(function() {
                console.log("resume");
                resume_animation(current_critter);

            }, 150);

        };

      });

    $("img").click(click_critter);
    
    //this doesn't need to be in setup_critters() since p.welcome is in html at start of page load, but just putting it here so the click_critters can be together ^w^
    $("p.welcome").click(click_critter);

};

//randomize starting Y positions of .critters
function randomizeY() {
    
   //Y position range is 5 times window height (as large as .bg_wrapper) but minus .critter height
   var height = $(window).height() * 5 - $(this).height();

    var randomY = getRandomInt(height, 0);

    $(this).css({
        top: randomY
    });
}; 

//randomize opacity for critters
function randomize_opacity() {
    
    var index = $(this).attr("data-index");
    
    $(this).css({
        opacity: random_opacities[index]
    });
    
    //console.log("random opacity is" + random_opacity);
};

//randomize bluriness for critters
function randomize_blur() {
    
    var index = $(this).attr("data-index");
    
    $(this).css({
        "filter": "blur("+random_blurs[index]+"px)"
    });
    
    //console.log("random blur is" + random_blur);
};
//to randomize swimming and bouncing animations, I'm using callback instead of setInterval to loop animations (because otherwise when I clearInterval on $("img").click, it would clear ALL the animations on other critters as well, not just the animation on the clicked critter)
function big_bounce(){

    var index = $(this).attr("data-index");
    directions[index] = "right";

    $(this).animate(
        {top:"+=" + random_bounces_big[index],
            left:"+=" + random_speeds[index]}, 2100);

    $(this).animate(
        {top:"-=" + random_bounces_big[index],
        left:"+=" + random_speeds[index]}, 2100, small_bounce);

    console.log(index + "critter: big bounce");
};


function small_bounce(){

    var index = $(this).attr("data-index");
    directions[index] = "right";

    $(this).animate({
        top: "+=" + random_bounces_small[index],
        left: "+=" + random_speeds[index]
    }, 2100);

    $(this).animate({
        top: "-=" + random_bounces_small[index],
        left: "+=" + random_speeds[index]
    }, 2100, big_bounce);

    console.log(index + "critter: small bounce");

};


function big_bounce_left(){

    var index = $(this).attr("data-index");
       directions[index] = "left";
    
    $(this).animate(
        {top:"+=" + random_bounces_big[index],
        left:"-=" + random_speeds[index]}, 2100);

    $(this).animate(
        {top:"-=" + random_bounces_big[index],
        left:"-=" + random_speeds[index]}, 2100, small_bounce_left);

    console.log(index + "critter: big bounce left");
};

function small_bounce_left(){

    var index = $(this).attr("data-index");
    directions[index] = "left";
    
        $(this).animate({
            top: "+=" + random_bounces_small[index],
            left: "-=" + random_speeds[index]
        }, 2100);

        $(this).animate({
            top: "-=" + random_bounces_small[index],
            left: "-=" + random_speeds[index]
        }, 2100, big_bounce_left);

    console.log(index + "critter: small bounce left");
};


//??Why does the critter bounce back and forth at the boundary that triggers the reverse_bounce (i.e. at offset_left > 800 or width)
function check_offset() {

    var offset = $(this).offset();
    var offset_left = offset.left;

    var width = $(".bg_wrapper").width();

    var index = $(this).attr("data-index");

    //console.log(index + "critter's offset is" + offset_left);
//  console.log("window width is" + width);

    //if .critter upper-left is offset relative to its parent container (body) more than 800 AND it is traveling right AND it hasn't been caught, THEN reverse direction
    if ((offset_left > 800) && (directions[index] == "right") && (caughts[index] == false)) {
        $(this).stop();

        //have to specify a starting animate, can't just do $(this).animate( {}, large_bounce_left — for whatever reason that makes everything just go up, no bounce down
        $(this).animate({
            top: "+=" + random_bounces_small[index],
            left: "-=" + random_speeds[index]
        }, 2100);

        $(this).animate({
            top: "-=" + random_bounces_small[index],
            left: "-=" + random_speeds[index]
        }, 2100, big_bounce_left);

        directions[index] = "left";
        
        console.log(index + "critter was travelling right, now going left!");

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
       
       console.log(index + "critter was travelling left, now going right!");

    }
    
    else {
        //console.log("keep going on course. please!!!");
        
    };

  //??the directions don't seem to actually be changing??
  // console.log(index + "critter's direction is" + directions[index]);
};

//set checking_offset() as function to be called as interval in setup_critters() above
function checking_offset(){
    $(".critter").each(check_offset);
//  $(".caption").each(check_offset);
};

// resume bounce after mouseenter
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
            left:"-=" + random_speeds[index]}, 2100, small_bounce_left);
    };
}

//show images when clicked!    
function click_critter() {

    var index = $(this).parent().attr("data-index");

    console.log(caughts[index]);

    var currentX,
        currentY,
        offset;

    offset = $(this).offset();
    currentX = offset.left;
    currentY = offset.top;

//  console.log(currentX);
//  console.log(currentY);

    //if current critter isn't caught, and no other critter is caught, make current critter large
    if ((caughts[index] == false) && (
    global_caught == false)) {

        //stop animation on clicked .critter, not img
        $(this).parent().stop();

        $(this).css({
            width: "100%"
        });

        //??Why isn't this pinning the critter to top-left corner of window???
        $(this).parent().css({
            top: "0vh",
            left: "0vw",
            width: "100vw",
            height: "100vh",
            filter: "blur(0px)",
            opacity: "1"
            //?? How to write this filter properly??
            //filter: url("#turbulence_critter");
        });


        var caught_sfx = new Audio("sfx/victory.mp3");
        caught_sfx.play();

        caughts[index] = true;
        global_caught = true;

    }

    //if current critter has been caught, release it
    else if (caughts[index] == true) {
    
        //special code for welcome critter
        if (index == 0) {
            $(this).css({
                width: "100%"
            });
        }
        
        else {
            $(this).css({
                width: "50%"
            });
        };
            
        $(this).parent().css({
            top: currentY + "px",
            left: currentX + "px",
            width: sizes[index],
            height: sizes[index],
            opacity: random_opacities[index],
            "filter": "blur("+random_blurs[index]+"px)"
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

    //display catch and release requirements
    else {

        //?? How to make type seem like it's enlarging from center, not top-left corner??
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


//Do special thing for .welcome critter
$("p.welcome").click(function() {
    
    var index = $(this).parent().attr("data-index");
    
    if (caughts[index] == false) {
        $(this).text("What does it mean to capture a living thing in a photograph?");
    }
    
    else {
        $(this).text("You've been welcomed.");
    }

}); 