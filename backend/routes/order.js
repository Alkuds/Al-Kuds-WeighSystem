const express = require('express');
const router = express.Router();
const {ticketUpdateTransaction, addOrder , EditOrderTicket, getSpecificClientOrders, getTicketsInfo,getUnfinishedOrdersInfoGroupedByClientId,getUnfinishedOrdersInfoGroupedByType, OrderFinishState, getSpecificTicket, getTicketsForDay, TicketDelete} = require('../controllers/order'); 

router.get("/getUnfinishedOrdersInfoGroupedByClientId", getUnfinishedOrdersInfoGroupedByClientId)
router.get("/getUnfinishedOrdersInfoGroupedByType", getUnfinishedOrdersInfoGroupedByType)
router.get("/getTicketsForDay", getTicketsForDay)
router.get("/getSpecificTicket/:id", getSpecificTicket)
router.post("/addOrder", addOrder)
router.post("/EditOrderTicket", EditOrderTicket)
router.post("/ticketAddSatetment", ticketUpdateTransaction)






module.exports = router;