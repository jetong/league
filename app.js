var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
var getJSON = require("get-json");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Access .env variables
require("dotenv").config();

// Use CORS
app.use(cors());

// Filter for champions that have earned chests.
function hasChestEarned(champion) {
  if (champion.chestGranted) {
    return true;
  }
  return false;
}

// Reduce the completeChampionList to only those champions that haven't earned chests yet.
function filterOutChestEarnedChamps(
  hasChestEarnedChamps,
  completeChampionList
) {
  champNames = [];
  completeChampionList.forEach(function(obj) {
    let match = false;
    hasChestEarnedChamps.forEach(function(champ) {
      if (obj.championId === champ.championId) {
        match = true;
      }
    });
    if (!match) {
      champNames.push(obj.championName);
    }
  });
  return champNames;
}

app.use("/api", (req, res) => {
  // Get latest version/patch number for RIOT
  const versionUrl = "https://ddragon.leagueoflegends.com/api/versions.json";
  let version = "";
  let completeChampionList = [];

  getJSON(versionUrl, function(error, versionArray) {
    version = versionArray[0];
    // Get complete list of champions as an array of {id, name} objects
    const ddragonUrl = `http://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/champion.json`;

    getJSON(ddragonUrl, function(error, champions) {
      championsArray = Object.values(champions.data);
      championsArray.forEach(function(champ) {
        completeChampionList.push({
          championId: parseInt(champ.key),
          championName: champ.id
        });
      });
    });
  });

  let summonerName = req.query.name.toLowerCase();
  const url = `https://na1.api.riotgames.com/lol/summoner/v3/summoners/by-name/${summonerName}?api_key=${
    process.env.REACT_APP_API_KEY
  }`;

  // Look up summoner.id by summonerName using RIOT API
  getJSON(url, function(error, summoner) {
    if (summoner === undefined) {
      res.send({ champs: undefined, version: undefined });
    } else {
      const url2 = `https://na1.api.riotgames.com/lol/champion-mastery/v3/champion-masteries/by-summoner/${
        summoner.id
      }?api_key=${process.env.REACT_APP_API_KEY}`;

      // Using summoner.id, retrieve champion data from RIOT and filter for champions that haven't yet earned chests.
      getJSON(url2, function(error, data) {
        let hasChestEarnedChamps = data.filter(hasChestEarned);
        let result = filterOutChestEarnedChamps(
          hasChestEarnedChamps,
          completeChampionList
        );
        res.send({ result: result.sort(), version: version });
      });
    }
  });
});


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
