const { getDatabaseByName } = require("./databaseController");

const getClientsInfo = (req , res) => {
    let db = getDatabaseByName('Clients');
    res.json(db);

}
const postClientsInfo = (req , res) => {
    res.json( {
        clients : "info"
    })

}
const updateClientsInfo = (req , res) => {
    res.json( {
        clients : "info"
    })

}
module.exports = {
    getClientsInfo , postClientsInfo , updateClientsInfo
}