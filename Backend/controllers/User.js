
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Regexp Pour le format du mail & du mot de passe
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
const regexInject = /[\=\'\'\{\}]/; // ne doit pas contenir les caractères suivants : =, ", ", {, }

const env = require("dotenv").config()
let userToken = process.env.TOKEN;

exports.signup = (req, res, next) => {

    var email = req.body.email;
    var password = req.body.password;
    if (!emailRegex.test(email)) {
        return res.status(401).json({ 'error': 'email is not valid' });
    };
    if (regexInject.test(password)) {
        return res.status(401).json({ 'error': 'password invalid must no inclue "=}{' });
    };
    if (!passwordRegex.test(password)) {
        return res.status(401).json({ 'error': 'password invalid (must length 4 - 8 and include 1 number at least)' });
    }
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save()
                .then(() => res.status(201).json({ message: 'User created' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'User not found !' });
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'incorrect password !' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            `${userToken}`,
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};