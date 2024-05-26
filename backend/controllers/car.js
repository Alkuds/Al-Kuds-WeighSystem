const { getDatabaseByName } = require("./databaseController")

const getCarInfo = (req, res) => {
    let db = getDatabaseByName('car');
    res.json(db);
 }
const postCarInfo = (req, res) => {
    res.json({
        "vitolo": "viito"
    })
 }
const updateCarInfo = (req, res) => { }

module.exports = {
    getCarInfo, postCarInfo, updateCarInfo
}