const userRoutes = require("./user");
const loginRoute = require("./login");
const signUpRoute = require("./signup");
const logoutRoute = require("./logout");
const applicationRoutes = require("./application")
const path = require("path");
const userData = require("../data/users");

const routes = app => {
  app.get('/', async function (req, res) {
    if (req.cookies.AuthCookie) {
      if (!req.session.user) {
          let user = null;
          try 
          {
              user = await userData.getUserByID(req.cookies.AuthCookie);
              req.session.user = user;
          } 
          catch (e) 
          {
            res.clearCookie('AuthCookie');
            res.render("login", {error: e});
            return;
          }
      }
      console.log("AuthCookie" + req.cookies.AuthCookie)
      console.log("req.session.user" + JSON.stringify(req.session.user))
      res.redirect('/application');
    }
    else {
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
