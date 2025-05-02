const { updateDatabaseByName, getDatabaseByName } = require("./databaseController")
const Iron = require('../models/iron')
const Order = require('../models/order')

const addIron = async (req, res) => {
    const { name, weight, radius, cost } = req.body
    let newIron;
    try {
        newIron = await Iron.find(
            {
                $and: [
                    { "name": name },
                    { "radius": radius }
                ]
            }
        )
        if (newIron.length > 0) {
            let newCostPerWeightEntry = {
                unitCostPerTon: cost, weight
            }
            let newObject = newIron[0]
            newObject.costPerWeight.push(newCostPerWeightEntry)
            console.log(newObject)
            newIron = await Iron.findOneAndUpdate({ "_id": newObject._id.toString() }, { $push: {"costPerWeight":newCostPerWeightEntry} } , { returnDocument: 'after' })
        }
        else {
            newIron = new Iron(
                {
                    name,
                    radius,
                    costPerWeight: [
                        {
                            unitCostPerTon: cost,
                            weight
                        }
                    ]
                }
            )
            newIron.save()
        }
    }
    catch (err) {
        console.log(err)
    }

    res.json(newIron)
}

const addIronWeight = (req, res) => {

}

const subtractIronWeight = (req, res) => {

}

function isBeforeToday(dateString) {
    const givenDate = new Date(dateString);
    const today = new Date();
  
    // Remove time from both dates (set to midnight)
    givenDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
  
    return givenDate < today;
}

const getIronStorageOwner = async(req, res) => {
    let { startDate } = req.body
    console.log(startDate)
    let ironList, ironMap = {};
    try {
        ironList = await Iron.find()
        for(let i of ironList){
            totalWeight = 0
            for(j of i["costPerWeight"]){
                totalWeight += j["weight"]
            }
            if(i.name in ironMap){
                ironMap[i.name].push({"radius":i["radius"],"weight":totalWeight})
            }
            else{
                ironMap[i.name] = [
                    {"radius":i["radius"],"weight":totalWeight}
                ]
            }
        }
        Object.keys(ironMap).forEach(key => {
            ironMap[key].sort((a, b) => Number(a.radius) - Number(b.radius));
        });
        let ironArray = Object.entries(ironMap).map(([key, value]) => ({ [key]: value }));
        const orders = await Order.find({
            state: { $in: ["جاري انتظار الدفع", "منتهي"] }
        });
        const wantedDate = new Date(startDate);
        for(let order of orders){
            let orderDate = new Date(order.date)
            if(wantedDate>=orderDate && isBeforeToday(wantedDate)){
                for(let ticket of order.ticket){
                    for(let k = 0 ; k<ironArray.length ; k++){
                        if(ticket.ironName in ironArray[k]){
                            for(let l = 0 ; l<ironArray[k][ticket.ironName].length ; l ++){
                                if(ironArray[k][ticket.ironName][l]["radius"] == ticket.radius  ){
                                    if(ticket.ironName === "عز" && ticket.radius == '10'){
                                        console.log(ticket.ironName)
                                        console.log(ironArray[k][ticket.ironName][l]["radius"])
                                        console.log(ticket.netWeight)
                                        console.log(order.type)
                                    }    
                                    if(order.type === "out"){
                                        ironArray[k][ticket.ironName][l]["weight"] += ticket.netWeight
                                    }
                                    else{
                                        ironArray[k][ticket.ironName][l]["weight"] -= ticket.netWeight
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        res.json(ironArray)
    }
    catch(err){
        console.log(err)
    }
}

function sortRadiusKeys(data) {
    const sortedData = {};
  
    for (const brand in data) {
      const items = data[brand];
  
      if (Array.isArray(items) && items.length > 0) {
        const sortedItems = items
          .map(obj => {
            const key = Object.keys(obj)[0];
            return { key: parseInt(key), original: obj };
          })
          .sort((a, b) => a.key - b.key)
          .map(item => item.original);
  
        sortedData[brand] = sortedItems;
      } else {
        sortedData[brand] = items;
      }
    }
  
    return sortedData;
  }
  

const getIronStorageAdmin = async(req, res) => {
    let { startDate } = req.body
    console.log(startDate)
    let ironList, ironMap = {};
    try {
        ironList = await Iron.find()
        for(let i of ironList){
            if(!(i.name in ironMap)){
                ironMap[i.name] = {}
            }
            for(let j of i["costPerWeight"]){
                if(j["weight"]>0){
                    if(i["radius"] in ironMap[i.name]){
                        let obj = {}
                        obj= {"weight":j["weight"],"unitCost":j["unitCostPerTon"],"id": j["_id"]}
                        ironMap[i.name][`${i["radius"]}`].push(obj)
                      
                    } 
                    else{
                        ironMap[i.name][`${i["radius"]}`] =[{"weight":j["weight"],"unitCost":j["unitCostPerTon"],"id": j["_id"]}]
                    }
                }
            }
        }
        const orders = await Order.find({
            state: { $in: ["جاري انتظار الدفع", "منتهي"] }
        });
        const wantedDate = new Date(startDate);
        for(let order of orders){
            let orderDate = new Date(order.date)
            if(wantedDate>=orderDate && isBeforeToday(wantedDate)){
                for(let ticket of order.ticket){
                    for(let consumedUnitPerWeight of ticket.usedUnitCostPerWeight){
                        let hasTheConsumedIron = false
                        for(let k = 0 ; k<ironArray[ticket.ironName][ticket.radius].length ; k++){
                            if( consumedUnitPerWeight.orderId === ironArray[ticket.ironName][ticket.radius][k]._id){
                                hasTheConsumedIron = true    
                                if(order.type === "out"){
                                    ironArray[ticket.ironName][ticket.radius][k] += consumedUnitPerWeight.weight
                                }
                                else{
                                    ironArray[ticket.ironName][ticket.radius][k] -= consumedUnitPerWeight.weight
                                }
                            }                            
                        }
                        if(!hasTheConsumedIron){
                            ironArray[ticket.ironName][ticket.radius].push({"weight":consumedUnitPerWeight.weight,"unitCostPerTon":consumedUnitPerWeight.cost})
                        }
                    }
                }
            }
        }
        let ironStorage = [], total = 0
        for (const ironName in ironMap) {
            const radii = ironMap[ironName];
            for (const radius in radii) {
              const items = radii[radius];
              for (const item of items) {
                total+=item.weight
                let rowitem = {
                  name: ironName,
                  weight: item.weight,
                  radius: radius,
                };
                ironStorage.push(rowitem);
              }
            }
          }
        res.json({ironStorage,total})
    }
    catch(err){
        console.log(err)
    }
}

const getIronStorage = async(req, res) => {
    let { startDate } = req.body
    console.log(startDate)
    let ironList, ironMap = {};
    try {
        ironList = await Iron.find()
        for(let i of ironList){
            totalWeight = 0
            for(j of i["costPerWeight"]){
                totalWeight += j["weight"]
            }
            if(i.name in ironMap){
                ironMap[i.name].push({"radius":i["radius"],"weight":totalWeight})
            }
            else{
                ironMap[i.name] = [
                    {"radius":i["radius"],"weight":totalWeight}
                ]
            }
        }
        Object.keys(ironMap).forEach(key => {
            ironMap[key].sort((a, b) => Number(a.radius) - Number(b.radius));
        });
        let ironArray = Object.entries(ironMap).map(([key, value]) => ({ [key]: value }));
        const orders = await Order.find({
            state: { $in: ["جاري انتظار الدفع", "منتهي"] }
        });
        const wantedDate = new Date(startDate);
        for(let order of orders){
            let orderDate = new Date(order.date)
            if(wantedDate>=orderDate && isBeforeToday(wantedDate)){
                for(let ticket of order.ticket){
                    for(let k = 0 ; k<ironArray.length ; k++){
                        if(ticket.ironName in ironArray[k]){
                            for(let l = 0 ; l<ironArray[k][ticket.ironName].length ; l ++){
                                if(ironArray[k][ticket.ironName][l]["radius"] == ticket.radius  ){
                                    if(ticket.ironName === "عز" && ticket.radius == '10'){
                                        console.log(ticket.ironName)
                                        console.log(ironArray[k][ticket.ironName][l]["radius"])
                                        console.log(ticket.netWeight)
                                        console.log(order.type)
                                    }    
                                    if(order.type === "out"){
                                        ironArray[k][ticket.ironName][l]["weight"] += ticket.netWeight
                                    }
                                    else{
                                        ironArray[k][ticket.ironName][l]["weight"] -= ticket.netWeight
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        res.json(ironArray)
    }
    catch(err){
        console.log(err)
    }
}

let x = 1000;
const getScaleWeight = (req, res) => {
    res.json({ "weight": x })
    // x+= 1000

    // driver name






    // let requestBody = req.body;
    // let data = getDatabaseByName('Tickets');
    // data.push(requestBody);
    // updateDatabaseByName('Tickets', JSON.stringify(data));
    // let iron = getDatabaseByName('IronStorage');
    // let todayDate = requestBody.date;
    // requestBody.reciept.map((el) => {
    //     iron.map((dataBaseIronel) => {
    //         if (requestBody.type == "in") {
    //             if (dataBaseIronel.name == el.ironName) {
    //                 dataBaseIronel.props.map((prop) => {
    //                     if (prop.radius == el.radius) {
    //                         prop.weight += el.weight;
    //                         prop.date = todayDate;
    //                     }
    //                 })
    //             }
    //         }
    //         if (requestBody.type == "out") {
    //             if (dataBaseIronel.name == el.ironName) {
    //                 dataBaseIronel.props.map((prop) => {
    //                     if (prop.radius == el.radius) {
    //                         prop.weight -= el.weight;
    //                         prop.date = todayDate;

    //                     }
    //                 })
    //             }
    //         }
    //     })

    // })
    // updateDatabaseByName('IronStorage', JSON.stringify(iron));



}

const changeIronWeight = (req, res) => {
    const { radius, name, weight } = req.body
    let db = getDatabaseByName('IronStorage');
    let isFound = false;
    for (let i in db) {
        if (name === db[i]['name']) {
            for (let j in db[i].props) {
                //console.log(radius,db[i]['props'][j].radius)
                if (radius == db[i]['props'][j].radius) {
                    db[i]["props"][j].weight += parseInt(weight)
                    console.log(db[i]["props"][j].weight)
                    console.log(db[i]["props"])
                    isFound = true;
                    updateDatabaseByName('IronStorage', JSON.stringify(db))
                    res.json({ "msg": "done", "newWeight": weight })
                    break;
                }
            }
        }

        if (isFound)
            break;
    }


}

const handleChangePassword = (req, res) => {
    let { password } = req.body;

    let db = getDatabaseByName('Passwords');

    if (db[0]["ironChangePassword"] === password) {
        res.json({ "msg": "success" })
    }
    else {
        res.json({ "msg": "failed" })
    }
}

module.exports = {
    getIronStorage,
    addIron,
    addIronWeight,
    subtractIronWeight,
    changeIronWeight,
    getScaleWeight,
    handleChangePassword,
    getIronStorageAdmin
}