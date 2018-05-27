const fs = require('fs');
const https = require('https');
const path = require('path');
const express = require('express')
const app = express()
const port = process.env.PORT || 3000

app.use(express.static('public'))

app.listen(port, function () {
  console.log(`Full Stack - JavaScript listening on port ${port}!`)
})

// api endpoint for serving a random gif
app.get("/gif-random", function(request, response) {
  // get a random number
  var randomNumber = function(maxNumber) {
    return Math.floor(Math.random() * Math.floor(maxNumber));
  }

  var fullGifList = fs.readdirSync('./public/gifs'); // list of gifs avail from gifs folder
  var randomIndexPosition = randomNumber(fullGifList.length); // assign a random number from full gifs list
  var randomGif = fullGifList[randomIndexPosition]; // define the random gif

  // create an object to hold onto our random gif
  var responseObject = {
    gifList: [randomGif]
  }

  response.send(JSON.stringify(responseObject));
}); // End API

// api endpoint for sending up 10 gifs
app.get("/gif-list", function(request, response) {
  
  // assuming page 1 = gifs 0-9, page 2 = gifs 10-19, etc.; create upper and lower parameters
  var gifsOnPage = function(fullGifList, currentPage) {
    var start = (currentPage - 1) * 10; // create the lower parameter (ie, 0, 10, 20, 30)
    var end = start + 9; // create upper parameter (ie, 9, 19, 29, 39)
    var gifList = [] // create list to ONLY hold gifs between upper and lower parameter (ie, 0-9, 10-19, etc.)

    // loop through list of all gifs available and push those that are between upper and lower parameters
    for(var i = start; i <= end; i++) {
      // ignore DS_Store
      if(fullGifList[i] && fullGifList[i] !== '.DS_Store') {
        gifList.push(fullGifList[i])
      }
    }

    return gifList;
  }

  var currentPage = request.query.currentPage;
  var fullGifList = fs.readdirSync('./public/gifs'); // list of gifs avail from gifs folder
  var gifsOnPage = gifsOnPage(fullGifList, currentPage); // send list of gifs and our current page to gifsOnPage so that it can create the requested 10 gif list list
  var totalPages = Math.ceil(fullGifList.length/10); // divide total gifs by 10 to get decimal # of pages, round up so we have room for an extra page with less than 10 gifs if needed

  // create an object to hold onto our "10 or less" gifs to send to the page
  var responseObject = {
    gifList: gifsOnPage,
    totalPages: totalPages
  }
  
  response.send(JSON.stringify(responseObject));
}); // End API

// api endpoint for getting trending gifs
app.get('/trending', function(request, response) {
  var urlEndpoint = 'https://api.giphy.com/v1/gifs/trending?api_key=DGUG5MvI2zJgf7LX5IfiTIf9R2vaErRA&limit=25&rating=G';

  https.get(urlEndpoint, function(result) {

    var data = '';
    result.on('data', (chunk) => {
      data += chunk;
    });

    result.on('end', () => {
      data = JSON.parse(data);
      response.send(data);
    });
  });
});


