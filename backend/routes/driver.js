const express = require('express');
const { getDriversInfo , postDriversInfo , updateDriversInfo } = require('../controllers/driver');
const router = express.Router();



router.get("/getDriversInfor" , getDriversInfor);
router.post("/postDriversInfo" , postDriversInfo);
router.post("/updateDriversInfo" , updateDriversInfo);


module.exports = router;