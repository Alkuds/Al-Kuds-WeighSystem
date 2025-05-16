const express = require('express');
const router = express.Router();
const { getOldClientBalance, getWalletInventoryByDate,addCompanyExpenses, addBank, getTransactionsGroupedByBank, addTransaction, getSpecificClientTransactions  } = require('../controllers/wallets'); 

router.post("/getSpecificClientTransactions", getSpecificClientTransactions)
router.get("/getTransactionsGroupedByBank", getTransactionsGroupedByBank)
router.post("/addTransaction", addTransaction)
router.post("/addCompanyExpenses", addCompanyExpenses)
router.post("/addBank", addBank)
router.post("/getWalletInventoryByDate", getWalletInventoryByDate)
router.post("/getOldClientBalance", getOldClientBalance)




module.exports = router;