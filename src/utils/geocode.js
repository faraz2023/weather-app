const request = require("request");

const get_geocodes = (place_name, callback) => {
  url =
    `https://api.mapbox.com/geocoding/v5/` +
    `mapbox.places/${encodeURIComponent(place_name)}.json?access_token=` +
    `pk.eyJ1IjoiZmFyYXoyMDIzIiwiYSI6ImNrNGRmYzl0bDAyZDEzbXFlZW0waXhuaWYifQ.` +
    `UTuCxMyuR0G_fYYp1yo7lQ&limit=1`;

  request({
    url,
    json: true
  }, (error, response) => {
    if (error) {
      callback("request failed", undefined);
    } else if (response.body.features.length === 0) {
      callback("location not found", undefined);
    } else {
      latitude = response.body.features[0].center[1];
      longitude = response.body.features[0].center[0];
      place_name = response.body.features[0].place_name;
      coordinates = [latitude, longitude];
      if (callback) {
        callback(undefined, {
          latitude,
          longitude,
          location: place_name
        });
      }
    }
  });
};



const google_geolocation = (callback) => {
  const url = "https://www.googleapis.com/geolocation/v1/geolocate/?outputFormat=parameters&key=AIzaSyCHxQfko0gDB_yARvkmIXmj7odYh9b_Iw0"

  request.post({
      url,
    },
    (error, response) => {
      if (error) {
        callback(error, undefined)
      }
      location_geocode = JSON.parse(response.body)
      location_url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(location_geocode.location.lat)}+${encodeURIComponent(location_geocode.location.lng)}&key=f8c491bd60504535a1492fdd83019f2d`
      request({
        url: location_url,
        json: true
      }, (error, response) => {
        if (error) {
          callback(error, undefined)
        }
        const location_data = {
          'latitude': location_geocode.location.lat,
          'longitude': location_geocode.location.lng,
          'location': response.body.results[0].formatted
        }
        callback(undefined, location_data)
      })

    })
}
/*
google_geolocation((error, result) => {
  if (error) {
    return console.log(error);
  }
  console.log(result)
})
*/

module.exports.get_geocodes = get_geocodes;
module.exports.google_geolocation = google_geolocation;