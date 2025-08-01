const Wallet = require('../models/wallet')
const Order = require('../models/order')
const Client = require('../models/client')

const addTransaction = async (req, res) => {
    let {amount, bankName, clientId, orderId, type, notes} = req.body
    let newTransaction = null, transactionObj = {
        amount,bankName,clientId, orderId, type, notes
    } , orders, isDivided = [],amountProcessing = amount, statement, clientUpdate = null, updatedOrders=[];
    notes = notes || " "
    try{
        if(type === "استلام من"){
            orders = await Order.find(
                {
                    $and: [
                        { clientId },
                        { "state": "جاري انتظار الدفع" },
                        {type : "out"}
                    ] 
                }   
            ).sort({ date: 1 });
            newTransaction = await Wallet.findOneAndUpdate(
                {
                    bankName
                },
                {
                    $push: {
                        'transactions': {
                            "notes":   notes,
                            bankName,
                            "amount":amount,
                            "clientId": clientId,
                            "date": new Date().toLocaleString('en-EG', { timeZone: 'Africa/Cairo' }),
                            "sign":"+"
                        }
                    },
                    $inc: { totalAmount: amount } 
                },
                {
                    returnDocument: 'after'
                }
            )
            console.log('orders.length',orders.length)
            for(let i of orders){
                let RemainingPrice = i.realTotalPrice - i.totalPaid
                console.log("RemainingPrice",RemainingPrice, "amountProcessing",amountProcessing)
                if(amountProcessing == 0) break;
                if(amountProcessing > 0 && RemainingPrice > 0){
                    let amountToPay;
                    if(RemainingPrice > amountProcessing){
                        amountToPay = amountProcessing
                        RemainingPrice -= amountProcessing
                        amountProcessing = 0;
                    }
                    else{
                        amountToPay = RemainingPrice
                        amountProcessing = amountProcessing - RemainingPrice
                        RemainingPrice = 0
                    }
                    console.log("RemainingPrice",RemainingPrice, "amountToPay",amountToPay)
                    statement = await Order.findOneAndUpdate(   
                        {
                            _id:i._id
                        },
                        {
                            $push: {
                                'statement': 
                                    {
                                        "paidAmount":amountToPay,
                                        "clientId": clientId,
                                        "bankName" : bankName,
                                        "date": new Date().toLocaleString('en-EG', { timeZone: 'Africa/Cairo' }),
                                        "walletTransactionId" : newTransaction.transactions[newTransaction.transactions.length-1]._id.toString()
                                    }
                            },
                            $inc: {
                                totalPaid: amountToPay
                            },
                            state: ((i.realTotalPrice - i.totalPaid - amountToPay) === 0)? "منتهي" : i.state
                        },
                        { 
                            returnDocument: 'after' 
                        } 
                    )
                } 
            }
            clientUpdate = await Client.findOneAndUpdate({clientId},
                {
                    $inc: {
                        balance: -amount
                    },
                    $push: {
                        'transactionsHistory': { amount:amount, type }
                    },
                },
                { 
                    returnDocument: 'after' 
                } 
            )
        }
        else if(type==="تحويل الي"){
            console.log("here inside in",clientId)
            orders = await Order.find(
                {
                    $and: [
                        { clientId },
                        { "state": "جاري انتظار الدفع" },
                        {type : "in"}
                    ] 
                }   
            ).sort({ date: 1 });
            console.log(orders)
            newTransaction = await Wallet.findOneAndUpdate(
                {
                    bankName
                },
                {
                    $push: {
                        'transactions': {
                            "notes":   notes,
                            bankName,
                            "amount":amount,
                            "clientId": clientId,
                            "date": new Date().toLocaleString('en-EG', { timeZone: 'Africa/Cairo' }),
                            "sign":"-"
                        }
                    },
                    $inc: { totalAmount: -amount } 
                },
                {
                    returnDocument: 'after'
                }
            )
            for(let i of orders){
                let RemainingPrice = i.realTotalPrice - i.totalPaid
                console.log("RemainingPrice",RemainingPrice)
                if(amountProcessing == 0) break;
                if(amountProcessing > 0 && RemainingPrice > 0){
                    let amountToPay;
                    if(RemainingPrice > amountProcessing){
                        amountToPay = amountProcessing
                        RemainingPrice -= amountProcessing
                        amountProcessing = 0;
                    }
                    else{
                        amountToPay = RemainingPrice
                        amountProcessing = amountProcessing - RemainingPrice
                        RemainingPrice = 0
                    }
                    statement = await Order.findOneAndUpdate(   
                        {
                            _id:i._id
                        },
                        {
                            $push: {
                                'statement': 
                                    {
                                        "paidAmount":amountToPay,
                                        "clientId": clientId,
                                        "bankName" : bankName,
                                        "date": new Date().toLocaleString('en-EG', { timeZone: 'Africa/Cairo' }),
                                        "walletTransactionId" : newTransaction.transactions[newTransaction.transactions.length-1]._id.toString()
                                    }
                            },
                            $inc: {
                                totalPaid: amountToPay
                            },
                            state: ((i.realTotalPrice - i.totalPaid - amountToPay) === 0)? "منتهي" : i.state
                        },
                        { 
                            returnDocument: 'after' 
                        } 
                    )
                } 
            }
            clientUpdate = await Client.findOneAndUpdate({clientId},
                {
                    $inc: {
                        balance: amount
                    },
                    $push: {
                        'transactionsHistory': { amount:amount, type }
                    },
                },
                { 
                    returnDocument: 'after' 
                } 
            )
        }
        else if(type ==="اكراميه"){
            clientUpdate = await Client.findOneAndUpdate({clientId},
                {
                    $inc: {
                        balance: amount
                    },
                    $push: {
                        'transactionsHistory': { amount, type, notes }
                    },
                },
                { 
                    returnDocument: 'after' 
                } 
            )
            // newTransaction = await Wallet.findOneAndUpdate(
            //     {
            //         bankName:'اكراميات'
            //     },
            //     {
            //         $push: {
            //             'transactions': {
            //                 'notes':"اكراميه - "+notes,
            //                 "amount":amount,
            //                 "clientId": clientId,
            //                 "date": new Date().toLocaleString('en-EG', { timeZone: 'Africa/Cairo' })
            //             }
            //         },
            //         $inc: { totalAmount: amount } 
            //     },
            //     {
            //         returnDocument: 'after'
            //     }
            // )

            newTransaction = await Wallet.findOneAndUpdate(
                {
                    bankName:'نقدي'
                },
                {
                    $push: {
                        'transactions': {
                            "notes": notes,
                            bankName,
                            "amount":amount,
                            "clientId": clientId,
                            "date": new Date().toLocaleString('en-EG', { timeZone: 'Africa/Cairo' }),
                            "sign":"-"
                        }
                    },
                    $inc: { totalAmount: amount } 
                },
                {
                    returnDocument: 'after'
                }
            )

        }
        else if(type ==="خصم"){
            clientUpdate = await Client.findOneAndUpdate({clientId},
                {
                    $inc: {
                        balance: -amount
                    },
                    $push: {
                        'transactionsHistory': { amount, type, notes }
                    },
                },
                { 
                    returnDocument: 'after' 
                } 
            )
            newTransaction = await Wallet.findOneAndUpdate(
                {
                    bankName:'خصومات'
                },
                {
                    $push: {
                        'transactions': {
                            'notes': notes,
                            "bankName":"خصم",
                            "amount":amount,
                            "clientId": clientId,
                            "date": new Date().toLocaleString('en-EG', { timeZone: 'Africa/Cairo' })
                        }
                    },
                    $inc: { totalAmount: amount } 
                },
                {
                    returnDocument: 'after'
                }
            )
        }
        else if(type ==="صرف شيك"){
            newTransaction = await Wallet.findOneAndUpdate(
                {
                    bankName,
                    transactions: {
                        $elemMatch: { amount , clientId}
                      }
                },
                {
                    $push: {
                        'transactions': {
                            notes,
                            bankName,
                            "amount":-amount,
                            "clientId": clientId,
                            "date": new Date().toLocaleString('en-EG', { timeZone: 'Africa/Cairo' })
                        }
                    },
                    $inc: { totalAmount: -amount } 
                },
                {
                    returnDocument: 'after'
                }
            )
            if(newTransaction != null)
                clientUpdate = await Client.findOneAndUpdate({clientId},
                    {
                        $inc: {
                            balance: -amount
                        },
                        $push: {
                            'transactionsHistory': { amount, type }
                        },
                    },
                    { 
                        returnDocument: 'after' 
                    } 
                )
            else{

            }
        }
        updatedOrders = await Order.find({clientId})

    }
    catch(err){
        console.log(err)
    }

    let returnedObj = {
        bank: newTransaction,
        orders: updatedOrders,
        client: clientUpdate
    }
    res.json(returnedObj)
}

const addChequeTransaction = async(req,res) =>{
    let {amount, bankName, clientId, orderId, type, notes, chequeId} = req.body
    let newTransaction = null, transactionObj = {
        amount,bankName,clientId, orderId, type, notes
    } , orders, isDivided = [],amountProcessing = amount, statement, clientUpdate = null, updatedOrders=[];
    notes = notes || " "
    console.log("heeereee")
    console.log(amount, bankName, clientId, orderId, type, notes, chequeId)
    try{
        if(type === "استلام من"){
            orders = await Order.find(
                {
                    $and: [
                        { clientId },
                        { "state": "جاري انتظار الدفع" },
                        {type : "out"}
                    ] 
                }   
            ).sort({ date: 1 });
            newTransaction = await Wallet.findOneAndUpdate(
                {
                    "bankName":'شيكات'
                },
                {
                    $push: {
                        'transactions': {
                            "notes":   notes,
                            "bankName": "شيكات",
                            "amount":amount,
                            "clientId": clientId,
                            "date": new Date().toLocaleString('en-EG', { timeZone: 'Africa/Cairo' }),
                            "sign":"+"
                        }
                    },
                    $inc: { totalAmount: amount } 
                },
                {
                    returnDocument: 'after'
                }
            )
            console.log('orders.length',orders.length)
            for(let i of orders){
                let RemainingPrice = i.realTotalPrice - i.totalPaid
                console.log("RemainingPrice",RemainingPrice, "amountProcessing",amountProcessing)
                if(amountProcessing == 0) break;
                if(amountProcessing > 0 && RemainingPrice > 0){
                    let amountToPay;
                    if(RemainingPrice > amountProcessing){
                        amountToPay = amountProcessing
                        RemainingPrice -= amountProcessing
                        amountProcessing = 0;
                    }
                    else{
                        amountToPay = RemainingPrice
                        amountProcessing = amountProcessing - RemainingPrice
                        RemainingPrice = 0
                    }
                    console.log("RemainingPrice",RemainingPrice, "amountToPay",amountToPay)
                    statement = await Order.findOneAndUpdate(   
                        {
                            _id:i._id
                        },
                        {
                            $push: {
                                'statement': 
                                    {
                                        "paidAmount":amountToPay,
                                        "clientId": clientId,
                                        "bankName" : bankName,
                                        "date": new Date().toLocaleString('en-EG', { timeZone: 'Africa/Cairo' }),
                                        "walletTransactionId" : newTransaction.transactions[newTransaction.transactions.length-1]._id.toString()
                                    }
                            },
                            $inc: {
                                totalPaid: amountToPay
                            },
                            state: ((i.realTotalPrice - i.totalPaid - amountToPay) === 0)? "منتهي" : i.state
                        },
                        { 
                            returnDocument: 'after' 
                        } 
                    )
                } 
            }
            clientUpdate = await Client.findOneAndUpdate({clientId},
                {
                    $inc: {
                        balance: -amount
                    },
                    $push: {
                        'transactionsHistory': { amount:amount, type }
                    },
                },
                { 
                    returnDocument: 'after' 
                } 
            )
        }
        else if(type==="تحويل الي"){
            console.log("here inside in",clientId)
            orders = await Order.find(
                {
                    $and: [
                        { clientId },
                        { "state": "جاري انتظار الدفع" },
                        {type : "in"}
                    ] 
                }   
            ).sort({ date: 1 });
            newTransaction = await Wallet.findOneAndUpdate(
                {
                    "transactions._id":chequeId
                },
                {
                    $set: {
                        "transactions.$.isDisbursed": true,
                        "transactions.$.disbursementDate": new Date().toLocaleString('en-EG', { timeZone: 'Africa/Cairo' }),
                    },
                    $inc: { totalAmount: -amount } 
                },
                {
                    returnDocument: 'after'
                }
            )
            // newTransaction = await Wallet.findOneAndUpdate(
            //     {
            //         bankName
            //     },
            //     {
            //         $push: {
            //             'transactions': {
            //                 "notes":   bankName + " - " + notes,
            //                 "amount":amount,
            //                 "clientId": clientId,
            //                 "date": new Date().toLocaleString('en-EG', { timeZone: 'Africa/Cairo' }),
            //                 "sign":"-"
            //             }
            //         },
            //         $inc: { totalAmount: -amount } 
            //     },
            //     {
            //         returnDocument: 'after'
            //     }
            // )
            for(let i of orders){
                let RemainingPrice = i.realTotalPrice - i.totalPaid
                console.log("RemainingPrice",RemainingPrice)
                if(amountProcessing == 0) break;
                if(amountProcessing > 0 && RemainingPrice > 0){
                    let amountToPay;
                    if(RemainingPrice > amountProcessing){
                        amountToPay = amountProcessing
                        RemainingPrice -= amountProcessing
                        amountProcessing = 0;
                    }
                    else{
                        amountToPay = RemainingPrice
                        amountProcessing = amountProcessing - RemainingPrice
                        RemainingPrice = 0
                    }
                    statement = await Order.findOneAndUpdate(   
                        {
                            _id:i._id
                        },
                        {
                            $push: {
                                'statement': 
                                    {
                                        "paidAmount":amountToPay,
                                        "clientId": clientId,
                                        "bankName" : bankName,
                                        "date": new Date().toLocaleString('en-EG', { timeZone: 'Africa/Cairo' }),
                                        "walletTransactionId" : newTransaction.transactions[newTransaction.transactions.length-1]._id.toString()
                                    }
                            },
                            $inc: {
                                totalPaid: amountToPay
                            },
                            state: ((i.realTotalPrice - i.totalPaid - amountToPay) === 0)? "منتهي" : i.state
                        },
                        { 
                            returnDocument: 'after' 
                        } 
                    )
                } 
            }
            clientUpdate = await Client.findOneAndUpdate({clientId},
                {
                    $inc: {
                        balance: amount
                    },
                    $push: {
                        'transactionsHistory': { amount:amount, type }
                    },
                },
                { 
                    returnDocument: 'after' 
                } 
            )
        }
        else if(type ==="صرف شيك"){
            newTransaction = await Wallet.findOneAndUpdate(
                {
                    'bankName':'شيكات',
                    "transactions._id": chequeId
                },
                {
                    $set: {
                        "transactions.$.isDisbursed": true,
                        "transactions.$.disbursementDate": new Date().toLocaleString('en-EG', { timeZone: 'Africa/Cairo' }),
                    },
                    $inc: { totalAmount: -amount } 
                },
                {
                    returnDocument: 'after'
                }
            )
            let cId = newTransaction.transactions.filter(tx=>tx._id.toString()===chequeId)
            console.log("cId: ",cId)
            newTransaction = await Wallet.findOneAndUpdate(
                {
                    bankName
                },
                {
                    $push: {
                        'transactions': {
                            notes,
                            bankName,
                            "amount":amount,
                            "clientId": cId[0].clientId,
                            "date": new Date().toLocaleString('en-EG', { timeZone: 'Africa/Cairo' })
                        }
                    },
                    $inc: { totalAmount: amount } 
                },
                {
                    returnDocument: 'after'
                }
            )
        }
        updatedOrders = await Order.find({clientId})

    }
    catch(err){
        console.log(err)
    }

    let returnedObj = {
        bank: newTransaction,
        orders: updatedOrders,
        client: clientUpdate
    }
    res.json(returnedObj)
}

let isInCurrentMonth = (dateString) => {
    const inputDate = new Date(dateString);
    const now = new Date();

    return (
        inputDate.getFullYear() === now.getFullYear() &&
        inputDate.getMonth() === now.getMonth()
    );
}

const getOldClientBalance = async(req,res)=>{
    let { clientId } = req.body
    let client, previousBalance = 0
    try{
        client = await Client.findOne({clientId})
        previousBalance = client.balance
        for(let i of client.transactionsHistory){
            if(isInCurrentMonth(i.date))
            if(i.type === "out"){
                previousBalance+= (-i.amount)
            }
            else{
                previousBalance+= (i.amount)
            }
        }
    }
    catch(err){
        console.log(err)
    }
    res.json(previousBalance.toLocaleString())
}

const addCompanyExpenses = async(req,res)=>{
    const {amount, bankName, clientId, notes, type} = req.body
    let clientUpdate, newTransaction = null;
    try{
        if(type === "استلام من"){
            clientUpdate = await Client.findOneAndUpdate({ clientId },
                {
                    $inc: {
                        balance: -amount 
                    },
                    $push: {
                        purchasingNotes: {
                            type,
                            amount,
                            notes
                        }
                    }
                },
                { 
                    returnDocument: 'after' 
                } 
            )
            if(bankName !== "اختر البنك"){
                newTransaction = await Wallet.findOneAndUpdate(
                    {
                        bankName
                    },
                    {
                        $push: {
                            'transactions': { 
                                amount, 
                                "notes" :  notes,
                                bankName,
                                clientId,
                                type,
                                "sign":"+"
                            }
                        },
                        $inc: { totalAmount: amount } 
                    },
                    {
                        returnDocument: 'after'
                    }
                )
            }
        }
        else if(type === "تحويل الي"){
            clientUpdate = await Client.findOneAndUpdate({ clientId },
                {
                    $inc: {
                        balance: amount 
                    },
                    $push: {
                        purchasingNotes: {
                            type,
                            amount,
                            notes
                        }
                    }
                },
                { 
                    returnDocument: 'after' 
                } 
            )
            if(bankName !== "اختر البنك"){
                newTransaction = await Wallet.findOneAndUpdate(
                    {
                        bankName
                    },
                    {
                        $push: {
                            'transactions': { 
                                amount, 
                                'notes' : notes,
                                bankName,
                                clientId,
                                type,
                                "sign":"-"
                            }
                        },
                        $inc: { totalAmount: -amount } 
                    },
                    {
                        returnDocument: 'after'
                    }
                )
            }
        }
    }
    catch(err){
        console.log(err)
    }
    let returnedObj = {
        bank: newTransaction,
        client: clientUpdate
    }
    res.json(returnedObj)
}

const addBank = async(req,res) =>{
    let { bankName, totalAmount } = req.body;
    let newBank;
    try{
        newBank =  new Wallet(
            {
                totalAmount,
                bankName,
                transactions:[]
            }
        )
        await newBank.save().then(data =>{
            res.json(data)
        })
    }
    catch(err){
        console.log(err)
    }
   
}


const resetTime = (date) => {
    date.setHours(0, 0, 0, 0);
    return date;
}

function isDateBefore(firstDateStr, secondDateStr) {
    const firstDate = resetTime(new Date(firstDateStr));
    const secondDate = resetTime(new Date(secondDateStr));
  
    return firstDate <= secondDate;
}

function createData(id, bankName, amount, date) {
    return { id, bankName, amount, date,  };
}


const getSpecificClientTransactions = async (req,res) =>{
    const { clientId, date  } = req.body
    let wallets, transactions = []
    try{
        wallets = await Wallet.find()
        for(let i of wallets){
            for(let j of i.transactions){
                if(isDateBefore(j.date,date) && j.clientId === clientId){
                    transactions.push(createData(j._id, i.bankName, j.amount, j.date))
                }
            }
        }
    }
    catch(err){
        console.log(err)
    }
    console.log(transactions)
    res.json(transactions)
}

const getTransactionsGroupedByBank = async(req,res) =>{
    let wallets, walletsObj = {}
    try{
        wallets = await Wallet.find();
        for(let i of wallets){
            walletsObj[i.bankName] = i
        }
    }
    catch(err){
        console.log(err)
    }
    res.json(walletsObj)
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

const getWalletInventoryByDate = async(req,res)=>{
    let { startDate } = req.body, wallet, transactions = [];
    try{
        wallet = await Wallet.find()
        for(let i of wallet){
            for(let j of i.transactions){
                // console.log(isDatesEqual(startDate,j.date))
                if (isSameDay(startDate,j.date)){
                    transactions.push(j)
                }
            }
        }
        transactions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }
    catch(err){
        console.log(err)
    }
    res.json(transactions)
}

const resetAllBanks = async(req,res) =>{
    let result 
    try{
        result = await Wallet.updateMany({}, { totalAmount:0, "$set":{transactions : []} })
    }
    catch(err){
        console.log(err)
    }
    return result
}

const getCurrentCheques = async(req,res) =>{
    let result, transactions
    try{
        result = await Wallet.findOne({"bankName":"شيكات"})
        transactions = result.transactions.filter(tx=> tx.isDisbursed == false)
        result.transactions = transactions
    }
    catch(err){
        console.log(err)
    }
    res.json([result])
}

module.exports = {
    addTransaction,
    getSpecificClientTransactions,
    getTransactionsGroupedByBank,
    addBank,
    addCompanyExpenses,
    getWalletInventoryByDate,
    getOldClientBalance,
    addChequeTransaction,
    resetAllBanks,
    getCurrentCheques
}