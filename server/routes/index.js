const router = require('express').Router();
const { ensureAuthenticated } = require('../controller/auth');
//welcome Page
router.get('/', (req, res) => {
    res.render('welcome');
});

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) => res.render('dashboard', {
    name: req.user.name
}));


module.exports = router;