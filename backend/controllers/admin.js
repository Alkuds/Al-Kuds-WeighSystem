const Wallet = require('../models/wallet')
const Order = require('../models/order')
const Client = require('../models/client')
const Iron = require('../models/iron')
const { isDateBetween } = require('../controllers/irons')
const subtractOneMonth = (dateStr) => {
    let date = new Date(dateStr);

    let year = date.getFullYear();
    let month = date.getMonth(); 

    if (month === 0) {
        year -= 1;
        month = 11; 
    } else {
        month -= 1;
    }

    date.setFullYear(year);
    date.setMonth(month);

    let formattedDate = formatDate(date);
    return formattedDate;
}

const formatDate = (date) => {
    let month = date.getMonth() + 1; 
    let day = date.getDate();
    let year = date.getFullYear();
    
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    
    let ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; 

    
    return `${month}/${day}/${year}, ${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} ${ampm}`;
}


const isBeforeByMonthYearOrEqual = (date1, date2) => {
    let d1 = new Date(date1);
    let d2 = new Date(date2);

    let year1 = d1.getFullYear();
    let month1 = d1.getMonth() + 1; 

    let year2 = d2.getFullYear();
    let month2 = d2.getMonth() + 1;

    if ((year2 <= year1 && month2 <= month1)) {
        return true;  
    }
    return false;
}

const isSameMonth = (date1Str, date2Str) => {
    const date1 = new Date(date1Str);
    const date2 = new Date(date2Str);
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() 
    );
}

const getBeginningOfMonthIronPrice = async(startDate) => {
    console.log(startDate)
    let ironList, ironMap = {};
    try {
        ironList = await Iron.find()
        for(let i of ironList){
            if(!(i.name in ironMap)){
                ironMap[i.name] = {}
            }
            for(let j of i["costPerWeight"]){
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
        const orders = await Order.find({
            state: { $in: ["جاري انتظار الدفع", "منتهي"] }
        });
        const wantedDate = new Date(startDate);
        for(let order of orders){
            let orderDate = new Date(order.date)
            if(isDateBetween(orderDate,wantedDate)){
                for(let ticket of order.ticket){
                    for(let consumedUnitPerWeight of ticket.usedUnitCostPerWeight){
                        let hasTheConsumedIron = false
                        for(let k = 0 ; k<ironMap[ticket.ironName][ticket.radius].length ; k++){
                            if( consumedUnitPerWeight.orderId === ironMap[ticket.ironName][ticket.radius][k]._id){
                                hasTheConsumedIron = true    
                                if(order.type === "out"){
                                    ironMap[ticket.ironName][ticket.radius][k].weight += consumedUnitPerWeight.weight
                                }
                                else{
                                    ironMap[ticket.ironName][ticket.radius][k].weight -= consumedUnitPerWeight.weight
                                }
                            }                            
                        }
                        if(!hasTheConsumedIron){
                            ironMap[ticket.ironName][ticket.radius].push({"weight":consumedUnitPerWeight.weight,"unitCostPerTon":consumedUnitPerWeight.cost})
                        }
                    }
                }
            }
        }
        let total = 0
        for (const ironName in ironMap) {
            const radii = ironMap[ironName];
            for (const radius in radii) {
              const items = radii[radius];
              for (const item of items) {
                if(item.weight>=0)
                    total+= parseFloat(item.weight/1000) * item.unitCost 
              }
            }
        }
        console.log(total)
        return total
    }
    catch(err){
        console.log(err)
    }
}

function convertToLastDayOfMonth(dateString) {
    // Parse the input date string.
    const date = new Date(dateString);
  
    // Check if the date is valid.
    if (isNaN(date.getTime())) {
      return null; // Return null for invalid date input.
    }
  
    // Get the year and month.
    const year = date.getFullYear();
    const month = date.getMonth(); // Month is 0-indexed.
  
    // Create a new date object for the last day of the month.
    // Passing '0' as the day to the Date constructor results in the last day of the *previous* month.
    const lastDayOfMonth = new Date(year, month + 1, 0);
  
    // Convert the last day of the month back to ISO 8601 string format.
    const lastDayOfMonthString = lastDayOfMonth.toISOString();
    return lastDayOfMonthString;
  }

const getProfitReportDataBasedOnDate = async(req,res)=>{
    let { monthAndYear } = req.body
    console.log(monthAndYear)
    let soldOrders, iron,soldProfit = 0, purchasedPrice = 0, beginningOfMonthIronPrice = 0, endingOfMonthIronPrice = 0, totalProfitWithoutExpenses = 0, overAllTotalProfit = 0, deliveryFees = 0;
    let retObj;
    try{
        iron = await Iron.find()
        soldOrders = await Order.find(
            {
                $or: [
                    { "state": "جاري انتظار الدفع" },
                    { "state": "منتهي" }
                ]
            }
        ) 
        console.log(soldOrders.length)

        for(let order of soldOrders){
            console.log(order.date, monthAndYear)
            if(isSameMonth(order.date ,monthAndYear )){
                console.log("sold prof", order.realTotalPrice, order.type)
                if(order.type === "out"){
                    soldProfit += order.realTotalPrice
                    deliveryFees += order.deliveryFees
                }
                if(order.type === "in"){
                    purchasedPrice+= order.realTotalPrice
                }
            }
        }

        let formattedSentMonthAndYear = monthAndYear
        let monthBefore = subtractOneMonth(formattedSentMonthAndYear)
        for(let i of iron){
            for(let j of i.costPerWeight){
                if(isBeforeByMonthYearOrEqual(monthAndYear, j.date)){
                    endingOfMonthIronPrice += (parseFloat((j.weight / 1000)) * j.unitCostPerTon)
                }
            }
        }
        let formattedDay = convertToLastDayOfMonth(monthBefore)
        beginningOfMonthIronPrice = await getBeginningOfMonthIronPrice(formattedDay)

        let companyExpensesDoc = await Client.findOne({"clientId":"4"})
        let companyExpenses = 0
        for(let i of companyExpensesDoc["purchasingNotes"]){
            if(isSameMonth(i.date,monthAndYear)){
                companyExpenses+=i.amount
            }
        }
        console.log(deliveryFees,"fees")
        totalProfitWithoutExpenses = ((soldProfit + endingOfMonthIronPrice) - (purchasedPrice + beginningOfMonthIronPrice)) + deliveryFees
        overAllTotalProfit = (totalProfitWithoutExpenses - companyExpenses) 

        let totalDeficitAndSurplusOfGoods = 0
        retObj = {
            totalDeficitAndSurplusOfGoods,soldProfit,purchasedPrice,beginningOfMonthIronPrice,endingOfMonthIronPrice,totalProfitWithoutExpenses,overAllTotalProfit
        }

    }
    catch(err){
        console.log(err)
    }
    res.json(retObj)

}

module.exports = {
    getProfitReportDataBasedOnDate
}