const cookies = {
    domain: 'localhost',
    path: '/login',
    maxAge: 7 * 60 * 60 * 1000, // 一周
    expires: new Date(Date.now() + 7 * 60 * 60 * 1000 * 24),
    httpOnly: true,
    overwrite: false
}

module.exports = cookies;