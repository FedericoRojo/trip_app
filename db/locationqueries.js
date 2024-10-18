const pool = require("./pool");

async function getAllLocations() {
    const {rows} = await pool.query("SELECT * FROM location");
    return rows;
}


async function createLocation(zipcode, name) {
    await pool.query(`INSERT INTO location (zipcode, name) VALUES ($1, $2)`, [zipcode, name]);
}

async function deleteLocation(zipcode) {
    //Return trips where location deleted where the start or destination
    const {rows} = pool.query(`SELECT * FROM trip WHERE locationFrom = $1 OR locationTo = $1`, [zipcode]);
    await pool.query(`DELETE FROM location WHERE zipCode = $1`, [zipcode]);
    return rows;
}

module.exports = {
    getAllLocations,
    createLocation,
    deleteLocation,
}