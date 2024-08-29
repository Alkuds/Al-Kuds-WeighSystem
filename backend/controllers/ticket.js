const { getDatabaseByName, updateDatabaseByName } = require("./databaseController");
const { getId, addId } = require("./ticketId");

const getTicketsInfo = (req, res) => {
    let dataTickets = getDatabaseByName('Tickets');
    let inProgressTickets = []
    for (let i of dataTickets) {
        if (i.state === "finished") {
            inProgressTickets.push(i)
        }
    }
    res.json(inProgressTickets);
}

const getTicketsForDay = (req, res) => {
    let dataTickets = getDatabaseByName('Tickets');
    let inProgressTickets = []
    for (let i of dataTickets) {
        if (i.state === "finished" || i.state === "Alkuds-Storage") {
            inProgressTickets.push(i)
        }
    }
    console.log(inProgressTickets)
    res.json(inProgressTickets);
}

const getUnfinishedTicketsInfo = (req, res) => {
    let dataTickets = getDatabaseByName('Tickets');
    let inProgressTickets = []
    for (let i of dataTickets) {
        if (i.state === "progress") {
            inProgressTickets.push(i)
        }
    }
    res.json(inProgressTickets);
}

const getSpecificTicket = (req, res) => {
    let { id } = req.params
    let dataTickets = getDatabaseByName('Tickets');
    let inProgressTickets = []
    for (let i of dataTickets) {
        if (i.id === id) {
            res.json(i);
            break;
        }
    }
}

const addTicket = (req, res) => {
    let { id } = req.params
    let { ticket } = req.body;
    let dataTickets = getDatabaseByName('Tickets');
    let newId=id;
    if (id === "null" || id === "undefined") {
        newId = addId()
        ticket.id = newId
        dataTickets.push(ticket)
        console.log(dataTickets)
    }
    else {
        for (let i = 0; i < dataTickets.length; i++) {
            if (dataTickets[i].id === id) {
                dataTickets[i] = ticket
            }
        }
    }
    let progressTickets = []
    for (let i = 0; i < dataTickets.length; i++) {
        if(dataTickets[i].state === 'progress'){
            progressTickets.push(dataTickets[i])
        }
    }

    updateDatabaseByName('Tickets', JSON.stringify(dataTickets));
    res.json({ "msg": "success","id":newId,"db":progressTickets })

}

const TicketFinishState = (req, res) => {
    let { id } = req.params
    let db = getDatabaseByName('Tickets');
    let newDb = []
    let changedIronWeightsTicket;
    for (let i = 0; i < db.length; i++) {
        if(db[i].id === id){
            db[i].state = 'finished';
            changedIronWeightsTicket = db[i];
        }
        if (db[i].state === 'progress') {
            newDb.push(db[i]);
        }
    }
    updateDatabaseByName('Tickets', JSON.stringify(db));

    let iron = getDatabaseByName('IronStorage');
    changedIronWeightsTicket.reciept.map((el) => {
        iron.map((dataBaseIronel) => {
            if (changedIronWeightsTicket.type == "in") {
                if (dataBaseIronel.name == el.ironName) {
                    dataBaseIronel.props.map((prop) => {
                        if (prop.radius == el.radius) {
                            prop.weight += el.weight;
                           
                        }
                    })
                }
            }
            if (changedIronWeightsTicket.type == "out") {
                if (dataBaseIronel.name == el.ironName) {
                    dataBaseIronel.props.map((prop) => {
                        if (prop.radius == el.radius) {
                            prop.weight -= el.weight;
                           

                        }
                    })
                }
            }
        })

    })
    updateDatabaseByName('IronStorage', JSON.stringify(iron));

    res.json({ "msg": newDb });

}

module.exports = {
    getTicketsInfo,
    addTicket,
    TicketFinishState,
    getUnfinishedTicketsInfo,
    getSpecificTicket,
    getTicketsForDay
}