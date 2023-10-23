const express = require("express");
const routes = require("./Routes/api.routes");
const HttpError = require("./Models/http-error");
const app = express();
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
app.use(cookieParser());
app.use(express.json());
app.use(fileUpload());
app.get("/test",(req,res)=>{
  res.sendFile(__dirname)
})
app.use("/", routes);
app.use((req, res, next) => {
  const error = new HttpError("Unknown Route", 404);
  throw error;
});
app.use((error, req, res, next) => {
  if (res.headerSent == true) {
    return next(error);
  }
  res
    .status(error.code || 500)
    .json({ message: error.message || "Unknown error occurred" });
});
module.exports = app;
