const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan")
const app = express();
const static = express.static(__dirname + "/public");
var session = require('express-session');
const cookieParser = require("cookie-parser");
const configRoutes = require("./routes");
const exphbs = require("express-handlebars");
const helmet = require("helmet");
const passport = require("passport");
const keys = require('./config/keys')
app.use(logger("short"));
app.use("/public", static);
app.use(helmet.xssFilter());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  secret:keys.sessionSecret ,
  resave: true,
  saveUninitialized: false,
}));
const viewEngine = exphbs({
  // Specify helpers which are only registered on this instance.
  helpers: {
      concat: function(str1,str2) { return str1 + str2}
  },
  defaultLayout: "main",
  partialsDir:["views/partials/"]
});

app.engine("handlebars", viewEngine);
app.set("view engine", "handlebars");
configRoutes(app);

app.listen(3000, () => {
  console.log("Your server is now listening on port 3000! Navigate to http://localhost:3000 to access it");
  if (process && process.send) process.send({done: true});
});