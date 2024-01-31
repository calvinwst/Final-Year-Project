const mongoose = require("mongoose");

const connectionSchema = new mongoose.Schema({

    requester:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }
    ,
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    status:{
        type: String,
        enum: ['requested', 'pending', 'connected', 'rejected'],
        default: 'pending',
        required: true,
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },

})

const connection = mongoose.model("connection", connectionSchema);

module.exports = connection;
