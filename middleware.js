let {
    verifyToken
} = require('./utils')

let validateApiKey = (req, res, next) =>
{
    verifyToken(req.cookies.apiKey).then((user) =>
    {
        if (user)
        {
            req.user = user
            next()
        } else 
        {
            res.status(400).send()
        }
    }).catch(() => res.status(400).send())
}

let validateApiKeyOptional = (req, res, next) =>
{
    if (req.cookies.apiKey)
    {
        verifyToken(req.cookies.apiKey).then((user) =>
        {
            if (user)
            {
                req.user = user
                next()
            } else 
            {
                res.status(400).send()
            }
        }).catch(() => res.status(400).send())
    } else next()
}

module.exports = {
    validateApiKey,
    validateApiKeyOptional
}