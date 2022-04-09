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