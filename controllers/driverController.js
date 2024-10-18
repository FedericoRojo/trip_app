const db = require("../db/driverqueries");

//Returns all drivers
async function getAllDrivers (req, res) {
    const drivers = await db.getAllDrivers();
    res.render('viewDrivers', {drivers: drivers});
}

async function getCreateDriver(req, res) {
    res.render('createDriver', {error: null});
}

async function createDriver(req, res) {
    const {drivername, dni} = req.body;
    await db.createDriver(drivername, dni);
    getAllDrivers(req, res);
}

async function deleteDriver(req, res) {
    const dni = req.params.dni; 
    if (!dni) {
        return res.status(400).send("Driver DNI is missing.");
    }

    try {
        await db.deleteDriver(dni); 
        res.redirect('/drivers'); 
    } catch (error) {
        res.status(500).send("Error deleting driver.");
    }
}

module.exports = {
    getAllDrivers,
    getCreateDriver,
    createDriver,
    deleteDriver
}
