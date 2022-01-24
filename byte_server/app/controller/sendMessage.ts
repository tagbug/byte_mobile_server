
const MessageModel = require('../model/MessageModel')

const sendMessage = (ctx: any) => {
    ctx.websocket.on('message', async (info: any) => {
        const obj = JSON.parse(info);
        const { userId, receiverId, message } = obj;


        const messages = await MessageModel.find();
        const messageId = messages.length + 1;
        const newMessage = new MessageModel({
            messageId,
            userId,
            receiverId,
            message
        })
        try {
            const result = await MessageModel.create(newMessage);
            console.log(result);
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
