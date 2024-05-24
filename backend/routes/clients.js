const express = require('express');
const { getClientsInfo , postClientsInfo , updateClientsInfo } = require('../controllers/clients');
const router = express.Router();

router.get('/getClientsInfo', getClientsInfo);
router.post('/postClients', postClientsInfo);
router.post('/updateClients', updateClientsInfo);




module.exports = router;