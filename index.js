/* Program: This program gives the user the capability to train a 
Machine learning model to predict and match a perfect tourist route
of travel depending on your personality, and perceptions of 
reality*/

// Define ML function using cloud vision to determine nearest color
async function quickstart(URL) {
    const vision = require('@google-cloud/vision');
    // Creates a client
    const client = new vision.ImageAnnotatorClient();

    // Performs label detection on the image file
    // Performs property detection on the gcs file
    const [result] = await client.imageProperties(URL);
    const colors = result.imagePropertiesAnnotation.dominantColors.colors;

    // Define typical colors to match
    var colorPalette = {
        red: '#ff0000',
        yellow: '#ffff00',
        green: '#00ff00',
        cyan: '#00ffff',
        blue: '#0000ff',
        magenta: '#ff00ff',
        black: '#000000',
        white: '#ffffff'
    };

    // define nearest color function
    var nearestColor = require('nearest-color').from(colorPalette);

    // Find the color arrays of the two colors
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
    // return colorArr
    try {
        return colorArr;
    }
    catch (e) {
        console.log(e);
    }
}

// Import modules
const express = require('express');
const app = express();
//const Request = require('request'); Optional
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
var Flickr = require('flickr-sdk');
var flickr = new Flickr("d4447493b0b0ff88b7a52f0ea3444951");

/* enable body parser*/
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('./public'));

/* serve title page*/
app.get('/', (req, res) => {
    res.sendFile("easyTour.html", { root: path.join(__dirname, "./views") });
});

/* Post to url for training model*/
app.post('/trained', function (req, res) {
    var callData = JSON.stringify(req.body);
    fs.writeFile('./public/photoMooder/customModel.json', callData, 'utf8', function (success) {
        console.log("Successfully Trained.");
    });
});
app.get('/loading', (req, res) => {
    res.sendFile("loading.html", { root: path.join(__dirname, "./views") });
});

app.get('/search', (req, res) => {
    res.sendFile("search.html", { root: path.join(__dirname, "./views") });
});

app.get('/navigate', (req, res) => {
    res.sendFile("navigate.html", { root: path.join(__dirname, "./views") });
});

// Interact with map route
app.get('/interact', (req, res) => {
    res.sendFile("loading2.html", { root: path.join(__dirname, "./views") });
});

// Store query and search lists
app.post('/interact', (req, res) => {
    // Get query
    var query = req.body['mood'];
    var modelData = fs.readFileSync('./public/photoMooder/customModel.json');

    // Empty destination file
    fs.writeFileSync('./public/JSON/destinations.json', "[]");

    // Get callback data
    var cityName = JSON.parse(modelData)['City'];
    var numdest = parseInt(JSON.parse(modelData)['Numdest'], 10);
    var latitude = JSON.parse(modelData)['Lat'];
    var longitude = JSON.parse(modelData)['Lng'];
    const flickrAPI = "d4447493b0b0ff88b7a52f0ea3444951";

    // For each photo that matches the query, get its geolocation
    var imageData = JSON.parse(fs.readFileSync('./public/JSON/image-tags.json'));
    for (var i = 0; i < imageData.length; i++) {
        var getDestinations = new Promise(function (resolve, reject) {
            var currInd = i;
            if (imageData[currInd]['imageMoods'][0] == query || imageData[currInd]['imageMoods'][1] == query) {
                var imageURL = imageData[currInd]['imageLink'];
                var currID = imageData[currInd]['imageId'];
                var currCaption = imageData[currInd]['imageCaption'];
                // Search up photo destinations, based on geotag
                flickr.photos.geo.getLocation({
                    api_key: flickrAPI,
                    photo_id: currID
                }).then(function (response) {
                    var destJSON = response.body;
                    var thisLatitude = destJSON['photo']['location']['latitude'];
                    var thisLong = destJSON['photo']['location']['longitude'];
                    var neighborhood = destJSON['photo']['location']['neighborhood'];
                    var county = destJSON['photo']['location']['county'];
                    var thisname = 0;
                    if (typeof neighborhood === "undefined") {
                        if (typeof county === "undefined" || county['_content'] === cityName) {
                            thisname = "C: " + currCaption;
                        }
                        else {
                            thisname = county['_content'];
                        }
                    }
                    else {
                        thisname = neighborhood['_content'];
                    }
                    var thiscountry = destJSON['photo']['location']['country']['_content'];
                    var sendJSON = {
                        name: thisname,
                        latitude: thisLatitude,
                        longitude: thisLong,
                        link: imageURL,
                        city: cityName,
                        country: thiscountry
                    }
                    resolve(sendJSON);
                }).catch(function (err) {
                    console.error(err);
                });
            }
        });
        getDestinations.then(function (send) {
            var destFile = fs.readFileSync('./public/JSON/destinations.json');
            if (!destFile) {
                destFile = "[]";
            }
            var json = JSON.parse(destFile);
            json.push(send);
            fs.writeFileSync('./public/JSON/destinations.json', JSON.stringify(json));
        });
    }
    console.log("Destinations Queried!");

    var message = "Preparing your \'" + query + "\' trip...";

    // send the latitude and longitude of city as response
    res.send(message);
});

// If already loaded photos, simply search file
app.get('/moods/loaded', (req, res) => {
    // Render mood selection page
    res.sendFile("moods.html", { root: path.join(__dirname, "./views") });
});

// Get moods page
app.get('/moods', (req, res) => {
    // Read JSON file to get city name and search flickr database for matching groups
    var modelData = fs.readFileSync('./public/photoMooder/customModel.json');

    // Empty image-tag file
    fs.writeFileSync('./public/JSON/image-tags.json', "[]");

    // Get all the info from custom model
    var cityName = JSON.parse(modelData)['City'];
    var latitude = JSON.parse(modelData)['Lat'];
    var longitude = JSON.parse(modelData)['Lng'];
    var redEmo = JSON.parse(modelData)['Red'];
    var yellowEmo = JSON.parse(modelData)['Yellow'];
    var greenEmo = JSON.parse(modelData)['Green'];
    var cyanEmo = JSON.parse(modelData)['Cyan'];
    var blueEmo = JSON.parse(modelData)['Blue'];
    var magentaEmo = JSON.parse(modelData)['Magenta'];
    var whiteEmo = JSON.parse(modelData)['White'];
    var blackEmo = JSON.parse(modelData)['Black'];

    //Get search parameters
    const flickrAPI = "d4447493b0b0ff88b7a52f0ea3444951";
    var displayGroups = 10;
    var displayPhotos = 50;

    // Search flickr api for groups
    const getGroup = new Promise(function (resolve, reject) {
        flickr.groups.search({
            api_key: flickrAPI,
            text: cityName,
            per_page: displayGroups,
            page: 1
        }).then(function (res) {
            var bodyJSON = res.body;
            var idFlag = bodyJSON['groups']['group'][4]["nsid"];
            for (var j = 0; j < bodyJSON['groups']['group'].length; j++) {
                var currPoolCount = bodyJSON['groups']['group'][j]["pool_count"];
                if (currPoolCount >= 5000) {
                    idFlag = bodyJSON['groups']['group'][j]["nsid"];
                }
            }
            resolve(idFlag);
        }).catch(function (err) {
            console.error(err);
        });
    });
    getGroup.then(function (maxGroup) {
        // For that group, search each photo which has a specific latitude and longitude
        var getPhotoList = new Promise(function (resolve, reject) {
            flickr.photos.search({
                api_key: flickrAPI,
                text: cityName,
                group_id: maxGroup,
                has_geo: 1,
                lat: latitude,
                lon: longitude,
                radius: 32,
                per_page: displayPhotos,
                page: 1

            }).then(function (res) {
                // Get all the pictures from that particular search
                var pictureJSON = res.body;
                var photoDataJSON = [];
                for (var i = 0; i < pictureJSON["photos"]["photo"].length; i++) {
                    var tempURLJSON = {};
                    var currPhoto = pictureJSON["photos"]["photo"][i];
                    var id = currPhoto['id'];
                    var farmId = currPhoto['farm'];
                    var secret = currPhoto['secret'];
                    var server = currPhoto['server'];
                    var caption = currPhoto['title'];
                    var URL = `https://farm${farmId}.staticflickr.com/${server}/${id}_${secret}.jpg`;
                    tempURLJSON['imageCaption'] = caption;
                    tempURLJSON['imageId'] = id;
                    tempURLJSON['imageLink'] = URL;
                    photoDataJSON.push(tempURLJSON);
                }
                resolve(photoDataJSON);
            }).catch(function (err) {
                console.error(err);
            });
        });
        getPhotoList.then(function (photoJSON) {
            for (var pIndex = 0; pIndex < photoJSON.length; pIndex++) {
                var getPhotoTags = new Promise(function (resolve, reject) {
                    // Get current photoID
                    var photoID = photoJSON[pIndex]['imageId'];
                    flickr.tags.getListPhoto({
                        photo_id: photoID
                    }).then(function (res) {
                        var tagArr = [];
                        var tagsJSON = res.body;
                        for (var k = 0; k < tagsJSON['photo']['tags']['tag'].length; k++) {
                            var tag = tagsJSON['photo']['tags']['tag'][k]['raw'];
                            tagArr.push(tag);
                        }
                        tagArr.push(tagsJSON['photo']['id']);
                        resolve(tagArr);
                    }).catch(function (err) {
                        console.error(err);
                    });
                });
                getPhotoTags.then(function (tags) {
                    var photoURL = [];
                    var tagsnoid = tags.slice(0, tags.length - 1);
                    for (var i = 0; i < photoJSON.length; i++) {
                        if (photoJSON[i]['imageId'] == tags[tags.length - 1]) {
                            photoJSON[i]['imageTags'] = tagsnoid;
                            photoURL.push(i);
                            photoURL.push(photoJSON[i]['imageLink']);
                            break;
                        }
                    }
                    return photoURL;
                }).then(function (myURL) {
                    // Call async getColors function
                    (async function getColors() {
                        var colorArr = await quickstart(myURL[1]).catch(console.error);
                        var colorEmotion = [];
                        for (var h = 0; h < colorArr.length; h++) {
                            var colorItem = colorArr[h];
                            var colorName = colorItem['name'];
                            if (colorName == 'red') {
                                colorEmotion.push(redEmo);
                            }
                            else if (colorName == 'yellow') {
                                colorEmotion.push(yellowEmo);
                            }
                            else if (colorName == 'green') {
                                colorEmotion.push(greenEmo);
                            }
                            else if (colorName == 'cyan') {
                                colorEmotion.push(cyanEmo);
                            }
                            else if (colorName == 'blue') {
                                colorEmotion.push(blueEmo);
                            }
                            else if (colorName == 'magenta') {
                                colorEmotion.push(magentaEmo);
                            }
                            else if (colorName == 'white') {
                                colorEmotion.push(whiteEmo);
                            }
                            else {
                                colorEmotion.push(blackEmo);
                            }
                        }
                        photoJSON[myURL[0]]['imageMoods'] = colorEmotion;

                        // Write object to file!
                        var imageFile = fs.readFileSync('./public/JSON/image-tags.json');
                        if (!imageFile) {
                            imageFile = "[]";
                        }
                        var json = JSON.parse(imageFile);
                        json.push(photoJSON[myURL[0]]);
                        fs.writeFileSync('./public/JSON/image-tags.json', JSON.stringify(json));
                    })();
                });
            }
            console.log("Photos Logged!");
        });
    });

    // Render mood selection page
    res.sendFile("moods.html", { root: path.join(__dirname, "./views") });
});

// Listen on open port or 3000 if not open
/*const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Listening on port ${port} ...`);
});*/