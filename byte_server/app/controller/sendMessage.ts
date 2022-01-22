
const MessageModel = require('../model/MessageModel')

const sendMessage = async (ctx: any) => {
    const { userId, receiverId, message } = ctx.request.body;
    console.log(ctx.request.body);
    const messages = await MessageModel.find();
    const messageId = messages.length + 1;
    const newMessage = new MessageModel({
        userId,
        receiverId,
        messageId,
        message
    })
    try {
        await MessageModel.create(newMessage);
        ctx.body = { status: 0, msg: '发送成功' }
    } catch (err) {
        ctx.body = { status: 1, msg: '未知异常' };
    }
}

const getChattingRecord = async (ctx: any) => {
    const { userId, receiverId } = ctx.request.query;
    try {
        const record1 = await MessageModel.find({ userId, receiverId });
        const record2 = await MessageModel.find({ receiverId: userId, userId: receiverId });
        const record = [...record1, ...record2];
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

module.exports = {
    sendMessage,

}
