const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const router = require("./routes/index");
require("./models/index");

dotenv.config();

const app = express();
const port = process.env.PORT || 9000;

app.use(cors({ credentials: true, origin: "*" }));

app.use(express.json());
app.use(bodyParser.json());

app.use("/api", router);

app.listen(port, () => {
  console.log("Server running at port", port, process.env.NODE_ENV);
});
