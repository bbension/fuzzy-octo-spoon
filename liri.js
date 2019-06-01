require("dotenv").config();
var keys = require("./keys.js");
var axios = require("axios");
var moment = require("moment");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);
var fs = require("fs");
var dataArr;
var command = process.argv[2];
var argument = [];
for (var i = 3; i < process.argv.length; i++) {
    argument.push(process.argv[i]);
}

var argString = argument.join(" ");

if (command === "concert-this") {
    concertThis(argString);
} else if (command === "spotify-this-song") {
    console.log(
        "Just a bit more specific, please add the Artists name to your argument:"
    );
    spotifyThisSong(argString);
} else if (command === "movie-this") {
    movieThis(argString);
} else if (command === "do-what-it-says") {
    doWhatItSays();
} else {
    console.log("Sorry this is an invalid command.");
}

function concertThis(argument) {
    if (argument.length < 1) {
        return console.log(
            "Ummm we need a name... Try again with an artists name."
        );
    }
    axios
        .get(
            "https://rest.bandsintown.com/artists/" +
            argString.toString() +
            "/events?app_id=codingbootcamp"
        )
        .then(function(response) {
            console.log("Check out these upcoming events for " + argString);
            console.log("*********************************************************");
            response.data.forEach(function(event) {
                console.log("Venue Name:", event.venue.name);
                console.log(
                    "Venue Location:",
                    event.venue.city +
                    " " +
                    event.venue.region +
                    " " +
                    event.venue.country
                );
                console.log(
                    "Venue Time: ",
                    moment(event.datetime).format("MM/DD/YYYY, h:mm a")
                );
                console.log(
                    "*********************************************************"
                );
            });
        });
}

function spotifyThisSong(arg) {
    if (argument.length < 1) {
        spotify.search({
            type: "track",
            query: "The Sign Ace of Base"
        }, function(
            err,
            data
        ) {
            if (err) {
                return console.log("YIKES! Error occurred: " + err);
            }
            console.log("No song provided: Here is a default track");
            console.log("Song:", data.tracks.items[0].name);
            console.log("Artist(s):", data.tracks.items[0].artists[0].name);
            if (data.tracks.items[i].preview_url === null) {
                console.log("No Preview URL");
            } else {
                console.log("Preview URL:", data.tracks.items[0].preview_url);
            }
            console.log("Album:", data.tracks.items[0].album.name);
            console.log("********************************");
        });
    } else {
        spotify.search({
            type: "track",
            limit: 1,
            query: arg
        }, function(
            err,
            data
        ) {
            if (err) {
                return console.log("Error occurred: " + err);
            }
            console.log("********************************");
            for (var i = 0; i < data.tracks.items.length; i++) {
                console.log("Song:", data.tracks.items[i].name);
                console.log("Artist(s):", data.tracks.items[i].artists[0].name);
                if (data.tracks.items[i].preview_url === null) {
                    console.log("No Preview URL");
                } else {
                    console.log("Preview URL:", data.tracks.items[i].preview_url);
                }
                console.log("Album:", data.tracks.items[i].album.name);
                console.log("********************************");
            }
        });
    }
}

function movieThis(argument) {
    if (argument === undefined || argument.length < 1) {
        return console.log(
            "If you haven't seen 'Mr. & Mrs. Smith,' then you should: https://www.imdb.com/title/tt0356910/"
        );
    }
    axios
        .get(
            "http://www.omdbapi.com/?t=" + argument + "&y=&plot=short&apikey=trilogy"
        )
        .then(function(response) {
            console.log("Title:", response.data.Title);
            console.log("Year:", response.data.Year);
            console.log("IMDB Rating:", response.data.imdbRating);
            console.log("Rotten Tomatoes Rating:", response.data.Metascore);
            console.log("Country:", response.data.Country);
            console.log("Language(s):", response.data.Language);
            console.log("Plot:", response.data.Plot);
            console.log("Actors:", response.data.Actors);
            console.log("********************************");
        });
}

function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function(error, data) {
        // If the code experiences any errors it will log the error to the console.
        if (error) {
            return console.log(error);
        }

        // print the contents of data

        dataArr = data.split(",");

        // re-display the content as an array for later use.
        if (dataArr.length > 1) {
            argument.push(dataArr[1]);
            argString = dataArr[1];
            argString = argString.replace(/["]/g, "");
        }

        if (dataArr[0] === "concert-this") {
            concertThis(dataArr[1]);
        } else if (dataArr[0] === "spotify-this-song") {
            console.log();
            console.log(
                "Just a bit more specific, please add the Artists name to your argument:"
            );
            spotifyThisSong(dataArr[1]);
        } else if (dataArr[0] === "movie-this") {
            movieThis(dataArr[1]);
        } else {
            console.log("You've entered an invalid command.");
        }
    });
}

fs.appendFile("log.txt", command + " " + argString + "\n", function(err) {
    // If the code experiences any errors it will log the error to the console.
    if (err) {
        return console.log(err);
    }

    // Otherwise, it will print: "movies.txt was updated!"
    console.log("********************************");
    console.log("log.txt was updated!");
    console.log("********************************");
});