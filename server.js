const path = require("path");
const express = require("express");
const app = express();
const indexRouter = require("./routes/indexRouter");

app.use("/", indexRouter);
app.use(express.static("public"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.listen(8081, () => {
  console.log(`Server : http://localhost:8081 (connected)`);
});
