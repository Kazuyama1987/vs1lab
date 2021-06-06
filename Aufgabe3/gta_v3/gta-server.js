/**
 * Template für Übungsaufgabe VS1lab/Aufgabe3
 * Das Skript soll die Serverseite der gegebenen Client Komponenten im
 * Verzeichnisbaum implementieren. Dazu müssen die TODOs erledigt werden.
 */

/**
 * Definiere Modul Abhängigkeiten und erzeuge Express app.
 */

var http = require('http');
//var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var express = require('express');

var app;
app = express();
app.use(logger('dev'));
app.use(bodyParser.urlencoded({
    extended: false
}));

// Setze ejs als View Engine
app.set('view engine', 'ejs');

/**
 * Konfiguriere den Pfad für statische Dateien.
 * Teste das Ergebnis im Browser unter 'http://localhost:3000/'.
 */

// TODO: CODE ERGÄNZEN
app.use(express.static('public'));

/**
 * Konstruktor für GeoTag Objekte.
 * GeoTag Objekte sollen min. alle Felder des 'tag-form' Formulars aufnehmen.
 */

// TODO: CODE ERGÄNZEN
function createGeoTag(name, latitude, longitude, hashtag) {
    return { name, latitude, longitude, hashtag };
}

/**
 * Modul für 'In-Memory'-Speicherung von GeoTags mit folgenden Komponenten:
 * - Array als Speicher für Geo Tags.
 * - Funktion zur Suche von Geo Tags in einem Radius um eine Koordinate.
 * - Funktion zur Suche von Geo Tags nach Suchbegriff.
 * - Funktion zum hinzufügen eines Geo Tags.
 * - Funktion zum Löschen eines Geo Tags.
 */

// TODO: CODE ERGÄNZEN
var geoTags = [];

var geoTagsHelpers = {
    addGeoTag: function (geoTag) {
        geoTags.push(geoTag);
    },

    deleteGeoTag: function (deletableGeoTag) {
        var index = geoTags.findIndex(function (geoTag) {
            return geoTag.name === deletableGeoTag.name
                && geoTag.hashtag === deletableGeoTag.hashtag
                && geoTag.latitude === deletableGeoTag.latitude
                && geoTag.longitude === deletableGeoTag.latitude;
        });

        geoTags.splice(index, 1);
    },

    searchByName: function (geoTagName) {
        return geoTags.filter(function (geoTag) {
            return geoTag.name.includes(geoTagName);
        });
    },

    searchByRadius: function (latitude, longitude, radius) {
        return geoTags.filter(function (geoTag) {
            var longitudeDifference = longitude - geoTag.longitude;
            var latitudeDifference = latitude - geoTag.latitude;
            
            var distance = Math.sqrt(Math.pow(longitudeDifference, 2) + Math.pow(latitudeDifference, 2));

            return distance <= radius;
        });
    },
}

/**
 * Route mit Pfad '/' für HTTP 'GET' Requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests enthalten keine Parameter
 *
 * Als Response wird das ejs-Template ohne Geo Tag Objekte gerendert.
 */

app.get('/', function(req, res) {
    res.render('gta', {
        taglist: []
    });
});

/**
 * Route mit Pfad '/tagging' für HTTP 'POST' Requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests enthalten im Body die Felder des 'tag-form' Formulars.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * Mit den Formulardaten wird ein neuer Geo Tag erstellt und gespeichert.
 *
 * Als Response wird das ejs-Template mit Geo Tag Objekten gerendert.
 * Die Objekte liegen in einem Standard Radius um die Koordinate (lat, lon).
 */

// TODO: CODE ERGÄNZEN START

app.post("/tagging", function (req, res) {
    var latitude = req.body.latitude;
    var longitude = req.body.longitude;

    var geoTag = createGeoTag(req.body.name, latitude, longitude, req.body.hashtag);

    geoTagsHelpers.addGeoTag(geoTag);

    var filteredGeoTags = geoTagsHelpers.searchByRadius(latitude, longitude, 4000);

    res.render("gta", {
        latitude,
        longitude,
        searchterm: undefined,
        taglist: filteredGeoTags,
        tags: JSON.stringify(filteredGeoTags),
    })
})

/**
 * Route mit Pfad '/discovery' für HTTP 'POST' Requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests enthalten im Body die Felder des 'filter-form' Formulars.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * Als Response wird das ejs-Template mit Geo Tag Objekten gerendert.
 * Die Objekte liegen in einem Standard Radius um die Koordinate (lat, lon).
 * Falls 'term' vorhanden ist, wird nach Suchwort gefiltert.
 */

// TODO: CODE ERGÄNZEN
app.post("/discovery", function (req, res) {
    var filteredGeoTags = geoTagsHelpers.searchByName(req.body.searchterm);    

    res.render("gta", {
        searchterm: req.body.searchterm,
        taglist: filteredGeoTags,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        tags: JSON.stringify(filteredGeoTags),
    })
})

/**
 * Setze Port und speichere in Express.
 */

var port = 3000;
app.set('port', port);

/**
 * Erstelle HTTP Server
 */

var server = http.createServer(app);

/**
 * Horche auf dem Port an allen Netzwerk-Interfaces
 */

server.listen(port);
