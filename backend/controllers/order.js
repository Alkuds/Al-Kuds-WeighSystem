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

function isSameDay(date1Str, date2Str) {
    const date1 = new Date(date1Str);
    const date2 = new Date(date2Str);
    console.log(date1,date2)
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
}

const getTicketsForDay = async(req, res) => {
    let orders,todayTickets = [];
    let { startDate } = req.body;
    try {
        orders = await Order.find()
        for(let i of orders){
            // console.log(i.date, startDate)
            if ((i.state === "منتهي" || i.state === "جاري انتظار الدفع") && isSameDay(i.date,startDate)) {
                todayTickets.push(i)
            }
        }
    }
    catch (err) {
        console.log(err)
    }
    res.json(todayTickets);
}

const getUnfinishedOrdersInfoGroupedByClientId = async (req, res) => {
    let orders;
    let ordersSorted = {}
    try {
        orders = await Order.find({ state: "جاري انتظار التحميل" })
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
        orders = await Order.find({ state: "جاري انتظار التحميل" })
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

const getNewOrdersInfoGroupedByType = async (req, res) => {
    let orders;
    let inOrders =[], outOrders = [];
    try {
        orders = await Order.find({ state: "جديد" })
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

const getAwaitForPaymentOrdersGroupedByType = async (req, res) => {
    let orders;
    let inOrders =[], outOrders = [];
    try {
        orders = await Order.find({ state: "جاري انتظار الدفع" })
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

const getFinishedOrdersInfoGroupedByType = async (req, res) => {
    let orders;
    let inOrders =[], outOrders = [];
    try {
        orders = await Order.find(
            {
               "state":"منتهي"
            }
        )
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


const getSpecificTicket = async(req, res) => {
    let { id } = req.params
    console.log(id)
    let order;
    try{
        order = await Order.findById(id);
    }
    catch(err){
        console.log(err)
    }
    res.json(order)
}

const EditOrderTicket = async (req, res) => {
    const { orderId, ticket } = req.body
    console.log(ticket)
    let newOrder;
    try {
        newOrder = await Order.findById(orderId)
        newOrder.ticket = ticket
        let orderUpdate = await Order.updateOne({ "_id": orderId }, newOrder);
        let inOrders =[], outOrders = [];
        let orders
        orders = await Order.find({ state: "progress" })
        for(let x of orders){
            if(x.type === 'in'){
                inOrders.push(x)
            }
            else{
                outOrders.push(x)
            }
        }
    
        res.json({orderUpdate,outOrders,inOrders})
    }
    catch (err) {
        console.log(err)
    }
}

const EditOrderFirstWeight = async (req, res) => {
    const { firstWeight, orderId } = req.body
    let newOrder;
    console.log(firstWeight, orderId)
    try {
        newOrder = await Order.findById(orderId)
        let d = new Date().toLocaleString("en-EG", { timeZone: "Africa/Cairo" });
        let dateArr = d.split(",");
        let firstWeightObject = {
            weight:firstWeight,
            date: dateArr[0] + "," + dateArr[1]
        }
        let orderUpdate = await Order.updateOne({ "_id": orderId }, {firstWeight: firstWeightObject});
        let inOrders =[], outOrders = [];
        let orders
        orders = await Order.find({ state: "جاري انتظار التحميل" })
        for(let x of orders){
            if(x.type === 'in'){
                inOrders.push(x)
            }
            else{
                outOrders.push(x)
            }
        }
    
        res.json({orderUpdate,outOrders,inOrders})
    }
    catch (err) {
        console.log(err)
    }
}

function isSameDay(date1Str, date2Str) {
    const date1 = new Date(date1Str);
    const date2 = new Date(date2Str);
  
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
}

const addOrder = async (req, res) => {
    const { ticket, type, clientId, driverId, carId, totalPrice, deliveryFees, date } = req.body
    let newOrder;
    try {
        newOrder = new Order(
            {
                "state": isSameDay(date,new Date())? "جاري انتظار التحميل" : "جديد", type, clientId, driverId, carId, ticket, totalPrice, deliveryFees, date
            }
        )

        newOrder.save().then(async (data) => {
            await Client.updateOne({ clientId },
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
    const { id } = req.params;
    let orders;
    try {
        orders = await Order.find({ "clientId": id })
    }
    catch (err) {
        console.log(err)
    }
    console.log(orders)
    res.json(orders)

}

const OrderFinishState = async (req, res) => { 
    const { orderId } = req.body;
    let updatedOrder,client, newUpdatedOrder
    try {
        updatedOrder = await Order.findById({ _id: orderId })
        client = await Client.findOne({"clientId":updatedOrder.clientId})
    }
    catch (err) {
        console.log(err)
    }
    let totalProfitForOrder = 0, totalPrice = 0;
    const orderTickets = updatedOrder.ticket
    if(updatedOrder.type === "out"){
        for (let i = 0; i < orderTickets.length; i++) {
            let totalTicketPrice = parseFloat((orderTickets[i].netWeight / 1000)) * orderTickets[i].unitPrice 
            orderTickets[i].realTotalPrice = totalTicketPrice
            totalPrice += totalTicketPrice
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
                            cost: ironData.costPerWeight[j].unitCostPerTon,
                            ironId: ironData.costPerWeight[j]._id
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
        console.log(client.balance, totalPrice)
        if(client.balance<0 && client.balance + totalPrice <=0){

            newUpdatedOrder = await Order.findOneAndUpdate({ _id: orderId }, { ticket: orderTickets, totalProfit: totalProfitForOrder, realTotalPrice : totalPrice , state : "منتهي" , totalPaid : totalPrice}, { returnDocument: 'after' })
        }
        else if (client.balance<0 && client.balance + totalPrice > 0){
            newUpdatedOrder = await Order.findOneAndUpdate({ _id: orderId }, { ticket: orderTickets, totalProfit: totalProfitForOrder, realTotalPrice : totalPrice , state : "جاري انتظار الدفع" , totalPaid: Math.abs(Math.abs(client.balance)-totalPrice)}, { returnDocument: 'after' })
        }
        else if(client.balance>=0){
            newUpdatedOrder = await Order.findOneAndUpdate({ _id: orderId }, { ticket: orderTickets, totalProfit: totalProfitForOrder, realTotalPrice : totalPrice , state : "جاري انتظار الدفع" }, { returnDocument: 'after' })

        }

        let balanceUpdate = await Client.findOneAndUpdate({clientId:updatedOrder.clientId}, {$inc: { balance: totalPrice }})

    }
    else{
        console.log("heereee")
        let realTotalPrice = 0, ironId = "";
        for (let i = 0; i < orderTickets.length; i++) {
            await Iron.findOneAndUpdate(
                {
                    $and: [
                        { "name": orderTickets[i].ironName },
                        { "radius": orderTickets[i].radius }
                    ]
                }, 
                {
                    $push : 
                    {
                        costPerWeight: {
                            unitCostPerTon : orderTickets[i].unitPrice,
                            weight : orderTickets[i].netWeight,
                        }
                    }
                },
                { upsert: true ,returnDocument: 'after',}
            ).then(res=>{
                ironId = res["costPerWeight"][res["costPerWeight"].length-1]._id.toString()
            })
            orderTickets[i].usedUnitCostPerWeight.push({
                weight: orderTickets[i].netWeight,
                cost: orderTickets[i].unitPrice,
                ironId
            })
            orderTickets[i].realTotalPrice = orderTickets[i].unitPrice * parseFloat((orderTickets[i].netWeight / 1000))
            realTotalPrice += orderTickets[i].realTotalPrice
        }

        if(client.balance<0){
            newUpdatedOrder = await Order.findOneAndUpdate({ _id: orderId }, { ticket: orderTickets, realTotalPrice, state : "جاري انتظار الدفع"}, { returnDocument: 'after' })
        }
        else if (client.balance>0 && client.balance + (-realTotalPrice) <0 ){
            newUpdatedOrder = await Order.findOneAndUpdate({ _id: orderId }, { ticket: orderTickets, realTotalPrice, state : "جاري انتظار الدفع" , totalPaid : Math.abs(client.balance-realTotalPrice)}, { returnDocument: 'after' })
        }
        else if(client.balance>0 && client.balance + (-realTotalPrice) >=0 ){
            newUpdatedOrder = await Order.findOneAndUpdate({ _id: orderId }, { ticket: orderTickets, realTotalPrice, state : "منتهي" , totalPaid : realTotalPrice}, { returnDocument: 'after' })
        }       
        let balanceUpdate = await Client.findOneAndUpdate({clientId:updatedOrder.clientId}, {$inc: { balance: -realTotalPrice }})
        
    }

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
        newTransaction = await Wallet.findOneAndUpdate(
            {
                bankName
            },
            {
                $psuh : { transactions:{ amount: paidAmount, clientId, type, orderId}}
            }
        )
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

const addOrderStatement = async(req,res) =>{
    const { orderId, bankName, amount, type } = req.body
    console.log(orderId, bankName, amount, type)
    let statement, order, walletTransaction, walletId;
    try{
        let order = await Order.findById(orderId);
        walletTransaction = await Wallet.findOneAndUpdate(
            {
                bankName
            },
            {
                $push : { transactions:{ amount: parseFloat(amount), clientId : order.clientId, type, orderId}}
            },
            {
                returnDocument:'after' 
            }
        )
        console.log(walletTransaction)
        order.statement.push(
            {
                "paidAmount":amount,
                "clientId": order.clientId,
                "bankName" : bankName,
                "date": new Date().toLocaleString('en-EG', { timeZone: 'Africa/Cairo' }),
                "walletTransactionId" : walletTransaction.transactions[walletTransaction.transactions.length-1].orderId
            }
        )
        
        if(order.realTotalPrice <= amount+ order.totalPaid){
            statement = await Order.findOneAndUpdate({_id:order._id},{statement:order.statement, state:"منتهي", totalPaid:order.realTotalPrice},{ returnDocument: 'after' } )
        }
        else if(order.realTotalPrice > amount+ order.totalPaid){
            statement = await Order.findOneAndUpdate({_id:order._id},{statement:order.statement, $inc: { totalPaid: amount }},{ returnDocument: 'after' } )
        }
        let client = await Client.findOneAndUpdate({clientId: order.clientId}, {$inc: { balance: -amount }})
    }
    catch(err){
        console.log(err)
    }

    res.json(statement)
}


const OrderIronPriceUpdate = async(req,res)=>{
    const { order } = req.body;
    let newPriceUpdate;
    try{
        newPriceUpdate = await Order.findByIdAndUpdate({_id:order._id},{order},{returnDocument:"after"})
    }
    catch(err){
        console.log(err)
    }
    res.json(newPriceUpdate)
}

const orderChangeState = async(req,res)=>{
    const { _id } = req.body
    let newUpdate;
    try{
        newUpdate = await Order.findByIdAndUpdate({_id},{state:"جاري انتظار التحميل"})
    }
    catch(err){
        console.log(err)
    }
    res.json(newUpdate)
}




module.exports = {
    getUnfinishedOrdersInfoGroupedByClientId,
    getUnfinishedOrdersInfoGroupedByType,
    getNewOrdersInfoGroupedByType,
    getTicketsInfo,
    addOrder,
    OrderFinishState,
    getSpecificTicket,
    getTicketsForDay,
    TicketDelete,
    EditOrderTicket,
    ticketUpdateTransaction,
    EditOrderFirstWeight,
    getFinishedOrdersInfoGroupedByType,
    getAwaitForPaymentOrdersGroupedByType,
    getClientOrders,
    addOrderStatement,
    OrderIronPriceUpdate,
    orderChangeState
}