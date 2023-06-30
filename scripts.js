// js for map 
var map = L.map('map').setView([47.2452,-122.4582],12);

var marker = null;

var myAPIKey = "f5b6e12c640547b1bfedad5fc4a1456f"; // Get an API Key on https://myprojects.geoapify.com

// my basemap
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/256/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    accessToken: 'pk.eyJ1IjoiZGFlbGVuZyIsImEiOiJjbGE4MnNpbjQwMHgxM29vMG1xNXA0YjR3In0.1m-yZapuOVRg2zWL8fimbw',
}).addTo(map);

// Adds in the Geojson of applicable census tracts 
var tracts = L.geoJson(tract,{
  interactive: false,
  PointToLayer: function(feature, latlng){
  }
}).addTo(map);

// Add Geoapify Address Search control 
const addressSearchControl = L.control.addressSearch(myAPIKey, {
  position: 'topright',
  resultCallback: (address) => {
    // if there is currently a marker clear it 
    if (marker) {
      marker.remove();
    }
    // if there is not a address nothing is returned 
    if (!address) {
      return;
    }

    // testing lat lon for later use 
    console.log(address.lat)
    console.log(address.lon)
    var pt = turf.point([address.lon,address.lat])

    // This is supposed to iterate though each of the census tracts if bool3 comes out as true it logs, if not than it remains false 
    var turfPolygons = [];
    var count = (0);
    var bool3 = (false);
    var boolf = (true);
    tract.features.forEach(function(feature) {
      var polygon = turf.polygon(feature.geometry.coordinates);
      turfPolygons = (polygon);
      bool3 = turf.booleanPointInPolygon(pt, turfPolygons);
      count = (count + 1);
      if (bool3) {
        boolf = (false);
        alert("This census address is applicable.");
        
      }
    });
    if (boolf) {
      alert("This census address IS NOT applicable");
    }

    console.log(count);
    // adds marker to map at the point of the address 
    marker = L.marker([address.lat, address.lon]).addTo(map);
    // Sets the view to the location of where the address is 
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

