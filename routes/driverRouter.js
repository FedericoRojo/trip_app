const {Router} = require("express");
const driverController = require("../controllers/driverController");

const driverRouter = Router();

driverRouter.get("/", driverController.getAllDrivers);
driverRouter.get("/createDriver", driverController.getCreateDriver);
driverRouter.post("/createDriver", driverController.createDriver);

driverRouter.post("/deleteDriver/:dni", driverController.deleteDriver);

module.exports = driverRouter;