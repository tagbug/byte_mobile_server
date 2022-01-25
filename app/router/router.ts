const Router = require('koa-router');
const router = new Router();


const {
    login,
    logout,
    register,
    getLoginStatus
} = require('../controller/login.ts')

router.get("/", async (ctx: any) => {
    ctx.body = { msg: "Hello koa Interfaces" };
})

// login
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/getLoginStatus", getLoginStatus);

// message
// router.all('/sendMessage', sendMessage);
// router.all('/getChattingRecord', getChattingRecord);
// router.all('/getChatList', getChatList);

export { };

module.exports = router;