const { getDatabaseByName, updateDatabaseByName } = require("./databaseController");

const getTicketsInfo = (req, res) => {

    res.json(getDatabaseByName('Tickets'));
}

const addTicket = (req, res) => {
    let requestBody = req.body;
    let data = getDatabaseByName('Tickets');
    data.push(requestBody);
    updateDatabaseByName('Tickets', JSON.stringify(data));
    let iron = getDatabaseByName('IronStorage');
    requestBody.reciept.map((el) => {
        iron.map((dataBaseIronel) => {
            if (requestBody.type == "in") {
                if (dataBaseIronel.name == el.ironName) {
                    dataBaseIronel.weight += el.weight;
                }
            }
            if (requestBody.type == "out") {
                if (dataBaseIronel.name == el.ironName) {
                    dataBaseIronel.weight -= el.weight;
                }
            }
        })

    })
    updateDatabaseByName('IronStorage', JSON.stringify(iron));

    return res.json({
        "message": "ticket added succefully"
    });

}

module.exports = {
    getTicketsInfo,
    addTicket
}