const express = require('express');
const router = express.Router();
const requireAuth = require('../config/auth')
const { getCurrentCheques, addChequeTransaction, getOldClientBalance, getWalletInventoryByDate,addCompanyExpenses, addBank, getTransactionsGroupedByBank, addTransaction, getSpecificClientTransactions  } = require('../controllers/wallets'); 

router.post("/getSpecificClientTransactions",requireAuth, getSpecificClientTransactions)
router.get("/getTransactionsGroupedByBank", requireAuth, getTransactionsGroupedByBank)
router.post("/addTransaction",requireAuth, addTransaction)
router.post("/addChequeTransaction",requireAuth, addChequeTransaction)
router.post("/addCompanyExpenses",requireAuth, addCompanyExpenses)
router.post("/addBank",requireAuth, addBank)
router.post("/getWalletInventoryByDate",requireAuth, getWalletInventoryByDate)
router.post("/getOldClientBalance",requireAuth, getOldClientBalance)
router.get("/getCurrentCheques",requireAuth, getCurrentCheques)




module.exports = router;