const { getDatabaseByName } = require("./databaseController");

const getDriversInfo = (req , res) => {
    let db = getDatabaseByName('Driver');
    res.json(db);
} 
const postDriversInfo = (req , res) => {
    res.json( {
        Drivers : "info"
    })

}
const updateDriversInfo = (req , res) => {
    res.json( {
        Drivers : "info"
    })

}
module.exports = {
    getDriversInfo , postDriversInfo , updateDriversInfo
}