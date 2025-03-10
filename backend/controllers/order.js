const { getDatabaseByName, updateDatabaseByName } = require("./databaseController");
const Order = require('../models/order')
const Client = require("../models/client")
const Iron = require("../models/iron")
const Wallet = require("../models/wallet")
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

const getTicketsForDay = async(req, res) => {
    let orders,inProgressTickets = [];
    try {
        orders = await Order.find()
        for(let i of orders){
            if (i.state === "finished" || i.state === "Alkuds-Storage") {
                inProgressTickets.push(i)
            }
        }
    }
    catch (err) {
        console.log(err)
    }
    res.json(inProgressTickets);
}

const getUnfinishedOrdersInfoGroupedByClientId = async (req, res) => {
    let orders;
    let ordersSorted = {}
    try {
        orders = await Order.find({ state: "progress" })
        for(let x of orders){
            if(x.clientId in ordersSorted){
                let newArr = ordersSorted[`${x.clientId}`]
                newArr.push(x)
                ordersSorted[`${x.clientId}`]= newArr;
            }
            else{
                ordersSorted[`${x.clientId}`] = [x]
            }
        }
    }
    catch (err) {
        console.log(err)
    }
    res.json(ordersSorted);
}

const getUnfinishedOrdersInfoGroupedByType = async (req, res) => {
    let orders;
    let inOrders =[], outOrders = [];
    try {
        orders = await Order.find({ state: "progress" })
        for(let x of orders){
            if(x.type === 'in'){
                inOrders.push(x)
            }
            else{
                outOrders.push(x)
            }
        }
    }
    catch (err) {
        console.log(err)
    }
    res.json({inOrders,outOrders});
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

const EditOrderTicket = async (req, res) => {
    const { orderId, ticket } = req.body
    let newOrder;
    try {
        newOrder = await Order.findById(orderId)
        newOrder.ticket = ticket
        let orderUpdate = await Order.updateOne({ "_id": orderId }, newOrder);
        res.json(orderUpdate)
    }
    catch (err) {
        console.log(err)
    }
}

const addOrder = async (req, res) => {
    const { ticket, type, clientId, driverId, carId, totalPrice } = req.body
    let newOrder;
    try {
        newOrder = new Order(
            {
                "state": "New", type, clientId, driverId, carId, ticket, totalPrice
            }
        )

        newOrder.save().then(async (data) => {
            await Client.updateOne({ "_id": clientId },
                {
                    $push: {
                        'ticketsIds': data._id.toString()
                    }
                }
            )
        })
    }
    catch (err) {
        console.log(err)
    }

    res.json(newOrder)

}

const getClientOrders = async (req, res) => {
    console.log("first")
    const { clientId } = req.body;
    let orders;
    try {
        orders = await Order.find({ "clientId": clientId })
    }
    catch (err) {
        console.log(err)
    }

    res.json(orders)

}

const OrderFinishState = async (req, res) => {
    const { orderId } = req.body;
    let updatedOrder
    try {
        updatedOrder = await Order.findByIdAndUpdate({ _id: orderId }, { "state": "جاري انتظار الدفع" }, { returnDocument: 'after' })
    }
    catch (err) {
        console.log(err)
    }

    let totalProfitForOrder = 0;
    const orderTickets = updatedOrder.ticket
    for (let i = 0; i < orderTickets.length; i++) {
        let ironData = await Iron.findOne({
            $and: [
                { "name": orderTickets[i].ironName },
                { "radius": orderTickets[i].radius }
            ]
        });
        let profit = 0, totalCostForTicket = 0;
        for (let j = 0; j < ironData.costPerWeight.length; j++) {
            let totalInventoryWeight = ironData.costPerWeight[j].weight;
            let totalNeededWeight = orderTickets[i].netWeightForProcessing;
            let differenceBetweenNeededAndInventory = totalInventoryWeight - totalNeededWeight;
            if (totalInventoryWeight > 0) {
                if (differenceBetweenNeededAndInventory >= 0) {
                    ironData.costPerWeight[j].weight = differenceBetweenNeededAndInventory

                    totalCostForTicket = ironData.costPerWeight[j].unitCostPerTon * parseFloat((totalNeededWeight / 1000))
                    profit = (orderTickets[i].unitPrice * parseFloat((totalNeededWeight / 1000))) - totalCostForTicket
                    orderTickets[i].profit += profit
                    orderTickets[i].netWeightForProcessing = 0;
                    orderTickets[i].totalCost += totalCostForTicket
                    orderTickets[i].usedUnitCostPerWeight.push({
                        weight: totalNeededWeight,
                        cost: ironData.costPerWeight[j].unitCostPerTon
                    })
                    break;
                }
                else {
                    ironData.costPerWeight[j].weight = 0
                    totalCostForTicket = (ironData.costPerWeight[j].unitCostPerTon * parseFloat((totalInventoryWeight / 1000)))
                    profit = (orderTickets[i].unitPrice * parseFloat((totalInventoryWeight / 1000))) - totalCostForTicket
                    orderTickets[i].totalCost += totalCostForTicket
                    orderTickets[i].profit += profit
                    orderTickets[i].netWeightForProcessing = orderTickets[i].netWeightForProcessing - totalInventoryWeight
                    orderTickets[i].usedUnitCostPerWeight.push({
                        weight: totalInventoryWeight,
                        cost: ironData.costPerWeight[j].unitCostPerTon
                    })
                }
            }
        }

        totalProfitForOrder += orderTickets[i].profit;
        await Iron.updateOne({
            $and: [
                { "name": orderTickets[i].ironName },
                { "radius": orderTickets[i].radius }
            ]
        }, {
            costPerWeight: ironData.costPerWeight
        })
    }

    let newUpdatedOrder = await Order.findOneAndUpdate({ _id: orderId }, { ticket: orderTickets, totalProfit: totalProfitForOrder }, { returnDocument: 'after' })

    res.json(newUpdatedOrder);

}

const ticketUpdateTransaction = async (req, res) => {
    const { paidAmount, bankName, clientId, orderId } = req.body;
    let newOrder, newTransaction;
    try {
        let newStatement = {
            paidAmount, bankName, clientId
        }
        newOrder = await Order.findOneAndUpdate({ "_id": orderId }, { $push: { statement: newStatement }, $inc: { totalPaid: paidAmount } }, { returnDocument: 'after' })
        newTransaction = await Wallet(
            {
                amount: paidAmount, bankName, clientId, orderId
            }
        )
        newTransaction.save()
    }
    catch (err) {
        console.log(err)
    }

    res.json(newOrder)

}

const TicketDelete = (req, res) => {
    let { id } = req.params
    let db = getDatabaseByName('Tickets');
    for (let i = 0; i < db.length; i++) {
        if (db[i].id === id) {
            db[i].state = 'deleted';
        }
    }
    updateDatabaseByName('Tickets', JSON.stringify(db));

    res.json({ "msg": "success" })

}

module.exports = {
    getUnfinishedOrdersInfoGroupedByClientId,
    getUnfinishedOrdersInfoGroupedByType,
    getTicketsInfo,
    addOrder,
    OrderFinishState,
    getSpecificTicket,
    getTicketsForDay,
    TicketDelete,
    EditOrderTicket,
    ticketUpdateTransaction
}