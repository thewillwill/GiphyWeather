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
        console.log("buttonNumber----: " + buttonNumber);

        //create a variable for the TV Channel Number
        tvChannel = parseInt(buttonNumber.replace("city-button", "")) + 1;

        //store the name of the city
        city = $("#" + buttonNumber).val();
        console.log("Get weather for: " + city);

        //get weather for the city button clicked
        getWeather();
    });

    //listen for click on any dynamically generated gif    
    $(document).on("click", ".gif", function() {
        var img = $(this);

        //get the current animation/still state
        var state = img.attr("data-state");

        //if still, animate it
        if (state == "still") {
            img.attr("data-state", "animate");
            img.attr("src", img.attr("data-animate"));
        }
        //if animated, freeze it
        else if (state == "animate") {
            img.attr("data-state", "still");
            img.attr("src", img.attr("data-still"));
        }
    });

}); //End Document Ready Listener

// Display Initial City Buttons from array
function renderButtons() {
    // Deleting the existing buttons prior to adding new buttons
    $("#city-buttons").empty();

    //iterate through array and add elements with bootstrap layout properties and the index number as data attribute
    cities.forEach(function(element, index) {
        var formGroupRow = "<div class='form-group row'><label class='col-4 col-form-label'><button data-name='city-button" + index + "' class='tv-button btn-block rounded'></button></label><div class='col-8'><input class='form-control' type='text' id='city-button" + index + "' value='" + element + "'></div></div>";
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


                //convert min or max temperatures to a searchable term


                if (cityMax > 80) {
                    weatherTerm = "hot weather";
                }
                else if (cityMax > 75) {
                    weatherTerm = "nice weather";
                } else if (cityMax < 50) {
                    weatherTerm = "crazy cold";
                }
                else {
                    //if temperature in a 'normal range' use the weather description as search term
                    weatherTerm = cityDescription;
                }

                if (cityMin < 55) {
                    weatherTerm = "cold";
                } else if (cityMin < 40) {
                    weatherTerm = "freezing";
                } else if (cityMin > 70) {
                    weatherTerm = "warm";
                }
                 else {
                    //if temperature in a 'normal range' use the weather description as search term
                    weatherTerm = cityDescription;
                }

                if (weatherTerm == "clear sky") {
                    weatherTerm = "sunny";
                }

                //encode URI so white spaces are not in weather url
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

    var tvChannelDiv = $("<div>").addClass("tv-channel-number float-right").text(tvChannel + " " + city);
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

    //console.log("giphyURL: " + giphyURL);
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
                var imageObject = response.data[randomImageIndex].images;
                var newImg = $("<img>")
                    .attr("src", imageObject.fixed_width.url)
                    .attr("data-still", imageObject.fixed_width_still.url)
                    .attr("data-animate", imageObject.fixed_width.url)
                    .attr("data-state", "animate")
                    .attr("class", "gif");
                $("#tv-image").append(newImg)

            } else {
                console.log("No Response from Giphy");
            }
        });
}









//comment