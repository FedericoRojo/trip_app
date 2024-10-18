const db = require("../db/queries");
/*
async function getUsernames  (req, res) {
    const searchParam = req.query.search;
    const usernames = await db.getAllUsernames();
    const result = await db.searchBy(searchParam);

    res.send("Usernames: " + usernames.map( user => user.username));
};*/
let locations;

async function refreshLocations() {
    locations = await db.getLocations();
}

//Returns all trips availables)
async function getAllTrips (req, res) {
    const trips = await db.getAllTrips();
    if(locations==null){
        await refreshLocations();
    }
    res.render('viewTrips', {trips: trips, locations: locations});
}


//Returns trips to specified location (destination)
async function getTripTo (req,res) {
    const to = req.query.location;
    const trips = await db.getTripsTo(to);
    if( locations == null ){
        await refreshLocations();
    }
    console.log(trips);
    res.render('viewTrips', {trips: trips, locations: locations});
}

//Given id returns the trip
async function getTripDetails(req, res){
    const id = req.params.id;
    const trip = await db.getTripDetails(id);
    res.render('viewTripDetail', {trip: trip});
}

//Returns trips from specified location (from)
async function getTripFrom (req, res){
    const from = req.query.location;
    const trips = await db.getTripsFrom(from);
    if( locations == null ){
        await refreshLocations();
    }
    res.render('viewTrips', {trips: trips, locations: locations});
} 

async function getCreateTrip(req, res) {
    if(locations==null){
        await refreshLocations();
    }
    res.render('createTrip', {locations: locations, error: null});
}

async function createTrip (req, res){

    try{
        const {fromDate, toDate, fromLocation, toLocation, name, maxPassengers, driverid } = req.body;

        const tripId = await db.createTrip(fromDate, toDate, fromLocation, toLocation, name, maxPassengers);
        await db.assignDriverToTrip(tripId, driverid);
        
        const trips = await db.getAllTrips();
        if( locations == null ){
            await refreshLocations();
        }
        res.render('viewTrips', {trips: trips, locations: locations });
    } catch (e){
        if( locations == null ){
            await refreshLocations();
        }
        res.render('createTrip', {locations: locations, error: e.message});
    }
}

async function deleteTrip(req, res) {
    const id = req.params.id;
    await db.deleteTrip(id);
    getAllTrips(req, res);
}

async function getEditTrip(req, res) {
    const id = req.params.id;
    const tripDetails = await db.getTripDetails(id);
    if(locations==null){
        await refreshLocations();
    }
    const updatedTripDetails = {
        ...tripDetails,
        fromdate: tripDetails.fromdate.toISOString().split('T')[0],
        todate: tripDetails.todate.toISOString().split('T')[0],
    };
    res.render("editTrip", {trip: updatedTripDetails , locations: locations});
}

async function editTrip(req, res) {
    const tripId = req.params.id;
    const {fromdate, todate, fromlocation, tolocation, name, maxpassengers } = req.body;
    await db.updateTrip(fromdate, todate, fromlocation, tolocation, name, maxpassengers, tripId);
    getAllTrips(req, res);
}

async function getTripPassengers(req, res) {
    const tripID = req.params.id;
    const trip = await db.getTripDetails(tripID);
    const passengers = await db.getTripPassengers(tripID);
    res.render('handleTripPassenger', {trip: trip, passengers: passengers, error: null});
}

async function addPassengerToTrip(req, res) {
    const tripID = req.params.id;
    const {passengername, dni} = req.body;
    let passenger = await db.getPassenger(dni);
    
    //If passenger do not exist, create it
    if(passenger == null){
        passenger = await db.createPassenger(dni, passengername);
    }
    try {
        //If everything is correct, add the passenger to the trip
        if( passenger.name == passengername && passenger.dni == dni){
            await db.appPassengerToTrip(tripID, dni);
            getTripPassengers(req, res);
        }else{
            const trip = await db.getTripDetails(tripID);
            const passengers = await db.getTripPassengers(tripID);
            res.render('handleTripPassenger', {trip: trip, passengers: passengers, error: 'Passenger DNI do not match with its name'});
        }
    }catch(e){
        const trip = await db.getTripDetails(tripID);
        const passengers = await db.getTripPassengers(tripID);
        res.render('handleTripPassenger', {trip: trip, passengers: passengers, error: 'Ya existe un pasajero con ese DNI'});
    }
}

async function deletePassenger(req, res) {
    const tripID = req.params.id;
    const {dni} = req.body;
    await db.deletePassengerFromTrip(tripID, dni);
    res.redirect(`/trip/${tripID}/handlePassengers`);
}

module.exports = {
    getAllTrips,
    getTripDetails,
    getTripFrom,
    getTripTo,
    deleteTrip,
    createTrip,
    editTrip,
    getEditTrip,
    getCreateTrip,
    createTrip,
    getTripPassengers,
    addPassengerToTrip,
    deletePassenger
}
