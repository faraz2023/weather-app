const request = require("request");

const get_weather_by_geocodes = ({ latitude, longitude }, callback) => {
  url =
    `https://api.darksky.net/forecast/` +
    `5ab73615a4eea7184315759bab5452d2/${encodeURIComponent(
      latitude
    )},${encodeURIComponent(longitude)}?units=us`;
  request(
    {
      url,
      json: true
    },
    (error, response) => {
      if (error) {
        callback(error, undefined);
      } else if (response.body.error) {
        callback(response.body.error, undefined);
      } else {
        let daily_data = [];
        response.body.daily.data.forEach(element => {
          let {
            precipProbability,
            precipType,
            temperatureMin,
            temperatureMax,
            time
          } = element;
          let day_data = {
            time,
            precipProbability,
            precipType,
            temperatureMin,
            temperatureMax
          }
          daily_data.push(day_data);
        });
        return callback(undefined, {
          daily_data,
          current_tempeture: response.body.currently.temperature,
          apparent_temeture: response.body.currently.apparentTemperature,
          rain_chance: response.body.daily.data[0].precipProbability,
          summary: response.body.daily.summary
        });
      }
    }
  );
};

module.exports.get_weather_by_geocodes = get_weather_by_geocodes;
