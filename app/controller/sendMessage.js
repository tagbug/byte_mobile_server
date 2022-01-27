
const MessageModel = require('../model/MessageModel');
const UserModel = require('../model/UserModel')


const sendMessage = (ctx) => {
    ctx.websocket.on('message', async (info) => {
        const obj = JSON.parse(info);
        const { userId, receiverId, message } = obj;

        try {
            const messages = await MessageModel.find();
            const user = await UserModel.findOne({ userId });
            const receiver = await UserModel.findOne({ userId: receiverId });
            const charList = user.charList;  // 获取原来的聊天列表
            const receiver_charList = receiver.charList;

            let check = 0, receiver_check = 0;  // 假设不在 
            charList && charList.forEach((obj) => {
                if (obj && obj.userId === receiverId) check = 1;
            });
            receiver_charList && receiver_charList.forEach((obj) => {
                if (obj && obj.userId === userId) receiver_check = 1;
            });

            const newCharList = [...charList, receiver];
            const newReceiverList = [...receiver_charList, user];
            if (!check) await UserModel.updateOne({ userId }, { charList: newCharList });
            if (!receiver_check) await UserModel.updateOne({ userId: receiverId }, { charList: newReceiverList })

            const messageId = messages.length + 1;
            const newMessage = new MessageModel({
                messageId,
                userId,
                receiverId,
                message
            })
            await MessageModel.create(newMessage);
            ctx.websocket.send('{ status: 0, msg: "发送成功" }');
        } catch (err) {
            console.log(err);
            ctx.websocket.send('{ status: 1, msg: "未知异常" }');
        }
    });
}

const getChattingRecord = async (ctx) => {
    ctx.websocket.on('message', async (info) => {
        const obj = JSON.parse(info);
        const { userId, receiverId } = obj;
        try {
            const record = await MessageModel.find({ $or: [{ userId, receiverId }, { userId: receiverId, receiverId: userId }] });
            ctx.websocket.send(JSON.stringify(record));
        } catch (err) {
            console.log(err);
            ctx.websocket.send('{ status: 1, msg: "未知异常" }')
        }
    })
}

const getChatList = async (ctx) => {
    ctx.websocket.on('message', async (info) => {

        const obj = JSON.parse(info);
        const { userId } = obj;

        try {
            const user = await UserModel.findOne(userId);
            const charList = user.charList;

            ctx.websocket.send(JSON.stringify(charList));
        } catch (err) {
            ctx.websocket.send("{ msg: '获取失败' }");
        }
    })
}

// export { }

module.exports = {
    sendMessage,
    getChattingRecord,
    getChatList
}
