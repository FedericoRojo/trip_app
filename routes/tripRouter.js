const {Router} = require("express");
const tripController = require("../controllers/tripController");

const tripRouter = Router();

tripRouter.get("/", tripController.getAllTrips);

tripRouter.get("/getTripTo", tripController.getTripTo);
tripRouter.get("/getTripFrom", tripController.getTripFrom);

tripRouter.get("/trip/:id", tripController.getTripDetails);

tripRouter.get("/createTrip", tripController.getCreateTrip);
tripRouter.post("/createTrip", tripController.createTrip);

tripRouter.get("/editTrip/:id", tripController.getEditTrip);
tripRouter.post("/editTrip/:id", tripController.editTrip);

tripRouter.get("/deleteTrip/:id", tripController.deleteTrip);

tripRouter.get("/trip/:id/handlePassengers", tripController.getTripPassengers);
tripRouter.post("/trip/:id/addPassenger", tripController.addPassengerToTrip);
tripRouter.post("/trip/:id/deletePassenger", tripController.deletePassenger);

module.exports = tripRouter;