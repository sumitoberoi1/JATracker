const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan")
const app = express();
const static = express.static(__dirname + "/public");

const configRoutes = require("./routes");
const exphbs = require("express-handlebars");
app.use(logger("short"));
app.use("/public", static);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

configRoutes(app);

app.listen(3000, () => {
  console.log("Your server is now listening on port 3000! Navigate to http://localhost:3000 to access it");
  if (process && process.send) process.send({done: true});
});