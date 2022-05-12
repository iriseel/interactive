//Getting user to start in middle of bg_wrapper rather than top-left corner of window ... not exactly midway through .bg_wrapper but close enough for now
function Scrolldown() {
    var width_half = $(".bg_wrapper").width() / 2;
    var height_half = $(".bg_wrapper").height() / 2;
    
     window.scroll(width_half, height_half);
    
//    console.log("height_half is" + height_half);
//    console.log("width_half is" + width_half);
}

window.onload = Scrolldown;


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
var data_index = 13,
    //setting size for welcome critter (data_index = 0) and the 12 .texts (kinda at random since the sizes don't matter), since for airtable the data_index starts at 13 (see immediately above)
    sizes = ["auto",
            100,
            100,
            100,
            100,
            100,
            100,
            100,
            100,
            100,
            100,
            100,
            100],
    movements = [];

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
            critter.classList.add("hitbox");
            critter.dataset.index = data_index;
            
            
            //set .critter size based on size listed in airtable
            const cm_size = row.fields.size;
            const px_size = cm_size*37.8*1.3333 + "px";
            //the critter sizes are submitted in cm, and 1 cm = 37.8px. Because img_frame (and therefore img) is 75% of .critter, multiply .critter size by 1.333 so that img is life-size
            critter.style.width = px_size;
            critter.style.height = px_size;
            
            sizes.push(px_size);
            
           //append critters to .bg_wrapper so that when they bounce beyond the boundaries of bg_wrapper they don't add white space (i.e. they are controlled by .bg_wrapper's overflow:hidden)
            document.getElementsByClassName("bg_wrapper")[0].appendChild(critter);
            
            //add div with .img_frame so that I can append both image and .img_name to it, since divs can't be appended to images.
            const img_frame = document.createElement("div"); img_frame.classList.add("img_frame");
            critter.appendChild(img_frame);
            
            //create and append div with .img_name to .img_frame
            const img_name = document.createElement("div");
            img_name.classList.add("img_name");
            
            //get the file name of img (row.fields.photo[0].url gives airtable link, not image name)
            img_name.innerText = row._rawJson.fields.photo[0].filename;
            img_frame.appendChild(img_name);
            
            
            //create img from airtable photos
            const image = document.createElement("img");
            image.src = row.fields.photo[0].url;
            
            //insert the image into div .img_frame, not just at end of document (as document.body)
            img_frame.appendChild(image);
            
//            ??THIS ISN't WOKRING??
//            
//            var movement = row.fields.movement[0];
//             movements.push(movement);
//            
//            console.log(movements);
            
            
            
//            const caption = document.createElement("div");
//        caption.innerText = row.fields.name;
//        caption.classList.add("caption");
            
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
    global_caught = false,
    myTimeout;

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

//setting this up for callback: critters must be declared inside callback, or else browser will be looking to execute functions on critters before they've loaded from airtable
function setup_critters() {
    
    console.log(sizes);
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
        
        
        //special settings for welcome critter, which has data-index = 0 ... and then for the .texts critters ... there has to be a better way to do this. .... PLEASE
        //don't need to set random_speeds values for .texts just because the animations are only applied onto .hitbox
        random_blurs[0] = 0;
        random_opacities[0] = 1;
        random_blurs[1] = 2;
        random_opacities[1] = 1;
        random_blurs[2] = 1;
        random_opacities[2] = 1;
        random_blurs[3] = 2;
        random_opacities[3] = 1;
        random_blurs[4] = 1;
        random_opacities[4] = 1;
        random_blurs[5] = 2;
        random_opacities[5] = 1;
        random_blurs[6] = 1;
        random_opacities[6] = 1;
        random_blurs[7] = 2;
        random_opacities[7] = 1;
        random_blurs[8] = 1;
        random_opacities[8] = 1;
        random_blurs[9] = 2;
        random_opacities[9] = 1;
        random_blurs[10] = 1;
        random_opacities[10] = 1;
        random_blurs[11] = 2;
        random_opacities[11] = 1;
        random_blurs[12] = 1;
        random_opacities[12] = 1;
        
    };

    //console.log(caughts);
    
    //All these .each functions are calling functions, such as randomY(), which can be defined outside of setup_critters(). The functions are defined further down.
    
//    have .texts fade in after a pause
    texts_fadein = setTimeout(function() {
        
   $(".texts").each(function() {
       
       $(this).css({
            opacity: "1"
            });
        });
    }, 600);
    $(".critter").each(set_transitions); $(".texts").each(set_transitions);
    $(".info").each(set_transitions);
    
    //apply randomY function to each instance of .critter
    $(".critter").each(randomize_position); 
    $(".critter").each(randomize_opacity);
    
    //do NOT set blur for .texts as that totally screws up the positioning for some reason — even setting blur as 0 fucks it up
    $(".hitbox").each(randomize_blur);
    
    $(".hitbox").each(check_offset);
    
    //console.log("set up success!!!!");
    
    console.log("sizes are" + sizes);
    
    //?? There seems to be a delay between when console logs "escaping!" and when the critter moves, if at all
    //Make image escape cursor when .hitbox is mouseentered. Use mouseenter instead of mouseover, as mouseover fires multiple times when you hover over a .hitbox, rather than just once
    $(".hitbox").mouseenter(function() {

        clearTimeout(myTimeout);
        var index = $(this).attr("data-index");

        console.log("escaping!");

        //MUST PUT if statement INSIDE a function for it to check for truth/false on each mouseover, rather than only on page load
        if (caughts[index] == false) { 

          // subtract image width and height from document dimensions if you don't wnat image to escape offscreen
          var wWidth = $(window).width(),
              wHeight = $(window).height(),
              nextX,
              nextY;
            
        //.texts critters don't escape on hover
          if ($(this).children().hasClass("texts")) {
          }
            
            else {
            //wWidth is maximum value, + 300 is minimum
              nextX = Math.floor(Math.random() * (wWidth)) + 300;
              nextY = Math.floor(Math.random() * (wHeight)) + 300;

                $(this).stop();

                $(this).animate({
                  left: nextX + "px",
                  top: nextY + "px"
                }, 200);
            };
          
        //??This seems to interfere with mouseenter function??
        //have mouse-entered critter resume movement
          var current_critter = $(this);

            myTimeout = setTimeout(function() {
//                console.log("resume");
                resume_animation(current_critter);

            }, 1200);

        }
        
        //this is critical to have, otherwise resume_animation will be called after mouseenter even if the critter photo has been clicked (i.e. opened/enlarged)
        else if (caughts[index] == true) {
            clearTimeout(myTimeout);
        };

      });

    $("img").click(click_critter);
    
    //this doesn't need to be in setup_critters() since .texts are in html at start of page load, but just putting it here so the click_critters can be together ^w^
    //MUST call click_text before click_critter, as click_critter modifies the global_caught and caughts[index] values, which then affect the click_text. But click_text doesn't modify those values so it can be called first.
    $(".texts").click(click_text);
    $(".texts").click(click_critter); 
    

};

//set transitions for various elements; need to call this after a delay bc otherwise everything is transitioning right upon page load which is NOT the aesthetic I'm trying to project to the world ya know?
function set_transitions(){
    $(this).css({
        transition: "1s"
    });
};

//randomize starting Y positions of .critters
function randomize_position() {
    
    var index = $(this).attr("data-index");
    
   //Y position range is 5 times window height (as large as .bg_wrapper) but minus height of .critter, minus the maximum bounce range
   var height = $(".bg_wrapper").height() - $(this).height() - random_bounces_big[index];
    //adding a little buffer from right edge just in case it fucks with check_offset
    var width = $(".bg_wrapper").width() - $(this).width() - 200;

    var randomY = getRandomInt(height, 0);
    var randomX = getRandomInt(width, 0);

    $(this).css({
        top: randomY,
        left: randomX
    });
}; 

//randomize opacity for .texts
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

    var offset = $(this).offset();
    var offset_top = offset.top;
    
    $(this).animate(
        {top:"+=" + random_bounces_big[index],
        left:"+=" + random_speeds[index]}, 2100);

    $(this).animate(
        {top:"-=" + random_bounces_big[index],
        left:"+=" + random_speeds[index]}, 2100, check_offset);

//    console.log(index + "critter: big bounce");
//    console.log(index + "critter top is" + offset_top);

};

function small_bounce(){

    var index = $(this).attr("data-index");
    directions[index] = "right";

    var offset = $(this).offset();
    var offset_top = offset.top;
    
    $(this).animate({
        top: "+=" + random_bounces_small[index],
        left: "+=" + random_speeds[index]
    }, 2100);

    $(this).animate({
        top: "-=" + random_bounces_small[index],
        left: "+=" + random_speeds[index]
    }, 2100, big_bounce);

//    console.log(index + "critter: small bounce");
//    console.log(index + "critter top is" + offset_top);

};

function big_bounce_left(){

    var index = $(this).attr("data-index");
       directions[index] = "left";
    
    var offset = $(this).offset();
    var offset_top = offset.top;
    
    $(this).animate(
        {top:"+=" + random_bounces_big[index],
        left:"-=" + random_speeds[index]}, 2100);

    $(this).animate(
        {top:"-=" + random_bounces_big[index],
        left:"-=" + random_speeds[index]}, 2100, check_offset);

//    console.log(index + "critter: big bounce left");
//    console.log(index + "critter top is" + offset_top);
    
};

function small_bounce_left(){

    var index = $(this).attr("data-index");
    directions[index] = "left";
    
    var offset = $(this).offset();
    var offset_top = offset.top;
    
        $(this).animate({
            top: "+=" + random_bounces_small[index],
            left: "-=" + random_speeds[index]
        }, 2100);

        $(this).animate({
            top: "-=" + random_bounces_small[index],
            left: "-=" + random_speeds[index]
        }, 2100, big_bounce_left);

//    console.log(index + "critter: small bounce left");
//    console.log(index + "critter top is" + offset_top);
    
};

function check_offset() {
    
    var offset = $(this).offset();
    var offset_left = offset.left;

    var wrapper_width = $(".bg_wrapper").width() - $(this).width();

    var index = $(this).attr("data-index");

    //console.log(index + "critter's offset is" + offset_left);
//  console.log("window width is" + width);

    //if .critter upper-left is offset relative to its parent container (body) more than 800 AND it is traveling right AND it hasn't been caught, THEN reverse direction (turn left)
    if ((offset_left > wrapper_width) && (directions[index] == "right") && (caughts[index] == false)) {
        
        //never write $this.stop(); this will fuck up your animation

        //had to use .each to put function inside — $(this).small_bounce_left() did not work. small_bounce_left($(this)); also did not work
        $(this).each(small_bounce_left);

        directions[index] = "left";
        
//        console.log(index + "critter was travelling right, now going left!");

    }

    //turn right
    else if ((offset_left < 0) && (directions[index] == "left") && (caughts[index] == false)) {

        $(this).each(small_bounce);

       directions[index] = "right";
       
//       console.log(index + "critter was travelling left, now going right!");

    }
    
    //when critters are in between left and right extremes
    else if (directions[index] == "right") {
        
        $(this).each(small_bounce);
        
//        console.log(index + "critter keep going right. please!!!");
        
    }
    
    else if (directions[index] == "left") {
        $(this).each(small_bounce_left);
        
//        console.log(index + "critter keep going left. please!!!");
        
    };

//   console.log(index + "critter's direction is" + directions[index]);
};


// resume bounce after mouseenter: use e instead of $(this), since onclick what triggers resume_animation is img, but onmouseover what triggers resume_animation is .critter
function resume_animation(e) {
    
    var index = e.attr("data-index");
    
    console.log("resuming" + index);

    if (directions[index] === "right") {
        
        e.each(small_bounce);

    } else if (directions[index] === "left") {
        
        e.each(small_bounce_left);
    };
};

//show images when clicked!    
function click_critter(e) {

    clearTimeout(myTimeout);
    
    var index = $(this).parents(".critter").attr("data-index");

//    console.log(index + "THIS IS CRITTER");
    
//    console.log(index + "critter caught is" + caughts[index]);

    var currentXY,
        currentX,
        currentY,
        critter_height,
        critter_width;
    
    //find position of .hitbox parent of $(this) — which is either img or .texts — relative to its own parent (.bg_wrapper).
    currentXY = $(this).parents(".critter").position();
    currentX = currentXY.left;
    currentY = currentXY.top;
    
    console.log("CURRENT X is" + currentX);
    console.log("CURRENT Y is" + currentY);
    
    critter_height = $(this).height();
    critter_width = $(this).width();


    //if current critter isn't caught, and no other critter is caught, make current critter large
    if ((caughts[index] == false) && (
    global_caught == false)) {

        if ($(this).hasClass("texts")) {
            
             if ($(this).hasClass("welcome")) {
                 $(this).css({
                    display: "block",
                     width: "500px",
                     transition: "1s"
                 });
             };
            
            
            $(this).css({
                width: "500px",
                position: "fixed",
                //get it to vertically center
                left: "0",
                right: "0",
                top: "50%",
                transform: "translateY(-50%)",
                margin: "auto",
                transition: "width 1s"
                
            });
            
            
        }
        
        //if img
        else {
            
            //stop animation on clicked .hitbox, not img. Gotta use true to clear queue of callback functions, or else the animation just keeps running. But clearqueue doesn't seem to work on everything, hence why I set up a clear Timeout elsewhere for resume_animation
            $(this).parents(".hitbox").stop(true);
            $(this).parents(".img_frame").css({
                width: "100%"
            });
            
            //use .prev since .img_name is appended before img
           $(this).prev(".img_name") .css({
                display: "inline"
           });
            $(this).parents(".hitbox").css({
                width: "100vw",
                height: "auto",
                filter: "blur(0px)",
                opacity: "1",
                left: "calc(" + currentX + "px - " + critter_width + "px)",
                top: "calc(" + currentY + "px - " + critter_height + "px)"
                
                //?? How to write this filter properly??
                //filter: url("#turbulence_critter");
            });

        };

        var caught_sfx = new Audio("sfx/bubbles.wav");
        caught_sfx.play();

        caughts[index] = true;
        global_caught = true;

    }

    //if current critter has been caught, release it
    else if (caughts[index] == true) {

        //if text is clicked
        if ($(this).hasClass("texts")) {
            
            $(this).css({
                width: "300px",
                position:"relative",
                top: "0",
                left: "0",
                transform: "translateY(0%)"
        
            });
            
        }
        
        //if img is clicked
        else {
            $(this).parents(".img_frame").css({
                width: "75%"
            });
            
           $(this).prev(".img_name") .css({
                display: "none"
           });
            $(this).parents(".hitbox").css({
                width: sizes[index],
                height: sizes[index],
                position: "absolute",
                top: currentY,
                left: currentX,
                opacity: random_opacities[index],
                "filter": "blur("+random_blurs[index]+"px)"
            });
            
            var current_critter = $(this).parents(".hitbox");

            //call animation to resume!!
            setTimeout(function() {
                resume_animation(current_critter);

            }, 1200);
        };
           
        

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
            }, 3500);
    };

//        console.log(index + "click critter caught is" + caughts[index]);  
    };


var clicks = 0;

//function to get texts to be read in sequence regardless of what order user clicks on .texts boxes
function click_text() {
        
    var index = $(this).parents(".critter").attr("data-index");
        
    console.log(index + "text CAUGHT IS:" + caughts[index]);
    console.log("text GLOBAL CAUGHT IS:" + global_caught);
    
    //This is for a fade effect when the text changes so it isn't as abrupt
    $(this).addClass("blink");
    
    var this_one = $(this);

    setTimeout(function () { 
     this_one.removeClass("blink");
    }, 1000);
    
    
    //if welcome critter is clicked
    if ($(this).parents(".critter").hasClass("welcome")) {
        
        if ((caughts[index] == false) && (
        global_caught == false)) {
            $(this).text("Welcome to the sea site. This space is designed and coded by iris eel, populated by photos  taken by a marine biologist friend of mine in Palau. Hope you enjoy your swim!");
        }
    
        else if (caughts[index] == true) {
            $(this).text("What does it mean to capture a living thing in a photograph?");
        };
    }
    
    //if other texts are clicked
    else {

        //Only want clicks to increase in value when a new text is clicked, not for every time a text is closed, or when a text is clicked when another one is open
        if ((caughts[index] == false) && (
        global_caught == false)) {

            if (clicks == 0) {
                $(this).children("p").html("Beautiful though it may be, a documentary photo can never quite capture the firsthand experience of a thing — alive, in motion, with all its life radiating beyond the edges of the frame. This is no less true for the creatures pictured here. Your swimming companions on this site share a real home: The Republic of Palau.");
            }

            else if (clicks == 2) {
                $(this).children("p").html("Located in the Western Pacific, Palau is an archipelago comprising more than 400 islands. Despite its small size, Palau is known throughout the world for its beautiful marine life and rich traditions of ocean stewardship.");

            }

            else if (clicks == 4) {
                $(this).children("p").html("The photos here document only a small fraction of Palau’s exceptional marine biodiversity. The islands are home to more than 500 species of coral and over 1,000 species of fish, making Palau one of the most diverse areas in the Pacific region.");
            }

            else if (clicks == 6) {
                $(this).children("p").html("For thousands of years, Palauans have depended on the ocean for their food and livelihoods. To protect their ocean resources, Palauans have used ancient traditional practices to limit harvesting of threatened species. One such ancient practice is Bul, a moratorium declared by Palau’s traditional leaders that places an immediate halt to the over-consumption or destruction of a species, place or thing.");

            }

            else if (clicks == 8) {
                $(this).children("p").html("In 2015, in response to the global threats of overfishing and climate change, the Republic of Palau enshrined Bul into law and established the Palau National Marine Sanctuary (PNMS). The massive sanctuary encompasses 80% of Palau’s national waters and is closed to all forms of fishing and mining.");

            }

            else if (clicks == 10) {
                $(this).children("p").html("In line with Palau’s cultural values and traditions, embodying a well thought-out environmental policy and the commitment of both the people and the government, the Sanctuary began as a people's movement through a petition and quickly gained popular support, sweeping the nation.");

            }

            else if (clicks == 12) {
                $(this).children("p").html("Now, in an effort to temporarily bolster the economy in the midst of the COVID-19 pandemic, Palau’s House of Delegates of the 11th Olbiil Era Kelulau introduced House Bill No. 11-30-2S. This bill proposes to reopen an additional 50% (for a total of 70%) of Palau's  Exclusive Economic Zone (EEZ) to foreign fishing and oil exploration.");

            }

            else if (clicks == 14) {
                $(this).children("p").html("Not only would this reopening of the Sanctuary to commercial interests not generate nearly as much revenue as has been advertised, it would also likely lead to the decimation of ocean wildlife and consequently, an exacerbation of global climate change.");

            }

            else if (clicks == 16) {
                $(this).children("p").html("In an open letter of support for the Sanctuary, Palau’s Council of Chiefs stated, “Science tells us that our world has to fully protect at least 30% of our world’s oceans by 2030 for life on our planet earth to survive.  And yet we are nowhere near that target.  Without MPAs [Marine Protected Areas] like PNMS, it is not only Palau who is at risk but our entire world.”");

            }

            else if (clicks == 18) {
                $(this).children("p").html("Palau’s rich marine life, including the creatures in these photographs, is a testament to the hard work and foresight of generations of Palauans who made, and continue to make, the choice to protect their oceans. Unless their legacy is continued through bold measures like the Palau National Marine Sanctuary, it is unlikely that children anywhere will experience the ocean as we know it today.");

            }

            else if (clicks == 20) {
                $(this).children("p").html("A photograph can only preserve so much. Do not let these photos become mere documentation of a vibrancy that once was. To learn more about the Palau National Marine Sanctuary and join the fight to maintain its size and integrity, sign the #SaveMySanctuary <a href='https://www.change.org/p/savemysanctuary-help-stop-the-destruction-of-one-of-the-world-s-largest-mpas' target='_blank'> petition</a>.");

            }

            else if (clicks == 22) {
                //do NOT enter in .html(), that messes up the code. Also use ' instead of " inside the text
                $(this).children("p").html(
                "<p style='margin-bottom:.5em'>Sources</p><p style='margin-bottom:.5em'><a href='https://www.change.org/p/savemysanctuary-help-stop-the-destruction-of-one-of-the-world-s-largest-mpas'>#SaveMySanctuary petition</a></p><p style='margin-bottom:.5em'><a href='https://islandtimes.org/chiefs-weigh-in-favor-of-keeping-the-pnms-as-is/?fbclid=IwAR3Moo5ZMTeIuos1oKfOa4EwyjqsygDEeD5GAqdBQV2YGMHUR_lgk8aVqIE'>Chiefs weigh in favor of keeping the PNMS as is</a></p><p style='margin-bottom:.5em'><a href='https://islandtimes.org/logical-fallacies-of-house-bill-11-30-2s-amending-pnms/?fbclid=IwAR3cv0zuXD6RehdIdk2sKkU3a1WdWlNrbyAdWwQK_AR9frYkcEFNNsbS_b8'>Logical fallacies of House Bill 11-30-2S (amending PNMS)</a></p><p style='margin-bottom:.5em'><a href='https://islandtimes.org/pnms-casualty-of-covid-19-pandemic/?fbclid=IwAR0BJe13px4ISAWcmo4-kTNo5uEW2IZRv2tVTzcF7eGXY8eSpNVftWuh4D8'>PNMS, casualty of COVId-19 pandemic</a></p><p style='margin-bottom:.5em'><a href='https://islandtimes.org/palau-to-bring-100-managed-ocean-concept-as-solution-to-un-ocean-conference/?fbclid=IwAR34C11-T7zAzxmroGBcIf9y-XlLfwpbjM_cGkjvA-B_A3loIjuVnjHfxoM'>Palau to bring 100% managed ocean concept as solution to UN Ocean Conference</a>");
                
                //reset clicks so text can loop again
                clicks = -2;

            };
            
            //keep clicks++ within if and else if, otherwise clicks will increment if you click on another text while one text is still open
            clicks++;

        }

        //make text change to #savemysanctuary after it's been closed
        else if (caughts[index] == true) {
            $(this).children("p").html("#savemysanctuary");
            
            clicks++;
        };
        
    };
    
    
    console.log("CLICKS:" + clicks);
};