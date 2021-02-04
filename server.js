// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();
require('dotenv').config()

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({ optionsSuccessStatus: 200 }));  // some legacy browsers choke on 204

//My Own LoggerMiddleware
app.use((req, rest, next) => {
  console.log(req.method + " " + req.path + " " + req.ip);
  next()
})

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({ greeting: 'hello API' });
});

// micro-service 1
app.get("/api/timestamp/:time?", function (req, res) {
  var time = req.params.time
  if (time) {
    if (/\d{5,}/.test(time)) {
      const dateInt = parseInt(time);
      //Date regards numbers as unix timestamps, strings are processed differently
      res.json({ unix: dateInt, utc: new Date(dateInt).toUTCString() });
    } else {
      let dateObject = new Date(time);
  
      if (dateObject.toString() === "Invalid Date") {
        res.json({ error: "Invalid Date" });
      } else {
        res.json({ unix: dateObject.valueOf(), utc: dateObject.toUTCString() });
      }
    }
  }
  else
  {
    var date = new Date()
    const message = { unix: date.getTime(), utc: date.toUTCString() }
    res.json(message)
  }
});

//micro-service 2
app.get("/api/whoami", function (req, res) {
  var ipaddress = req.ip
  var software = req.headers['user-agent']
  var language = req.headers['accept-language']
  var message = { ipaddress, language, software }
  res.json(message)
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
