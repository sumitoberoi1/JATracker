const userRoutes = require("./user");
const loginRoute = require("./login");
const signUpRoute = require("./signup");
const logoutRoute = require("./logout");
const applicationRoutes = require("./application")
const path = require("path");
const passportConfig = require('../config/passportConfig');
const routes = app => {
  passportConfig.setup()
  app.get('/',passportConfig.ensureAuthenticated, async function (req, res) {
    console.log(`Req user ${req.user}`)
    if (req.user) {
      res.redirect('/application');
    } else {
      res.redirect('/login');
    }
  });

  app.use("/login", loginRoute);
  app.use("/signup", signUpRoute);
  app.use("/logout", logoutRoute);
  app.use(function (req, res, next) {
    res.locals.session = req.session;
    next();
  });
  app.use("/application", applicationRoutes);
  app.use("/user", userRoutes);
  app.get("/about", (req, res) => {
    res.sendFile(path.resolve("static/about.html"));
  });

  app.use("*",(req,res) => {
    res.status = 404
    res.render("error/404")
  })
};

module.exports = routes;
