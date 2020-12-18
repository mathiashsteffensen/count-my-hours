let express = require('express')
let {
    verifyPassword, 
    encryptPassword
} = require('../utils')

let {
    User,
    Shift
} = require('../models')

let {
    validateApiKey
} = require('../middleware')

let settingsRouter = express.Router()

settingsRouter.patch('/save', validateApiKey, (req, res) =>
{
    if (req.body.updates.password) delete req.body.updates.password
    User.findOneAndUpdate({userID: req.user.userID}, req.body.updates).exec(function(err, user)
    {
        if (err) res.status(500).send('db error')
        else 
        {
            console.log(user)
            res.send()
        }
    })
})

settingsRouter.patch('/save/change-password', validateApiKey, (req, res) =>
{
    User.findOne({username: req.user.username}, function(err, user)
    {
        if (err) res.status(500).send(err)

        if (user)
        {
            verifyPassword(req.body.oldPassword, user.password).then(async (verified) =>
            {
                if (verified)
                {   
                    let newHash = await encryptPassword(req.body.updates.password)
                    User.findByIdAndUpdate(user._id, {...req.body.updates,...{password: newHash}}, function(err, user)
                    {
                        if (err) res.status(500).send(err)
                        else
                        {
                            res.send()    
                        }
                    })
                } else
                {
                    res.status(400).send(err)
                }
            })
        } else res.status(500).send(err)
    })
})

settingsRouter.delete('/account', validateApiKey, (req, res) =>
{
    User.findOne({username: req.user.username}, function(err, user)
    {
        if (err) res.status(500).send(err)

        if (user)
        {
            verifyPassword(req.body.password, user.password).then(async (verified) =>
            {
                if (verified)
                {
                    user.deleteOne()
                    Shift.find({userID: user.userID}, function(err, shifts)
                    {
                        if (err) res.status(500).send(err)
                        else
                        {
                            shifts.forEach((shift) =>
                            {
                                shift.deleteOne()

                            })
                            res.send()
                        }
                    })
                } else
                {
                    res.status(400).send(err)
                }
            })
        } else res.status(500).send(err)
    })
})

module.exports = settingsRouter