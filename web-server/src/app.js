const path = require("path");
const express = require("express");
const hbs = require("hbs");
const geocode = require("./utils/geocode");
const forecast = require("./utils/forecast");

const app = express();

//define paths for Express Config
const publieDirectoryPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

//setup handlebars engine and views location
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

//Setup static directory to serve
app.use(express.static(publieDirectoryPath));

app.get("", (req, res) => {
  res.render("index", {
    title: "Weather",
    name: "ochuma",
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About me",
    name: "ochuma",
  });
});

app.get("/help", (req, res) => {
  res.render("help", {
    name: "ochuma",
    helpText: "This is my help text",
  });
});

app.get("/weather", (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: "You must provide an address",
    });
  }
  geocode(
    req.query.address,
    (error, { latitude, longitude, location } = {}) => {
      if (error) {
        return res.send({ error });
      }

      forecast(latitude, longitude, (error, forecastData) => {
        if (error) {
          return res.send({ error });
        }
        res.send({
          forecast: forecastData,
          location,
          address: req.query.address,
        });
      });
    }
  );
});

app.get("*", (req, res) => {
  res.render("404", {
    title: "404",
    name: "ochuma",
    errorMessage: "Page Not Found",
  });
});

app.get("/help/*", (req, res) => {
  res.render("404", {
    title: "404",
    name: "ochuma",
    errorMessage: "Help article not found",
  });
});

app.listen(3000, () => {
  console.log("server is up on port 3000,");
});
