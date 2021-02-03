// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();
require('dotenv').config()

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

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
  res.json({greeting: 'hello API'});
});

app.get("/api/timestamp/:time", function (req, res) {
  var time = req.params.time

  if(!isValidDate(time))
  {
    time = new Date(parseInt(time));
  }

  try {
    var dateUnix = new Date(time)
    const message = {unix: dateUnix.getTime(), utc: dateUnix.toUTCString()}
    res.json(message)
  }
  catch {
    res.json({ error : "Invalid Date" })
  }
});

function isValidDate(d) {
  d = new Date(d);
  return d instanceof Date && !isNaN(d);
}


// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
