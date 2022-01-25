
const MessageModel = require('../model/MessageModel');
const UserModel = require('../model/UserModel')

interface User {
    userId: Number
    receiverId: Number,
}

const sendMessage = (ctx: any) => {
    ctx.websocket.on('message', async (info: any) => {
        const obj = JSON.parse(info);
        const { userId, receiverId, message } = obj;

        try {
            const messages = await MessageModel.find();
            const user = await UserModel.findOne({ userId });
            const receiver = await UserModel.findOne({ userId: receiverId });
            const charList = user.charList;  // 获取原来的聊天列表
            const receiver_charList = receiver.charList;

            let check = 0, receiver_check = 0;  // 假设不在 
            charList.forEach((obj: User) => {
                if (obj && obj.userId === receiverId) check = 1;
            });
            receiver_charList.forEach((obj: User) => {
                if (obj && obj.userId === userId) receiver_check = 1;
            }); 

            check === 0 && charList.push(receiver);
            receiver_check === 0 && receiver_charList.push(user);

            await UserModel.updateOne({ userId }, { charList });
            await UserModel.updateOne({ userId: receiverId }, { charList: receiver_charList })

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

const getChattingRecord = async (ctx: any) => {
    ctx.websocket.on('message', async (info: any) => {
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

const getChatList = async (ctx: any) => {
    ctx.websocket.on('message', async (info: any) => {
        const obj = JSON.parse(info)
        const { userId } = obj;
        console.log(obj);

        try {
            const charList = await MessageModel.find({ $or: [{ userId }, { receiverId: userId }] });
            ctx.websocket.send(JSON.stringify(charList));
        } catch (err) {
            ctx.websocket.send("{ msg: '获取失败' }");
        }
    })

}

export { }

module.exports = {
    sendMessage,
    getChattingRecord,
    getChatList
}
