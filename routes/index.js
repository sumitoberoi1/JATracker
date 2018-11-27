const postRoutes = require("./posts");
const userRoutes = require("./users");
const path = require("path");

const routes = app => {
  app.use("/application", postRoutes);
  app.use("/users", userRoutes);
  app.get("/about", (req, res) => {
    res.sendFile(path.resolve("static/about.html"));
  });

  app.use("*", (req, res) => {
    res.redirect("/posts");
  });
};

module.exports = routes;
