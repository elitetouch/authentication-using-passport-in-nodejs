const router = require('express').Router();
const controller = require('../controller/controller');
const check = require('../controller/auth');

//login Routes
router.get('/login', check.notAuthenticated, (req, res) => {
    res.render('login');
});

//register Routes
router.get('/register', check.notAuthenticated, (req, res) => {
    res.render('register');
});

//Register Handle
router.post('/register', check.notAuthenticated, controller.register);

//Login Handle
router.post('/login', check.notAuthenticated, controller.login);

//Logout Handle
router.get('/logout', controller.logout);





module.exports = router;