const {Router} = require("express");
const locationController = require("../controllers/locationController");

const locationRouter = Router();

locationRouter.get("/", locationController.getAllLocations);

locationRouter.get("/createLocation", locationController.getCreateLocation);
locationRouter.post("/createLocation", locationController.createLocation);

locationRouter.post("/deleteLocation/:zipcode", locationController.deleteLocation);

module.exports = locationRouter;