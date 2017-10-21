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
var cities = ["Sydney", "San Francisco", "Anchorage", "Luanda"];
var city = ""; //the selected city

var cityDescription = response.weather.description;
var cityMin = response.weather.temp_min;
var cityMax;

// Will's API key for Open Weather Map
var APIKey = "6bc20f7ac2891148682ff0eb95eb9c46";
// URL to query weather database
var weatherURL = "https://api.openweathermap.org/data/2.5/weather?" + "q=" + city + "&units=imperial&appid=" + APIKey;
//working query: https://api.openweathermap.org/data/2.5/weather?q=Sydney,%20Australia&units=imperial&appid=166a433c57516f51dfab1f7edaed8413

var giphyURL = "https://api.giphy.com/v1/gifs/search?q=" +
            cityDescription + "&api_key=dc6zaTOxFJmzC&limit=10";



//listener for document ready
$(document).ready(function() {
            //doc loaded

            //listen for click on buttons 
            (document).on("click", ".city-button", function {
                var city = $(this).attr("data-name");
                getWeather(city);
             	renderImages();
            });

            //listen for click on any dynamically generated gif    
            (document).on("click", ".gif", function() {
                var currentImage = $(this);
                var state = currentImage.attr("data-state");

                if (state == "still") {
                    image.attr("data-state", "animate");
                    image.attr("src", image.attr("data-animate"));
                } else if (state == "animate") {
                    image.attr("data-state", "still");
                    image.attr("src", image.attr("data-still"));
                }
            });

            // Function displaying city buttons
            function renderButtons() {
                // Deleting the existing buttons prior to adding new buttons
                $("#buttons-view").empty();
                cities.forEach(function(element) {
                    $("#buttons-view").append(element)
                });
            }

            function getWeather() {
                $.ajax({
                        url: weatherURL,
                        method: "GET"
                    })
                    // We store all of the retrieved data inside of an object called "response"
                    .done(function(response) {

                        //CHECK FOR NULL ARTICLES
(RESPONSE.DATA !== "NULL")


                        console.log("description: " + response.weather.description);
                        console.log("min: " + response.weather.temp_min);
                        console.log("max: " + response.weather.temp_min);

                        //store the weather description, max and min
                        cityDescription = response.weather.description;
                        cityMin = response.weather.temp_min;
                        cityMax = response.weather.temp_min;
                    });

                function renderImages() {

                    // Here we run our AJAX call to the OpenWeatherMap API
                    $.ajax({
                            url: giphyURL,
                            method: "GET"
                        })
                        // We store all of the retrieved data inside of an object called "response"
                        .done(function(response) {

                            //CHECK FOR NULL ARTICLES
(RESPONSE.DATA !== "NULL")


                            respone.data.forEach(function(element) {});
                            var newImg = $("<img>")
                                .attr("data-still", imageObject.fixed_height_still.url)
                                .attr("data-animate", imageObject.fixed_height.url)
                                .attr("data-class", gif);
                        });
                }
            }
        }