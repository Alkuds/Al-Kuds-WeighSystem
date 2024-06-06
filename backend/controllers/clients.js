const { getDatabaseByName, updateDatabaseByName } = require("./databaseController");

const getClientsInfo = (req , res) => {
    let db = getDatabaseByName('Clients');
    res.json(db);

}
const addClients = (req , res) => {
    const { name,address } = req.body

    let db = getDatabaseByName('Clients');
    console.log(db)
    db.push(
        {
            name,
            address,
            tickets:[]
        }
    )

    updateDatabaseByName("Clients",JSON.stringify(db));
    res.json({"msg":"success"})

}
const updateClientsInfo = (req , res) => {
    res.json( {
        clients : "info"
    })

}
module.exports = {
    getClientsInfo , addClients , updateClientsInfo
}