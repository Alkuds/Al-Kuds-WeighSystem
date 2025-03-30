const Wallet = require('../models/wallet')
const Order = require('../models/order')
const Client = require('../models/client')
const Iron = require('../models/iron')

const subtractOneMonth = (dateStr) => {
    let date = new Date(dateStr);

    // Get current year and month
    let year = date.getFullYear();
    let month = date.getMonth(); // getMonth() is zero-based (Jan = 0)

    // Handle January case (previous month = December, previous year = current year - 1)
    if (month === 0) {
        year -= 1;
        month = 11; // December
    } else {
        month -= 1;
    }

    // Set new month and year
    date.setFullYear(year);
    date.setMonth(month);

    // Format the date back to MM/DD/YYYY, h:mm:ss AM/PM
    let formattedDate = formatDate(date);
    return formattedDate;
}

const formatDate = (date) => {
    let month = date.getMonth() + 1; // Convert to 1-based month
    let day = date.getDate();
    let year = date.getFullYear();
    
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    
    let ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // Convert to 12-hour format

    // Ensure two-digit format for MM/DD/YYYY and time
    return `${month}/${day}/${year}, ${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} ${ampm}`;
}

const isBeforeByMonthYear = (date1, date2) => {
    // Convert date strings to Date objects
    let d1 = new Date(date1);
    let d2 = new Date(date2);

    // Extract year and month
    let year1 = d1.getFullYear();
    let month1 = d1.getMonth() + 1; // getMonth() returns 0-based month

    let year2 = d2.getFullYear();
    let month2 = d2.getMonth() + 1;

    // Compare year and month
    if (year2 < year1 || (year2 === year1 && month2 < month1)) {
        return true;  // date2 is before date1 in terms of month and year
    }
    return false;
}

const getProfitReportDataBasedOnDate = async(req,res)=>{
    let { monthAndYear } = req.body
    let soldOrders, iron,soldProfit = 0, purchasedPrice = 0, beginningOfMonthIronPrice = 0, endingOfMonthIronPrice = 0, totalProfitWithoutExpenses = 0, overAllTotalProfit = 0;
    try{
        iron = await Iron.find()
        soldOrders = await Order.find(
            {
                $and: [
                    { "state": "جاري انتظار الدفع" }
                ]
            }
        )

        for(let order of soldOrders){
            let dateArr = order.date.split(',');
            let monthYearSplit = dateArr[0].split('/')
            let monthYear = monthYearSplit[0] + "/" + monthYearSplit[2]
            if(monthYear === monthAndYear ){
                if(order.type === "out"){
                    soldProfit += order.totalProfit
                }
                if(order.type === "in"){
                    purchasedPrice+= order.totalPrice
                }
            }
        }

        let formattedSentMonthAndYear = monthAndYear.split('/')[0] + "/1/" + monthAndYear.split('/')[1] + ", 1:38:44 PM"

        for(let i of iron){
            for(let j of i.costPerWeight){
                let monthBefore = subtractOneMonth(j.date)
                if(isBeforeByMonthYear(formattedSentMonthAndYear, j.date)){
                    endingOfMonthIronPrice += (parseFloat((j.weight / 1000)) * j.unitCostPerTon)
                }
                if(isBeforeByMonthYear(monthBefore, j.date)){
                    beginningOfMonthIronPrice += (parseFloat((j.weight / 1000)) * j.unitCostPerTon)
                }
            }
        }

        totalProfitWithoutExpenses = (soldProfit + endingOfMonthIronPrice) - (purchasedPrice + beginningOfMonthIronPrice) 



    }
    catch(err){
        console.log(err)
    }

}

module.exports = {
    getProfitReportDataBasedOnDate
}