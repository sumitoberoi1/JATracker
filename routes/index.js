const userRoutes = require("./user");
const loginRoute = require("./login");
const signUpRoute = require("./signup");
const logoutRoute = require("./logout");
const applicationRoutes = require("./application")
const path = require("path");

const routes = app => {
  app.get('/', function (req, res) {
    console.log()
    if (!req.cookies.AuthCookie) {
      console.log("are you here")
      res.redirect('/login');
    } else {
      res.redirect('/user/profile');
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
