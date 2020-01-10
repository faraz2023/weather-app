const request = require("request");

const get_weather_by_geocodes = ({ latitude, longitude }, callback) => {
  url =
    `https://api.darksky.net/forecast/` +
    `5ab73615a4eea7184315759bab5452d2/${encodeURIComponent(
      latitude
    )},${encodeURIComponent(longitude)}?units=si`;
  request({ url, json: true }, (error, response) => {
    if (error) {
      callback(error, undefined);
    } else if (response.body.error) {
      callback(response.body.error, undefined);
    } else {
      return callback(undefined, {
        current_tempeture: response.body.currently.temperature,
        rain_chance: response.body.currently.precipProbability
      });
    }
  });
};

module.exports.get_weather_by_geocodes = get_weather_by_geocodes;
