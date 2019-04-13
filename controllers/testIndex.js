

/*THIS IS A TESTER FILE FOR INDEX.JS, FUNCTIONS HERE ARE NOT TO
 BE USED*/

/*const cities = require('cities.json');

for (var i=0;i<cities.length;i++) {
  if (cities[i]["name"] == "Los Angeles") {
    console.log(cities[i]["name"]);
    break;
  }
}

/*
const express = require('express');
const app = express();
const Request = require('request');
const path = require('path');

/*
Request.post({
    "headers": { "content-type": "application/json" },
    "url": "POST https://vision.googleapis.com/v1/images:annotate?key=",
    "body": JSON.stringify(
        {
            "requests":[
              {
                "image":{
                  "source":{
                    "imageUri":
                      "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png"
                  }
                },
                "features":[
                  {
                    "type":"LOGO_DETECTION",
                    "maxResults":1
                  }
                ]
              }
            ]
          }
    )
}, (error, response, body) => {
    if(error) {
        return console.dir(error);
    }
    console.dir(JSON.parse(body));
    console.log("RESPONSE:  "+ response);
});
*/
/*
const fs = require('fs');
const download = require('image-downloader');
var findRemoveSync = require('find-remove');
// Define ML function using cloud vision to determine nearest color
async function quickstart(URL) {
  // Download to a directory and save with the original filename


    var path = 
    const [result] = await client.imageProperties(path);
    console.log(result);
    var path = '../public/images/'+URL;
    // Performs label detection on the image file
    // Performs property detection on the gcs file
    const [result] = await client.imageProperties(path);
    const colors = result.imagePropertiesAnnotation.dominantColors.colors;
    try {
      return colors;
    }
    catch (e) {
      console.log(e);
    }
    const vision = require('@google-cloud/vision');
    // Creates a client
    const client = new vision.ImageAnnotatorClient({
      projectId: 'itour-236011',
      keyFilename: '../gvision/iTour-3460e8f5a831.json',
    });
}*/
   /* var colorPalette = {
        red: '#ff0000',
        yellow: '#ffff00',
        green: '#00ff00',
        cyan: '#00ffff',
        blue: '#0000ff',
        magenta: '#ff00ff',
        black: '#000000',
        white: '#ffffff'
    };

    var nearestColor = require('nearest-color').from(colorPalette);

    var colorArr = [];
    var length = 2;
    if (colors.length < 2) {
        length = colors.length;
    }
    for (var i = 0; i < length; i++) {
        var colorHexR = colors[i]['color']['red'].toString(16);
        if (colors[i]['color']['red'] <= 15) {
            colorHexR = "0" + colorHexR;
        }
        var colorHexG = colors[i]['color']['green'].toString(16);
        if (colors[i]['color']['green'] <= 15) {
            colorHexG = "0" + colorHexG;
        }
        var colorHexB = colors[i]['color']['blue'].toString(16);
        if (colors[i]['color']['blue'] <= 15) {
            colorHexB = "0" + colorHexB;
        }
        var colorHexTotal = "#" + colorHexR + colorHexG + colorHexB;
        colorArr.push(nearestColor(colorHexTotal));
    }
    try {
      return colorArr;
    }
    catch (e) {
      console.log(e);
    }
}
(async function main(){
var global = await quickstart('https://farm8.staticflickr.com/7912/46764589474_62d491e3a1.jpg').catch(console.error);
console.log(global);
})();
/*
// Set express to use JSON formatting
app.use(express.json());
*/

/*
app.get('/', (req, res) => {
    res.send("hi");
});

app.get('/flickr-api', (req, res) => {
    Request.get('https://api.flickr.com/services/rest/?method=flickr.tags.getListPhoto&api_key=acd37d46e39973a36b1b2923a6777cfa&photo_id=33606151598&format=json&nojsoncallback=1&auth_token=72157690636233203-476bef1052e2739c&api_sig=d2df119c7d91347d7043e7c6a7a6a3d8',
        (error, response, body) => {
        if (error) {
            res.send("failed");
            return;
        }
        res.send(JSON.parse(body));
    });
});

// Listen on open port or 3000 if not open
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Listening on port ${port} ...`);
});

/*
const courses = [
    { id: 1, name: 'course1' },
    { id: 2, name: 'course2' },
    { id: 3, name: 'course3' },
];
*/

/*
app.post('/api/blah', (req, res) => {
    const course = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course);
    res.send(course);
});
*/

/*
app.get('/api/blah/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) res.status(404).send('The course with the given iD was not found');
    res.send(course);
});
*/
/*

*/