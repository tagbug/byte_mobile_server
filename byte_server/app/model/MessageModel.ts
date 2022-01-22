const mongoose = require('mongoose');

const MessageSchema = mongoose.Schema({
    userId: {
        type: Number,
        require: true,
    },
    receiverId: {
        type: Number,
        require: true,
    },
    messageId: {
        type: Number,
        require: true,
    },
    message: {
        type: String,
        require: true,
    },
    time: {
        type: String,
        default: new Date().toLocaleString() //2022/1/22 下午10:56:37 
    }

})

module.exports = mongoose.model("messageRecord", MessageSchema);
