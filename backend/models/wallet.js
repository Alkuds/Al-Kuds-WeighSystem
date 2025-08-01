const mongoose = require('mongoose');
const WalletSchema = new mongoose.Schema({
    totalAmount: {
        type: Number,
        default: 0 
    },
    bankName: {
        type: String,
        required: true
    },
    transactions:[{
        isDivided:[{
            amount: {
                type: Number,
                default: 0
            },
            orderId: {
                type: String,
                default: ""
            },
        }],
        amount: {
            type: Number,
            required: true
        },
        clientId: {
            type: String,
            required: true
        },
        bankName: {
            type: String,
            default: " "
        },
        type: {
            type: String,
            default: ""
        },
        orderId: {
            type: String,
            default: ""
        },
        notes: {
            type: String,
            default: ""
        },
        isDisbursed: {
            type: Boolean,
            default: false
        },
        disbursementDate: {
            type: String,
            default: " "
        },
        sign: {
            type: String,
            default: " "
        },
        receiverName: {
            type: String,
            default: " "
        },
        date: {
            type: Date,
            default: new Date().toLocaleString('en-EG', { timeZone: 'Africa/Cairo' })
        }
    }]
});

const Wallet = mongoose.model('Wallet', WalletSchema);

module.exports = Wallet;
