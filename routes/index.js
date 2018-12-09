const userRoutes = require("./users");
const applicationRoutes = require("./application")
const path = require("path");

const routes = app => {
  app.use("/application", applicationRoutes);
  app.use("/users", userRoutes);
  app.get("/about", (req, res) => {
    res.sendFile(path.resolve("static/about.html"));
  });
  app.use("*",(req,res) => {
    res.status = 404
    res.render("error/404")
  })
};

module.exports = routes;
