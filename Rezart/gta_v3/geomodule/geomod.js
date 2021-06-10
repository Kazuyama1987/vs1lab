/**
 * Modul für 'In-Memory'-Speicherung von GeoTags mit folgenden Komponenten:
 * - Array als Speicher für Geo Tags.
 * - Funktion zur Suche von Geo Tags in einem Radius um eine Koordinate.
 * - Funktion zur Suche von Geo Tags nach Suchbegriff.
 * - Funktion zum hinzufügen eines Geo Tags.
 * - Funktion zum Löschen eines Geo Tags.
 */

var geoTagArray = [];

//This function takes in latitude and longitude of two location and returns the distance between them as the crow flies (in km)
var calcCrow = function(lat1, lon1, lat2, lon2) {
  // var R = 6.371; // km
  var R = 6371000;
  var dLat = toRad(lat2-lat1);
  var dLon = toRad(lon2-lon1);
  var latA = toRad(lat1);
  var latB = toRad(lat2);

  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(latA) * Math.cos(latB); 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c;
  return d;
}

// Converts numeric degrees to radians
var toRad = function(Value) {
    return Value * Math.PI / 180;
}

var searchFromCoordAndRadius = function(latC, lonC, radius) {
    var resultList = [];
    geoTagArray.forEach((element) => {
        var distance = calcCrow(latC, lonC, element.latitude, element.longitude);
        if (distance <= radius) {
            resultList.push(element)
        }
    });
    return resultList;
}

var searchFromTerm = function(term) {
    var resultList = [];
    var toCompare = term.toLowerCase();
    geoTagArray.forEach((element) => {
        if (toCompare === element.name.toLowerCase || toCompare === element.hashtag.toLowerCase()) {
            resultList.push(element);
        }
    });
    return resultList;
}

var addTag = function(geoTag) {
    if (geoTag != undefined) {
        var unique = true;
        geoTagArray.forEach((element) => {
            if (geoTag.name.toLowerCase() === element.name.toLowerCase()) {
                unique = false;
            } else if (geoTag.latitude === element.latitude && geoTag.longitude === element.longitude) {
                unique = false;
            }
        })

        if (unique) {
            geoTagArray.push(geoTag);
        }
    }
}

var deleteTag = function(geoTag) {
    if (geoTagArray != null && geoTag != undefined) {
        geoTagArray.pop(geoTag);
    }
}

exports.geoTagArray = geoTagArray;
exports.searchFromCoordAndRadius = searchFromCoordAndRadius;
exports.searchFromTerm = searchFromTerm;
exports.addTag = addTag;
exports.deleteTag = deleteTag; 
