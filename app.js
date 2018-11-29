var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors"); // addition we make
var getJSON = require("get-json");

//var indexRouter = require('./routes/index');
//var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

require("dotenv").config();

// Use CORS
app.use(cors());

app.use("/calling", (req, res) => {
  let summonerName = req.query.name.toLowerCase();
  const url = `https://na1.api.riotgames.com/lol/summoner/v3/summoners/by-name/${summonerName}?api_key=${
    process.env.REACT_APP_API_KEY
  }`;
  getJSON(url, function(error, summoner) {
    const url2 = `https://na1.api.riotgames.com/lol/champion-mastery/v3/champion-masteries/by-summoner/${
      summoner.id
    }?api_key=${process.env.REACT_APP_API_KEY}`;
    getJSON(url2, function(error, data) {
      res.send(data);
    });
  });
});

//app.use('/calling', indexRouter);
//app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
