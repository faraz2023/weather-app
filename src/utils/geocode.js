const request = require("request");

const get_geocodes = (place_name, callback) => {
  url =
    `https://api.mapbox.com/geocoding/v5/` +
    `mapbox.places/${encodeURIComponent(place_name)}.json?access_token=` +
    `pk.eyJ1IjoiZmFyYXoyMDIzIiwiYSI6ImNrNGRmYzl0bDAyZDEzbXFlZW0waXhuaWYifQ.` +
    `UTuCxMyuR0G_fYYp1yo7lQ&limit=1`;

  request({ url, json: true }, (error, response) => {
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

module.exports.get_geocodes = get_geocodes;
