//reauire .env
require("dotenv").config();
//require keys.js
var keys = require("./keys.js");
//require spotify package
var Spotify = require('node-spotify-api');
//initialize spotify object
var spotify = new Spotify(keys.spotify);
//require file system
var fs = require("fs");
//requiremoment
var moment = require('moment');
//require axios
var axios = require('axios');
//require inquirer
var inquirer = require('inquirer');

//spotify search logic
function spotifyASong(arg){
    //ajax call
    function ajax(song){
        spotify.search({ type: 'track', query: song, limit: 1}, function(err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            };
            //get artists
            var artists = '';
            for(var i=0;i<data.tracks.items[0].album.artists.length;i++){
                artists = artists + data.tracks.items[0].album.artists[i].name + " & ";
            };
            artists = artists.slice(0, artists.length-2);
            console.log('Artists: ' + artists); 
            
            //song
            console.log('Track: ' + data.tracks.items[0].name);

            //preview of the song
            if(data.tracks.items[0].preview_url){
                console.log('Preview of the song: ' + data.tracks.items[0].preview_url);
            } else {
                console.log('Preview unavailable -- please visit spotify.com');
            };
            
            //album
            console.log('Album: ' + data.tracks.items[0].album.name);
        });
    };

    //check for 'do what it says' arg
    if(arg){
        ajax(arg);
    } else {
        inquirer.prompt([
            {
            name: "song",
            message: "Which song would you like to search?"
            }
        ]).then(function(answer) {
            ajax(answer.song);   
        });
    };
};

//concert logic
function upcomingConcert(arg){
    var url
    //ajax call
    function ajax(url){
        axios
        .get(url)
        .then(function(response) {                   
            for(var i=0;i<response.data.length;i++){
                console.log('/------------------------------------/')
                console.log('Venue name: ' + response.data[i].venue.name);
                console.log('Location: ' + response.data[i].venue.city + ", " + response.data[i].venue.region + ", " + response.data[i].venue.country)
                console.log('Concert date: ' + moment(response.data[i].datetime).format('MM-DD-YYYY'));
            };
        });
    };

    //check for 'do what is says' arg
    if(arg){
        url = "https://rest.bandsintown.com/artists/" + arg + "/events?app_id=codingbootcamp";
        ajax(url);
    } else {
        inquirer.prompt([
            {
                name: 'band',
                message: 'Which band would you like to search for?'
            }
        ]).then(function(answer){
            url = "https://rest.bandsintown.com/artists/" + answer.band + "/events?app_id=codingbootcamp";
            ajax(url);
        });
    };
};

//get movie logic
function getMovieInfo(arg){
    var url;
    //ajax call
    function ajax(url){
        axios
        .get(url)
        .then(function(response) {
        console.log('Title: ' + response.data.Title);
        console.log('Release year: ' + response.data.Year);
        if(response.data.Ratings[0]){
            console.log('IMDB Rating: ' + response.data.Ratings[0].Value);
        }
        if(response.data.Ratings[1]){
            console.log('Rotten Tomatoes Rating: ' + response.data.Ratings[1].Value);
        }
        console.log('Country of Production: ' + response.data.Country);
        console.log('Language: ' + response.data.Language);
        console.log('Plot: ' + response.data.Plot);
        console.log('Actors: ' + response.data.Actors);    
    })};

    //check for 'do what is says' arg
    if(arg){
        url = "http://www.omdbapi.com/?apikey=trilogy&t=" + arg;
        ajax(url);
    } else {
        inquirer.prompt([
            {
                name: 'movie',
                message: 'Which movie would you like to search for?'
            }
        ]).then(function(answer){
            
            if(answer.movie){
                url = "http://www.omdbapi.com/?apikey=trilogy&t=" + answer.movie;
            } else {
                url = "http://www.omdbapi.com/?apikey=trilogy&t=Mr.+Nobody";
            }
            ajax(url);
        });
    };
};

//command line function logic
function ask(){
    inquirer.prompt([
        {
        name: "choice",
        message: "Hi! What can I help you with today?",
        type:'list',
        choices: ['Spotify a song', 'Search for upcoming concerts', 'Get movie info', 'Do what it says']
        }
    ]).then(function(answer) {
        
        //spotify search logic
        if(answer.choice === 'Spotify a song'){            
            spotifyASong();
        } 

        // concert search logic
        else if(answer.choice === 'Search for upcoming concerts'){
            upcomingConcert();
        }

        //movie search logic
        else if(answer.choice === 'Get movie info'){
            getMovieInfo();
        }

        //do what it says
        else if(answer.choice === 'Do what it says'){
            fs.readFile("random.txt", "utf8", function(error, data) {

                if (error) {
                  return console.log(error);
                }
        
                data = data.split(",")
                var type = data[0];
                var query = data[1].slice(1, data[1].length-1);
                
                if(type === 'spotify-this-song'){
                    spotifyASong(query);
                } else if(type === 'concert-this'){
                    upcomingConcert(query);
                } else if(type === 'movie-this'){
                    getMovieInfo(query);
                };
            });
        };
    });
};

//call command line function
ask();


//------------------ reask the question ---------------------/
// .then(function(){
//     inquirer.prompt([
//         {
//         name: "askAgain",
//         message: "Would you like to search again?",
//         type:'list',
//         choices: ['Yes', 'No']
//         }
//     ]).then(function(answer) {
//         if(answer.askAgain === 'Yes'){
//             ask()
//         } else {
//             console.log('Come again soon!')
//         }
    
//     });
// });




