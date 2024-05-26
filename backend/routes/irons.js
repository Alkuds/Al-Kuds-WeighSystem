const express = require('express');
const router = express.Router();
const {getIronStorage, subtractIronWeight, addIron, addIronWeight, changeIronWeight, getScaleWeight} = require('../controllers/irons')
router.get('/getIronStorage', getIronStorage)
router.post('/addIron', addIron)
router.post('/addIronWeight', addIronWeight)
router.post('/subtractIronWeight', subtractIronWeight)
router.post('/changeIronWeight', changeIronWeight)
router.get('/getScaleWeight',getScaleWeight)




module.exports = router;