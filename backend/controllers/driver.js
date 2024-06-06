const { getDatabaseByName, updateDatabaseByName } = require("./databaseController");

const getDriversInfo = (req , res) => {
    let db = getDatabaseByName('Driver');
    res.json(db);
} 
const addDriver = (req , res) => {
    const { name, mobile } = req.body
    let db = getDatabaseByName('Driver');
    db.push(
        {
            name,
            mobile
        }
    )
    updateDatabaseByName("Driver",JSON.stringify(db));
    res.json({"msg":"success"})

}
const updateDriversInfo = (req , res) => {
    res.json( {
        Drivers : "info"
    })

}
module.exports = {
    getDriversInfo , addDriver , updateDriversInfo
}