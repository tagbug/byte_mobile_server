const UserModel = require('../model/UserModel.ts');
const mongoose = require('mongoose');


// 注册
const register = async (ctx: any) => {
    const { username, password } = ctx.request.body;
    const user = await UserModel.find({});
    const userId = mongoose.Types.ObjectId(user.length + 1);
    if (user.length) ctx.body = { msg: '该用户名已存在' };
    const newUser = new UserModel({
        userId,
        username,
        password,
    })

    try {
        await UserModel.create(newUser);
        ctx.body = { status: 0, msg: '注册成功' }
    } catch (err) {
        ctx.body = { status: 1, msg: '注册失败' }
    }
}

// 登录
const login = async (ctx: any) => {
    const body = ctx.request.body;
    const { username, password } = body;

    try {
        const data = await UserModel.updateOne({ username, password }, { status: 0 });
        if (data.modifiedCount) {
            ctx.body = { status: 0, msg: '登录成功', userId: data.userId };
        } else if (!data.matchedCount) {
            ctx.body = { status: 1, msg: '账号或密码错误', userId: data.userId };
        } else {
            ctx.body = { status: 1, msg: '你已经登录了', userId: data.userId };
        }
    } catch (err) {
        ctx.body = { status: 1, msg: '未知错误' }
    }
}

// 退出登录
const logout = async (ctx: any) => {
    const { username } = ctx.request.body;
    try {
        const data = await UserModel.updateOne({ username }, { status: 1 });
        if (data.modifiedCount) {
            ctx.body = { status: 0, msg: '登出成功' };
        } else if (!data.matchedCount) {
            ctx.body = { status: 1, msg: '找不到该用户' };
        } else {
            ctx.body = { status: 1, msg: '你还未登录' };
        }
    } catch (err) {

    }
}

// 查看登录状态
const getLoginStatus = async (ctx: any) => {
    const { username } = ctx.query;
    const result = await UserModel.findOne({ username });
    if (result) {
        ctx.body = { status: result.status, msg: '0表示登录, 1表示未登录' }
    } else {
        ctx.body = { msg: '你还没注册呢' };
    }
}

export { };


module.exports = {
    login,
    logout,
    register,
    getLoginStatus
};