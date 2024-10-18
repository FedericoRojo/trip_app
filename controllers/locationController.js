const db = require("../db/locationqueries");

//Returns all drivers
async function getAllLocations (req, res) {
    const locations = await db.getAllLocations();
    res.render('viewLocations', {locations: locations});
}

async function getCreateLocation (req, res) {
    res.render('createLocation', {error: null});
}

async function createLocation (req, res) {
    const {zipcode, name} = req.body;
    try{
        await db.createLocation(zipcode, name);
        res.redirect("/locations/");
    }catch(e){
        res.render('createLocation', {error: e});
    }
    
}


async function deleteLocation (req, res) {
    const zipcode = req.params.zipcode;
    await db.deleteLocation(zipcode);
    res.redirect("/locations/");
}



module.exports = {
    getAllLocations,
    getCreateLocation,
    createLocation,
    deleteLocation
}
