const { getDatabaseByName, updateDatabaseByName } = require("./databaseController");
const Client = require('../models/client')
const getClientsInfo = (req , res) => {
    let db = getDatabaseByName('Clients');
    res.json(db);

}
const addClients = async (req , res) => {
    const { name,address} = req.body
    let newClient;
    try{
        newClient = new Client(
            {
                name,
                address,
                ticketsIds:[],
                clientId:2
            }
        )

        newClient.save()
    }
    catch(err){
        console.log(err)
    }
    res.json(newClient)

}
const updateClientsInfo = (req , res) => {
    res.json( {
        clients : "info"
    })

}
module.exports = {
    getClientsInfo , addClients , updateClientsInfo
}