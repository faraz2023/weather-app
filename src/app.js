const path = require("path");
const express = require("express");
const hbs = require("hbs");

const app = express();

// setting up the PORT for heroku or, local use
const port = process.env.PORT || 3001

const geocode = require("./utils/geocode.js");
const forecast = require("./utils/forecast.js");

// set up the path to the public directory
public_dir = path.join(__dirname, "../public");
//only for static files
app.use(express.static(public_dir));

//Setting Up Handlebars engine
//set up path to customize views directory path
const viewsPath = path.join(__dirname, "../templates/views");
//set up path for partials directory
const partialsPath = path.join(__dirname, "../templates/partials");
//set up views folder
app.set("views", viewsPath);
//setting up handlebars
app.set("view engine", "hbs");
//set up partials
hbs.registerPartials(partialsPath);

//first parameter the <partial url>, second a function
// app.com

app.get("", (req, res) => {
  res.render("index", {
    title: "Faraz Wheather APP",
    name: "Faraz"
  });
});

// /help
app.get("/help", (req, res) => {
  message = "This is a message from Faraz";
  title = "Help";
  res.render("help", {
    message,
    title,
    name: "Faraz"
  });
});

// /about
app.get("/about", (req, res) => {
  res.render("about", {
    title: "about",
    name: "Faraz",
    number: "647123"
  });
});

app.get("/help/*", (req, res) => {
  res.render("404", {
    title: "404",
    name: "Faraz",
    message: "Help Page not Found"
  });
});

const send_wheather_by_name = (address, callback) => {
  geocode.get_geocodes(address, (error, data) => {
    if (error) {
      return callback(error, undefined)
    }

    const {
      latitude,
      longitude,
      location
    } = data;

    forecast.get_weather_by_geocodes(data, (error, data) => {
      if (error) {
        return callback(error, undefined)
      }
      callback(undefined, {
        latitude,
        longitude,
        location,
        current_temp: data.current_tempeture,
        apparent_temeture: data.apparent_temeture,
        summary: data.summary,
        rain_chance: data.rain_chance,
      })
    })
  })
}

// /wheather
app.get("/wheather", (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: "Provide Address Key"
    });
  }
  let address = req.query.address;
  send_wheather_by_name(address, (error, data) => {
    if (error) {
      return res.send({
        error: 'location error'
      })
    }
    const {
      latitude,
      longitude,
      location,
      current_temp,
      rain_chance,
      apparent_temeture,
      summary
    } = data;

    res.send({
      latitude,
      longitude,
      location,
      current_temp,
      rain_chance,
      apparent_temeture,
      summary
    });
  })
});

app.get("/wheather/bycurrentlocation", (req, res) => {
  if (!req.query.longitude || !req.query.latitude) {
    console.log(req.query)
    return res.send({
      error: "provide longitude and latitude as key values"
    })
  }
  const data = {
    'latitude': req.query.latitude,
    'longitude': req.query.longitude
  }

  geocode.reverse_geocode(data, (error, result) => {
    if (error) {
      return res.send({
        error: "Failed to use Reverse Geocode Service"
      })
    }
    data.location = result.location

    forecast.get_weather_by_geocodes(data, (error, result) => {
      if (error) {
        return res.send({
          error: 'Forecast failed'
        })
      }
      res.send({
        latitude: data.latitude,
        longitude: data.longitude,
        location: data.location,
        current_temp: result.current_tempeture,
        apparent_temeture: result.apparent_temeture,
        summary: result.summary,
        rain_chance: result.rain_chance,
      })
    })

  });
});

app.get("*", (req, res) => {
  res.render("404", {
    title: "404",
    name: "Faraz",
    message: "Page not Found"
  });
});

// run server
app.listen(port, () => {
  console.log(`server is running on ${port}`);
});