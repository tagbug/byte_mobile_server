const Router = require('koa-router');
const ws_router = new Router();
const {
    sendMessage,
    getChattingRecord,
    getChatList
} = require('../controller/sendMessage.js');


// message
ws_router.all('/sendMessage', sendMessage);
ws_router.all('/getChattingRecord', getChattingRecord);
ws_router.all('/getChatList', getChatList);

// export { };

module.exports = ws_router;