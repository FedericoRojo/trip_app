const pool = require("./pool");

async function getAllDrivers() {
    const {rows} = await pool.query("SELECT * FROM driver");
    return rows;
}


async function createDriver(name, dni) {
    await pool.query(`INSERT INTO driver (name, dni) VALUES ($1, $2)`, [name, dni]);
}

async function deleteDriver(dni) {
    //Drives that the driver deleted had
    try{
        const {rows} = await pool.query(`SELECT * FROM drives WHERE driver = $1`, [dni]);
        
        await pool.query(`DELETE FROM drives WHERE driver = $1`, [dni]);
        
        await pool.query(`DELETE FROM driver WHERE dni = $1`, [dni]);
        
        return rows;
    }catch (error) {
        console.error("Error in deleteDriver:", error);
        throw error; // You can also handle the error based on your app's requirements
    }
}

module.exports = {
    getAllDrivers,
    createDriver,
    deleteDriver
}