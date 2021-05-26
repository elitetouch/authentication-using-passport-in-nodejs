const User = require('../models/User');
const bcrypt = require('bcrypt');
const passport = require('passport');

exports.register = (req, res) => {
    console.log(req.body);
    const { name, email, password, password2 } = req.body;
    let errors = [];

    //check required fields

    if (!name || !email || !password || !password2) {
        errors.push({ msg: 'Please fill in all fields' });
    }

    //Check password match
    if (password !== password2) {
        errors.push({ msg: 'Passwords do not match' });
    }

    //Check password length
    if (password.length < 6) {
        errors.push({ msg: 'Passwords should be at least 6 character' });
    }



    if (errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2

        });
    } else {
        //check if user exist in database
        User.findOne({ email: email })
            .then(user => {
                //user exists
                if (user) {
                    errors.push({
                        msg: ' Email is already registered'
                    });
                    res.render('register', {
                        errors,
                        name,
                        email,
                        password,
                        password2

                    });
                } else {

                    //new user
                    const newUser = new User({
                        name,
                        email,
                        password
                    });

                    //Hash Password
                    bcrypt.genSalt(10, (err, salt) =>
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err;

                            // set password to hashed
                            newUser.password = hash;
                            //save user
                            newUser.save()
                                .then(
                                    user => {
                                        req.flash('success_msg', ' You are now registered and can log in');
                                        res.redirect('login');

                                    })
                                .catch(err => console.log(err));

                        }));


                }
            });

    }
}


exports.login = (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);

}

exports.logout = (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('login');
}