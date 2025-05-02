const express = require('express');
const router = express.Router();
const {getIronStorageAdmin, getIronStorage, subtractIronWeight, addIron, addIronWeight, changeIronWeight, getScaleWeight, handleChangePassword} = require('../controllers/irons')
router.post('/getIronStorage', getIronStorageAdmin)
router.post('/addIron', addIron)
router.post('/addIronWeight', addIronWeight)
router.post('/subtractIronWeight', subtractIronWeight)
router.post('/changeIronWeight', changeIronWeight)
router.get('/getScaleWeight',getScaleWeight)
router.post('/checkChangePassword',handleChangePassword)




module.exports = router;