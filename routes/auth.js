let express = require('express')
const rateLimit = require("express-rate-limit");

const {User} = require('../models')

const {
    encryptPassword,
    saveUser,
    verifyPassword,
    createToken
} = require('../utils')

const {
    validateApiKey
} = require('../middleware')

let authRouter = express.Router()

const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10 // limit each IP to 10 requests per windowMs
})

authRouter.post('/signup', limiter, (req, res) =>
{
    User.findOne({username: req.body.username}, function(err, user)
    {
        if (err) res.render('signup', {
            errorMessage: 'An error occured, please try again.'
        })

        if (user) 
        {
            res.render('signup', {
                errorMessage: 'A user already exists with that username.'
            })
        } else
        {
            res.render('login', {
                errorMessage: ''
            })
            encryptPassword(req.body.password).then((hash) => saveUser(req.body.username, hash).catch((err) => console.log(err)))
        }
    })
})

authRouter.post('/login', limiter, (req, res) =>
{
    User.findOne({username: req.body.username}, function(err, user)
    {
        if (err) res.render('login', {
            errorMessage: 'An error occured, please try again.'
        })

        if (user)
        {
            verifyPassword(req.body.password, user.password).then((verified) =>
            {
                if (verified)
                {
                    let apiKey = createToken(user)
                    res.cookie('apiKey', apiKey)
                    res.redirect('/app')
                } else
                {
                    res.render('login', {
                        errorMessage: 'Invalid username or password.'
                    })
                }
            })
        } else res.render('login', {
            errorMessage: 'Invalid username or password.'
        })
    })
})

authRouter.get('/is-api-key-valid', validateApiKey, (req, res) =>
{
    res.json(req.user)
})

module.exports = authRouter