const express = require('express');
const router = express.Router();
const {ticketUpdateTransaction, addOrder , EditOrderTicket, getClientOrders, getTicketsInfo, TicketFinishState, getUnfinishedTicketsInfo, getSpecificTicket, getTicketsForDay, TicketDelete} = require('../controllers/order'); 

router.get("/getTickets", getTicketsInfo)
router.get("/getTicketsForDay", getTicketsForDay)
router.get("/getSpecificTicket/:id", getSpecificTicket)
router.get("/getUnfinishedTickets", getUnfinishedTicketsInfo)
router.post("/addOrder", addOrder)
router.post("/EditOrderTicket", EditOrderTicket)
router.post("/getClientOrders", getClientOrders)
router.post("/ticketFinishState", TicketFinishState)
router.post("/ticketAddSatetment", ticketUpdateTransaction)






module.exports = router;