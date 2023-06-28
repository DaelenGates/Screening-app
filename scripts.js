// js for map 
var map = L.map('map').setView([47.2452,-122.4582],12);

var marker = null;

var myAPIKey = "f5b6e12c640547b1bfedad5fc4a1456f"; // Get an API Key on https://myprojects.geoapify.com

// I belive this variable is apart of the old map background 
// var mapURL = L.Browser.retina
//   ? `https://maps.geoapify.com/v1/tile/{mapStyle}/{z}/{x}/{y}.png?apiKey={apiKey}`
//   : `https://maps.geoapify.com/v1/tile/{mapStyle}/{z}/{x}/{y}@2x.png?apiKey={apiKey}`;

// old map background
// L.tileLayer(mapURL, {
//   attribution: 'Powered by Geoapify | © OpenMapTiles © OpenStreetMap contributors',
//   apiKey: myAPIKey,
//   mapStyle: "osm-bright-smooth", // More map styles on https://apidocs.geoapify.com/docs/maps/map-tiles/
//   maxZoom: 20
// }).addTo(map);

// my basemap
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/256/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    accessToken: 'pk.eyJ1IjoiZGFlbGVuZyIsImEiOiJjbGE4MnNpbjQwMHgxM29vMG1xNXA0YjR3In0.1m-yZapuOVRg2zWL8fimbw',
}).addTo(map);

// Adds in the Geojson of applicable census tracts 
// var tracts = L.geoJson(tract,{
//   interactive: false,
//   PointToLayer: function(feature, latlng){
//   }
// }).addTo(map);
// console.log(tracts);

// var polygons = tract.features.map(function(feature) {return turf.multiPolygon(feature.geometry.corrdinates);});
// var multiPoly = turf.multiPolygon(polygons);
// console.log(polygons);
// console.log(multiPoly);

// Different attempt 5 (all attempts but attempt 1 have failed, I will try anouther plugin tomorrow)
console.log("attempt 5");
var polygon5 = {
  type: 'Feature',
  properties: {},
  geometry: {
    type: 'Polygon',
    coordinates: []
  }
};

var coordinates = [];

tract.features[0].geometry.coordinates[0].forEach(function(coord) {
  coordinates.push([coord[0], coord[1]]);
});

polygon5.geometry.coordinates.push(coordinates);

var polygonLayerAttempet5 = L.geoJSON(polygon5).addTo(map);
console.log(polygon5);

// Different attempt 4  (this attempt seems like its close to working like attempt 1, but still passes false even if insdie the "polygon") look at itterating through tract Geojson

var coordinates = tract.features.reduce((acc, feature) => {
  return acc.concat(feature.geometry.coordinates);
}, []);
var polygon3 = turf.polygon(coordinates);
console.log("attempt 4");
console.log(polygon3);
var polygonLayerAttempet4 = L.geoJSON(polygon3).addTo(map);




// DIFFERENT ATTEMPT 3 (ended the same as attempt 2 with multiple features that have multiple geomoetrys) (pay attention to this for the FOREACH(FUNCTION(FEATURE)) which allows itteration though the entire geojsons features)
var polygons2 = [];

// Iterate over the features
tract.features.forEach(function(feature) {
  // Extract the coordinates for the feature
  var coordinates = feature.geometry.coordinates;

  // Create a Turf.js polygon from the coordinates
  var polygon = turf.polygon(coordinates);

  // Add the polygon to the array
  polygons2.push(polygon);
});
var multipoly2 = turf.multiPolygon(polygons2);
console.log("attempt 3");
console.log(polygons2);
console.log(multipoly2);

// DIFFERENT ATTEMPT 2 
// this variable contains an array of turf polygons that contain the corrdinates for each tract shp ATTEMPT 2, Also may be a way of iterating through the tract geojson
var polygons = tract.features.map((feature) =>
  turf.polygon(feature.geometry.coordinates)
);
console.log("attempt 2");
console.log(polygons);
// Create a Turf MultiPolygon from the array of polygons
var multipoly = turf.multiPolygon(polygons);

console.log(multipoly);
// var polygonLayerAttempet2 = L.geoJSON(multipoly).addTo(map);

// ATTEMPT 1 (success but only with 1 tract and only works if its a polygon not a multipolygon)
console.log('attempt 1');
var poly = turf.polygon(tract.features[1].geometry.coordinates);
console.log(poly);
var polygonLayerAttempt1 = L.geoJSON(poly).addTo(map);


// attempt 6 (this will go inside the geoapify js to figure out if pt (point) is inside of one of the 44 tracts
// console.log("attempt 6");
// var turfPolygons = [];
// var count = (0);
// tract.features.forEach(function(feature) {
//   var polygon = turf.polygon(feature.geometry.coordinates);
//   // turfPolygons.push(polygon);
//   turfPolygons = (polygon);
//   count = (count + 1);
//   console.log(count);
//   console.log(turfPolygons);
// });
// console.log(count);
// console.log(turfPolygons);





// Add Geoapify Address Search control 
const addressSearchControl = L.control.addressSearch(myAPIKey, {
  position: 'topright',
  resultCallback: (address) => {
    if (marker) {
      marker.remove();
    }
    
    if (!address) {
      return;
    }

    // testing lat lon for later use 
    console.log(address.lat)
    console.log(address.lon)
    var pt = turf.point([address.lon,address.lat])
    console.log(pt)
    var bool = turf.booleanPointInPolygon(pt, poly)
    console.log(bool)

    var bool2 = turf.booleanWithin(pt, poly)
    console.log(bool2)

    // This is supposed to iterate though each of the census tracts if bool3 comes out as true it breaks, if not than it remains false 
    console.log("attempt inside");
    var turfPolygons = [];
    var count = (0);
    var bool3 = (false);
    tract.features.forEach(function(feature) {
      var polygon = turf.polygon(feature.geometry.coordinates);
      turfPolygons = (polygon);
      bool3 = turf.booleanPointInPolygon(pt, turfPolygons);
      count = (count + 1);
      if (bool3) {
        console.log("HIHIHIHIHIHI");
        // Here is where you add code to display the point IS inside one of the applicable census tracts 
      }
      console.log(count);
      console.log(bool3);
      console.log(turfPolygons);
    });
    console.log(bool3)
    console.log(count);
    console.log(turfPolygons);

    marker = L.marker([address.lat, address.lon]).addTo(map);
    if (address.bbox && address.bbox.lat1 !== address.bbox.lat2 && address.bbox.lon1 !== address.bbox.lon2) {
      map.fitBounds([[address.bbox.lat1, address.bbox.lon1], [address.bbox.lat2, address.bbox.lon2]], { padding: [100, 100] })
    } else {
      map.setView([address.lat, address.lon], 15);
    }
  },
  suggestionsCallback: (suggestions) => {
    console.log(suggestions);
  }
});
map.addControl(addressSearchControl);


var poly2 = turf.polygon([[
  [-84.8203, 41.6937],
  [-80.5180, 41.6937],
  [-80.5180, 38.4034],
  [-84.8203, 38.4034],
  [-84.8203, 41.6937]
]]);
var pt2 = turf.point([-81, 41]);
var bool2 = turf.booleanPointInPolygon(pt2, poly2);
console.log(poly2)
var polygonLayerOHIO = L.geoJSON(poly2).addTo(map);
console.log(bool2)



