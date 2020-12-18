let bcrypt = require('bcrypt');
let jwt = require('jsonwebtoken')

let {User, Work} = require('./models')

let encryptPassword = async (password) =>
{
    let saltRounds = 12
    let salt = await bcrypt.genSalt(saltRounds)
    let hash = await bcrypt.hash(password, salt)
    return hash
}

let verifyPassword = async(password, hash) =>
{
    let verify = await bcrypt.compare(password, hash)
    return verify
}

let saveUser = async (username, hash) =>
{
    try 
    {
        let user = await User.create({
            userID: Date.now().toString(),
            username: username,
            password: hash
        })
        return user
    } catch(err)
    {

        throw new Error('An error occured, please try again.')
    }
}

let createToken = (userInfo) =>
{

    let token = jwt.sign({
        userID: userInfo.userID,
        username: userInfo.username,
        _id: userInfo._id
    }, process.env.JWT_SECRET)
    return token
}

let verifyToken = async (token) =>
{
    try 
    {
        var payload = jwt.verify(token, process.env.JWT_SECRET)

    } catch(err)
    {
        throw new Error(err)
    }
    delete payload.iat
    let user = await User.findOne(payload).select("-password")
    if (user) return user
    return false
}

function dayToNumber(day)
{
    switch(day.toLowerCase())
    {
        case 'sunday':
            return 0;
        case 'monday':
            return 1;
        case 'tuesday':
            return 2;
        case 'wednesday':
            return 3;
        case 'thursday':
            return 4;
        case 'friday':
            return 5;
        case 'saturday':
            return 6;
        default:
    }
}

module.exports = {
    saveUser,
    encryptPassword,
    verifyPassword,
    createToken,
    verifyToken,
    dayToNumber
}