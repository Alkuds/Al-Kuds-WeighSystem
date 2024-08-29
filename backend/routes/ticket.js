const express = require('express');
const router = express.Router();
const { getTicketsInfo, addTicket , TicketFinishState, getUnfinishedTicketsInfo, getSpecificTicket, getTicketsForDay} = require('../controllers/ticket'); 

router.get("/getTickets", getTicketsInfo)
router.get("/getTicketsForDay", getTicketsForDay)
router.get("/getSpecificTicket/:id", getSpecificTicket)
router.get("/getUnfinishedTickets", getUnfinishedTicketsInfo)
router.post("/addTicket/:id", addTicket)
router.post("/ticketFinishState/:id", TicketFinishState)






module.exports = router;