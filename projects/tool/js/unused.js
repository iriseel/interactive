
/////////////////////////////////////////////////??????ARE.NA!!!!!!!!!!!!!!

function load_entries() {
    // Put your channel's slug here.
    // Remember only closed or public channels work; private channels don't work.
    // The channel slug comes after the username in the URL.
    let channel = "sea-critters";
    let makeURL = (per, page) =>
        `https://api.are.na/v2/channels/${channel}?per=${per}&page=${page}`;

    fetch(makeURL(1, 1))
        .then(res => res.json())
        .then(json => {

            // this line puts your channel's title in the #title element of the HTML.
            $("#title").html(json.title);

            // This line logs your channel's metadata to the console.
            console.log("Channel info");
            console.log(json);
            console.log("entries");
        });

    fetch(makeURL(1, 1))
        .then(res => res.json())
        .then(json => (count = json.length))
        .then(count => {
            let per = 100;
            let pages = Math.ceil(count / per);

            let fetches = [];
            for (let page = 1; page <= pages; page++) {
                fetches.push(
                    fetch(makeURL(per, page))
                    .then(res => res.json())
                    .then(json => json.contents)
                );
            }

            Promise.all(fetches).then(contents => {
                contents.forEach(content => {
                    content.forEach(entry => {
                        makeEntry(entry);
                    });
                });
            });
        });

    // This function takes the data from Are.na and adds it to the HTML.
    // we're going to do this makeEntry function for each block in the channel.
    function makeEntry(entry) {

        console.log(entry);
        
        // First you clone the entry-template, which is set up in your HTML.
        let entryTemplate = document.getElementById("entry-template");
        
        //?? How to set data-index to increment with each one??
        var data_indexes,
            data_index = 0;
        
for (let i = 0; i < fetches.length; i++) {
    
    data_indexes.push(data_index);

    data_index++;
};
        
        
        let entryEl = entryTemplate.content.cloneNode(true);
        
        document.getElementsByClassName("critter").dataset.index = data_indexes[data_index];
        
        //?? What's this doing??
        let entryItem = entryEl.querySelector("div");

        // Find the class of the block. 
        // Class refers to block type-- remember you can add images, links, texts, media, 
        // and other channels to an Are.na channel.
        let entryClass = entry.class;

        // If the current block is an image....
        if (entryClass == "Image") {
            //entryItem.querySelector("a").href = entry.image.original.url;
            entryItem.querySelector("img").src = entry.image.display.url;
            entryItem.querySelector(".title").innerHTML = entry.title;
            entryItem.querySelector(".description").innerHTML = entry.description_html;
        } 

        // If the current block is a text...
        else if (entryClass == "Text") {
            entryItem.querySelector(".title").innerHTML = entry.title;
            entryItem.querySelector(".description").innerHTML = entry.content_html;
        } 

        // If the current block is a channel...
        else if (entryClass == "Channel") {
            entryItem.querySelector(".title").innerHTML = entry.title;
            entryItem.querySelector(".description").innerHTML =
            entry.metadata.description;
        } 

        // If the current block is a Media item (like a YouTube video)...
        else if (entryClass == "Media") {
            entryItem.querySelector(".title").innerHTML = entry.title;
            entryItem.querySelector(".embed").innerHTML = entry.embed.html;
        } 

        // If the current block is a link...
        else if (entryClass == "Link") {
            entryItem.querySelector(".link").href = entry.source.url;
            entryItem.querySelector(".link").innerHTML = entry.title;
        }   

        // This line inserts the newly-created 'entry' into the HTML
        let entriesEl = document.getElementById("entries");
        entriesEl.insertBefore(entryEl, entriesEl.firstChild);

    }
}

// Finally, we need to run the load_entries function to make the content appear.
load_entries();




var critter_counter_big = 0,
    critter_counter_small = 0;

function big_bounce(){
            if (critter_counter_big < critters.length - 1) {
                $(this).animate(
                        {top:"+=" + random_bounces_big[critter_counter_big],
                        left:"+=" + random_speeds[critter_counter_big]}, 600);

                    $(this).animate(
                        {top:"-=" + random_bounces_big[critter_counter_big],
                        left:"+=" + random_speeds[critter_counter_big]}, 600, small_bounce);
            
                    critter_counter_big++;
               }
            
            else {
                critter_counter_big = 0;
                
                $(this).animate(
                        {top:"+=" + random_bounces_big[critter_counter_big],
                        left:"+=" + random_speeds[critter_counter_big]}, 600);

                    $(this).animate(
                        {top:"-=" + random_bounces_big[critter_counter_big],
                        left:"+=" + random_speeds[critter_counter_big]}, 600, small_bounce);
            
                    critter_counter_big++;
            }
        };
            
            
        function small_bounce(){
            if (critter_counter_small < critters.length - 1) {

                $(this).animate(
                    {top:"+=" + random_bounces_small[critter_counter_small],
                    left:"+=" + random_speeds[critter_counter_small]}, 600);

                $(this).animate(
                    {top:"-=" + random_bounces_small[critter_counter_small],
                    left:"+=" + random_speeds[critter_counter_small]}, 600, big_bounce);
                }
            else {
                critter_counter_small = 0;
                
                $(this).animate(
                    {top:"+=" + random_bounces_small[critter_counter_small],
                    left:"+=" + random_speeds[critter_counter_small]}, 600);

                $(this).animate(
                    {top:"-=" + random_bounces_small[critter_counter_small],
                    left:"+=" + random_speeds[critter_counter_small]}, 600, big_bounce);
            }
        };
               
              
            //??How do I add easing to this so it's not so 走走停停???
            $(".critter").each(big_bounce); 

            $(".caption").each(big_bounce); 


/*
            function big_bounce_reverse(){

                 var random_bounce1 = Math.floor(Math.random() * 200 + 50);

                $(this).animate(
                    {top:"+=" + random_bounce1,
                    left:"-=" + random_speed}, 600);

                $(this).animate(
                    {top:"-=" + random_bounce1,
                    left:"-=" + random_speed}, 600, small_bounce_reverse);
           };

            function small_bounce_reverse(){

                var random_bounce2 = Math.floor(Math.random() * 100 + 50);

                $(this).animate(
                    {top:"+=" + random_bounce2,
                    left:"-=" + random_speed}, 600);

                $(this).animate(
                    {top:"-=" + random_bounce2,
                    left:"-=" + random_speed}, 600, big_bounce_reverse);
            };
               
*/         