// 1. Before you can make any part of our site work, you need to create an array of strings, each one related to a topic that interests you. Save it to a variable called `topics`. 
//    * We chose animals for our theme, but you can make a list to your own liking.

// 2. Your app should take the topics in this array and create buttons in your HTML.
//    * Try using a loop that appends a button for each string in the array.

// 3. When the user clicks on a button, the page should grab 10 static, non-animated gif images from the GIPHY API and place them on the page. 

// 4. When the user clicks one of the still GIPHY images, the gif should animate. If the user clicks the gif again, it should stop playing.

// 5. Under every gif, display its rating (PG, G, so on). 
//    * This data is provided by the GIPHY API.
//    * Only once you get images displaying with button presses should you move on to the next step.

// 6. Add a form to your page takes the value from a user input box and adds it into your `topics` array. Then make a function call that takes each topic in the array remakes the buttons on the page.

// 7. Deploy your assignment to Github Pages.

// ---------------------------

//array of cities
var cities = ["Sydney", "San Francisco", "Anchorage", "Dubai", "Mumbai"];
var city = ""; //the selected city

var cityDescription;
var cityMin;
var cityMax;

var tvChannel = "";
var weatherTerm = "";



//listener for document ready
$(document).ready(function() {
    //doc loaded

    renderButtons();

    $("#search").on("click", function(event) {
        if (!$("#new-city-name").val() == "") {
            event.preventDefault();
            var newCity = $("#new-city-name").val().trim();
            cities.unshift(newCity);
            cities.pop();
            //renderButtons();
        }

})
//listen for click on any (dynamically generated) buttons 
$(document).on("click", ".tv-button", function() {
    var buttonNumber = $(this).attr("data-name");
    console.log("buttonNumber----: "+ buttonNumber);
    tvChannel = parseInt(buttonNumber.replace("city-button",""))+1;
    city = $("#"+buttonNumber).val();
    console.log("Get weather for: " + city);
    getWeather();
});

//listen for click on any dynamically generated gif    
$(document).on("click", ".gif", function() {
    var img = $(this);
    var state = img.attr("data-state");

    if (state == "still") {
        img.attr("data-state", "animate");
        img.attr("src", img.attr("data-animate"));
    } else if (state == "animate") {
        img.attr("data-state", "still");
        img.attr("src", img.attr("data-still"));
    }
});

}); //End Document Ready Listener

// Function displaying city buttons
function renderButtons() {
    // Deleting the existing buttons prior to adding new buttons
    $("#city-buttons").empty();
    cities.forEach(function(element, index) {
        var formGroupRow =  "<div class='form-group row'><label class='col-4 col-form-label'><button data-name='city-button" + index + "' class='tv-button btn-block rounded'></button></label><div class='col-8'><input class='form-control' type='text' id='city-button" + index + "' value='" + element + "'></div></div>";
        $("#city-buttons").append(formGroupRow)
    });
}

function getWeather() {
    // Will's API key for Open Weather Map
    var APIKey = "6bc20f7ac2891148682ff0eb95eb9c46";
    // URL to query weather database
    var weatherURL = "https://api.openweathermap.org/data/2.5/weather?" + "q=" + city + "&units=imperial&appid=" + APIKey;

    $.ajax({
            url: weatherURL,
            method: "GET"
        })
        // We store all of the retrieved data inside of an object called "response"
        .done(function(response) {
            //console.log(response);
            //Check for Null Objects being returned
            if (response.weather !== "null") {
                //store the weather description, max and min
                cityDescription = response.weather[0].description;
                cityMin = response.main.temp_min;
                cityMax = response.main.temp_max;

                console.log("weatherTerm: " + weatherTerm)

                if (cityMin < 50) {
                    weatherTerm = "cold";
                } else if (cityMin < 32) {
                    weatherTerm = "freezing";
                } else if (cityMin > 70) {
                    weatherTerm = "super hot";
                }

                if (cityMax > 80) {
                    weatherTerm = "its hot";
                } else if (cityMax < 50) {
                    weatherTerm = "crazy cold";
                } else {
                    weatherTerm = cityDescription;
                }

                weatherTerm = encodeURI(weatherTerm);

                console.log("cityMax: " + cityMax);
                console.log("cityMin: " + cityMin);
                console.log("finding images for: " + weatherTerm)
                renderImages();
            }
        });
}

function renderImages() {
    $(".gif").remove(); //remove all of the existing images
    $(".tv-channel-number").remove();
    $(".weather-ticker").remove();

    var tvChannelDiv = $("<div>").addClass("tv-channel-number float-right").text(tvChannel+ " " + city) ;
    $("#tv-screen").append(tvChannelDiv);

    var marqueeText = "Today's Weather: " + cityDescription + ".   Min: " + cityMin + " ,  Max: " + cityMax;
    var marquee = $("<marquee>").attr("behavior", "scroll")
                               .attr("direction", "left")
                               .attr("id", "weather-ticker")
                               .addClass("weather-ticker")
                               .text(marqueeText);

    $("#tv-screen").append(marquee);
    var numImages = 10;
    var giphyURL = "https://api.giphy.com/v1/gifs/search?q=" + weatherTerm + "&api_key=dc6zaTOxFJmzC&limit=" + numImages;

    console.log("giphyURL: " + giphyURL);
    // Here we run our AJAX call to the OpenWeatherMap API
    $.ajax({
            url: giphyURL,
            method: "GET"
        })
        // We store all of the retrieved data inside of an object called "response"
        .done(function(response) {
            //Check for Null Objects being returned
            if (response.data !== "null") {

                randomImageIndex = Math.floor(Math.random() * response.data.length)
                console.log("random Index: " + randomImageIndex);

                    var imageObject = response.data[randomImageIndex].images;
                    console.log(imageObject);
                    var newImg = $("<img>")
                        .attr("src", imageObject.fixed_width.url)
                        .attr("data-still", imageObject.fixed_width_still.url)
                        .attr("data-animate", imageObject.fixed_width.url)
                        .attr("data-state", "animate")
                        .attr("class", "gif");
                    $("#tv-image").append(newImg)

            };
            console.log("No Reponse from Giphy");
        });
}









//comment