const express = require('express');
const router = express.Router();
const { getTicketsInfo, addTicket } = require('../controllers/ticket'); 

router.get("/getTickets", getTicketsInfo)
router.post("/addTicket", addTicket)





module.exports = router;