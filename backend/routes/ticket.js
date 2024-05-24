const express = require('express');
const router = express.Router();
const { getTicketsInfo, addTicket } = require('../controllers/ticket'); 
router.get("/getTickets", getTicketsInfo)
router.get("/addTicket", addTicket)





module.exports = router;