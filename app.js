const express = require("express");
const path = require("path");
const driverRouter = require("./routes/driverRouter");
const locationRouter = require("./routes/locationRouter");
const passengerRouter = require("./routes/locationRouter");
const tripRouter = require("./routes/tripRouter");
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(express.static(path.join(__dirname, 'styles')));
app.set("view engine", "ejs");


app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use("/", tripRouter);
app.use("/drivers", driverRouter);
app.use("/locations", locationRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`App running of port ${PORT}`) )