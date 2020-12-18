let express = require('express')

let {
    validateApiKey 
} = require('../middleware')

let frontEndRouter = express.Router()

frontEndRouter.get('/login', (req, res) =>
{
    res.render('login', {
        errorMessage: undefined
    })
})

frontEndRouter.get('/signup', (req, res) =>
{
    res.render('signup', {
        errorMessage: undefined
    })
})

frontEndRouter.get('/', (req, res) =>
{
    res.render('home')
})

frontEndRouter.get('/request-feature', (req, res) =>
{
    res.render('request-feature', {
        errorMessage: undefined
    })
})

frontEndRouter.get('/app', (req, res) =>
{
    res.render(express.static('../app/build'))
})

module.exports = frontEndRouter