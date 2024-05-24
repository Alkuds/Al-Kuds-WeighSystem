const express = require('express');
const { getCarInfo ,updateCarInfo , postCarInfo } = require('../controllers/car');
const router = express.Router();

router.get('/getCarInfo', getCarInfo);
router.post('/postCarInfo', postCarInfo);
router.post('/updateCarInfo', updateCarInfo);

module.exports = router;