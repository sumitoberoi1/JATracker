const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan")
const app = express();
const static = express.static(__dirname + "/public");
const session = require('express-session');
const cookieParser = require("cookie-parser");
const configRoutes = require("./routes");
const exphbs = require("express-handlebars");
const helmet = require("helmet");
const passport = require("passport");
const keys = require('./config/keys')
const flash = require("connect-flash");
const passportConfig = require('./config/passportConfig');
app.use(logger("short"));
app.use(helmet())
app.use("/public", static);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const rewriteUnsupportedBrowserMethods = (req, res, next) => {
  if (req.body && req.body._method) {
      req.method = req.body._method;
      delete req.body._method;
  }
  next();
};
const viewEngine = exphbs({
  helpers: {
      concat: function(str1,str2) { return str1 + str2},
      select:  function( selected, options ){
        return options.fn(this).replace(
          new RegExp(' value=\"' + selected + '\"'),
          '$& selected="selected"');
    },
      formatDate: function(dateString) {
        let date = new Date(dateString) 
        return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`
      },
      formDateFormat: function(dateString) {
        // let date = new Date(dateString) 
        // return `${date.getUTCFullYear()}-${("0" + date.getDate()).slice(-2)}-${("0" + (date.getMonth() + 1)).slice(-2)}`
        return dateString.toISOString().substring(0, 10)
      }
  },
  defaultLayout: "main",
  partialsDir:["views/partials/"]
});

app.use(rewriteUnsupportedBrowserMethods);
app.use(cookieParser());
app.use(session({
  secret:keys.sessionSecret ,
  resave: true,
  saveUninitialized: true,
}));
app.use(flash())
app.use(passport.initialize())
app.use(passport.session());
app.engine("handlebars", viewEngine);
app.set("view engine", "handlebars"); 

const doesUserHaveProfile = (req,res,next) => {
  
  const path = "/user/edit_profile"
   if (req.isAuthenticated()) {
      const user = req.user 
      
      if (user && user.profile && user.profile.fullName) {
       
        next()
      } else {
        if (req.method === 'GET' && req.path === path) {
          next()
        } else {
          res.redirect("/user/edit_profile")
        }
      }
   } else {
     next()
   } 
}
app.use(function (req, res, next) {
  res.locals.errors = req.flash('error');
  next();
});
//app.use(doesUserHaveProfile)

configRoutes(app);
app.listen(3000, () => {
  console.log("Your server is now listening on port 3000! Navigate to http://localhost:3000 to access it");
  if (process && process.send) process.send({done: true});
});