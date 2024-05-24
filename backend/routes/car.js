const express = require('express');
const { getCarInfo } = require('../controllers/car');
const router = express.Router();

router.get('/hello', getCarInfo);

module.exports = router;