const connectDb = require("./config/DB");
const { port } = require("./config/config");
const app = require("./app");

//Mongo Connect && Server Connection
connectDb()
  .then(() => {
    app.listen(port, () => console.log("Listening to port", port));
  })
  .catch(() => console.log("Connection Failed"));
