const pool = require("./pool");
/*
async function getAllUsernames() {
    const {rows} = await pool.query("SELECT * FROM usernames");
    return rows;
}
*/

async function getAllTrips() {
    const {rows} = await pool.query("SELECT * FROM trip");
    return rows;
}

async function getTripsTo(to) {
    const {rows} = await pool.query("SELECT * FROM trip t JOIN location l ON l.zipCode = t.locationTo WHERE l.zipCode = $1", [to]);
    
    return rows;
}

async function getTripsFrom(from) {
    const {rows} = await pool.query("SELECT * FROM trip t JOIN location l ON l.zipCode = t.locationFrom WHERE l.zipCode = $1", [from]);
    return rows;
}

async function getTripDetails(id){
    const {rows} = await pool.query("SELECT * FROM trip t WHERE t.id = $1", [id]);
    return rows[0];
}

async function getLocations() {
    const {rows} = await pool.query(`SELECT * FROM location`);
    return rows;
}

async function createTrip(fromDate, toDate, locationFrom, locationTo, name, maxPassengers, driverId) {
    const result = await pool.query(`INSERT INTO trip (fromDate, Todate, locationFrom, locationTo, name, maxPassengers) VALUES
                    ($1, $2, $3, $4, $5, $6) RETURNING id;`, [fromDate, toDate, locationFrom, locationTo, name, maxPassengers]);
    const tripId = result.rows[0].id;
    return tripId;
}

async function assignDriverToTrip(tripId, driverId) {
    await pool.query(`INSERT INTO drives (driver, trip) VALUES ($1, $2);`, [driverId, tripId]);
}

async function updateTrip(fromDate, toDate, locationFrom, locationTo, name, maxPassengers, tripId) {
    const queryTrip = `UPDATE trip SET fromdate = $1, todate = $2, locationfrom = $3, locationto = $4, name = $5,
                       maxpassengers = $6 WHERE id = $7;`;
    await pool.query(queryTrip, [fromDate, toDate, locationFrom, locationTo, name, maxPassengers, tripId]);
}

async function deleteTrip(id) {
    const query1 = `DELETE FROM trip WHERE id = $1`;
    const query2 = `DELETE FROM drives WHERE trip = $1`;
    await pool.query(query2, [id]);
    await pool.query(query1, [id]);
}

async function getTripPassengers(tripID) {
    const {rows} = await pool.query(`SELECT p.name, p.dni FROM travels t JOIN passenger p ON t.passenger=p.dni WHERE trip = $1`, [tripID]);
    return rows;
}

async function getPassenger(dni){
    try{
        const {rows} = await pool.query('SELECT * FROM passenger WHERE dni = $1', [dni]);
        return rows[0];
    }catch(e){
        console.log(e);
        return null;
    }
}

async function createPassenger(dni, name) {
    const result = await pool.query('INSERT INTO passenger (dni, name) VALUES ($1, $2) RETURNING *;', [dni, name]);
    return result.rows[0];
}


async function appPassengerToTrip(tripID, dni) {
    await pool.query('INSERT INTO travels (passenger, trip) VALUES ($1, $2);', [dni, tripID]);
}

async function deletePassengerFromTrip(tripID, dni) {
    await pool.query('DELETE FROM travels WHERE trip = $1 AND passenger = $2;', [tripID, dni]);
}






module.exports = {
    getAllTrips,
    getTripsTo,
    getTripsFrom,
    getTripDetails,
    getLocations,
    createTrip,
    assignDriverToTrip,
    updateTrip,
    deleteTrip,
    getTripPassengers,
    getPassenger,
    createPassenger,
    appPassengerToTrip,
    deletePassengerFromTrip
}