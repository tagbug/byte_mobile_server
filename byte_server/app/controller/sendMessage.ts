
import { io } from "../app";
const MessageModel = require('../model/MessageModel')


const sendMessage = (ctx: any) => {
    io.on('connection', (socket: any) => {
        console.log('websocket connected');
        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
        socket.on('message', async (str: any) => {
            const obj = JSON.parse(str);
            const { userId, receiverId, message } = obj;

            io.emit('message', 'hoho');
            try {
                const messages = await MessageModel.find();
                const messageId = messages.length + 1;
                const newMessage = new MessageModel({
                    messageId,
                    userId,
                    receiverId,
                    message
                })
                await MessageModel.create(newMessage);
            } catch (err) {
                console.log(err);
            }
        });
    })


}

const getChattingRecord = async (ctx: any) => {
    const { userId, receiverId } = ctx.request.query;
    try {
        const record = await MessageModel.find({ $or: [{ userId, receiverId }, { userId: receiverId, receiverId: userId }] });
        ctx.body = record;
    } catch (err) {
        ctx.body = { status: 1, msg: '未知异常' };
    }

}

const getChatList = async (ctx: any) => {
    const { userId } = ctx.request.query;
    try {
        const charList = await MessageModel.find({ userId });
        ctx.body = charList;
    } catch (err) {
        ctx.body = { msg: '获取失败' };
    }
}
export { }
module.exports = {
    sendMessage,
    getChattingRecord,
    getChatList
}
