const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

const User = require('../models/User');
const auth = require('../middlewares/auth')

// @route   POST api/auth
// @des     Auth user and get token
// @access  Public
router.post('/',
    [
        check('email', 'Please include a valid email.').isEmail(),
        check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        const { password, email } = req.body;

        try {
            let user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ msg: 'Invalid credentials.' })
            }

            const isPasswordMatch = await bcrypt.compare(password, user.password);
            if (!isPasswordMatch) {
                return res.status(400).json({ msg: 'Invalid credentials.' })
            }

            const payload = {
                user: {
                    id: user.id
                }
            }

            jwt.sign(payload, config.get('jwtSecret'), { expiresIn: 360000 }, (err, token) => {
                if (err) throw err;
                res.json({ token: token })
            });

        } catch (err) {
            console.error(err.message);
            res.status(500).json({ msg: 'Server error.' })
        }
    }
);

// @route   GET api/auth
// @des     Get logged in user
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const userFormDB = await User.findById(req.user.id).select('-password');
        res.json(userFormDB)
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error.' })
    }
});

module.exports = router;