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



const reverse_geocode = (location_geocode, callback) => {

  location_url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(location_geocode.latitude)}+${encodeURIComponent(location_geocode.longitude)}&key=f8c491bd60504535a1492fdd83019f2d`
  request({
    url: location_url,
    json: true
  }, (error, response) => {
    if (error) {
      callback(error, undefined)
    }
    const location_data = {
      'latitude': location_geocode.latitude,
      'longitude': location_geocode.longitude,
      'location': response.body.results[0].formatted
    }
    callback(undefined, location_data)
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
module.exports.reverse_geocode = reverse_geocode;