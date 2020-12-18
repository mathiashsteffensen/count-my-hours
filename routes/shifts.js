let express = require('express')
let {body, validationResult} = require('express-validator')
let dayjs = require('dayjs')
let utc = require('dayjs/plugin/utc')
dayjs.extend(utc)

let {
    Shift
} = require('../models')

let {
    validateApiKey
} = require('../middleware')

let {
    dayToNumber
} = require('../utils')

let shiftRouter = express.Router()

shiftRouter.get('/onDay/:DateInJSON', validateApiKey, (req, res) =>
{

    Shift.find({userID: req.user.userID,startDate: new Date(req.params.DateInJSON)}).exec((err, shifts) =>
    {
        if(err) console.log(err)
        res.json(shifts)
    })
})

shiftRouter.get('/inMonth/:DateInJSON', validateApiKey, (req, res) =>
{
    let query = {
        userID: req.user.userID,
        startTime: { $gte: dayjs.utc(req.params.DateInJSON).date(1), $lte: dayjs.utc(req.params.DateInJSON).date(dayjs.utc(req.params.DateInJSON).daysInMonth()) }
    }

    Shift.find(query).sort("startTime").exec((err, shifts) =>
    {
        if(err) console.log(err)
        res.json(shifts)
    })
})

shiftRouter.get('/inPayPeriod/:DateInJSON', validateApiKey, (req, res) =>
{
    let query = {
        userID: req.user.userID,
        startDate: {}
    }
    let dateToFetch = dayjs.utc(req.params.DateInJSON)

    switch(req.user.payPeriodType)
    {
        case 'weekly':
            query.startDate = {
                $gte: dateToFetch.day(dayToNumber(req.user.payPeriodWeekly.payPeriodDay)).subtract(7, 'days').toJSON(),
                $lt: dateToFetch.day(dayToNumber(req.user.payPeriodWeekly.payPeriodDay)).toJSON()
            }
            break;
        case 'biweekly':
            query.startDate = {
                $gte: dateToFetch.day(dayToNumber(req.user.payPeriodBiWeekly.payPeriodDay)).subtract(14, 'days').toJSON(),
                $lt: dateToFetch.day(dayToNumber(req.user.payPeriodBiWeekly.payPeriodDay)).toJSON()
            }
            break;
        case 'monthly':
            query.startDate = {
                $gte: dateToFetch.subtract(1, 'month').date(req.user.payPeriodMonthly.startDate).toJSON(),
                $lt: dateToFetch.date(req.user.payPeriodMonthly.startDate).toJSON()
            };

            break;
        default:
    }

    Shift.find(query).sort('startTime').exec((err, shifts) =>
    {
        if (err) { res.status(500).send(err)}
        else res.send(shifts)
    })
})

shiftRouter.post('/create', validateApiKey, 
body("startTime").isDate({format: "YYYY/MM/DD HH:mm"}),
body("endTime").isDate({format: "YYYY/MM/DD HH:mm"}).custom((value, {req}) =>
{
    if (dayjs.utc(value).isAfter(dayjs.utc(req.body.startTime)))
    {
        if (dayjs.utc(value).diff(dayjs.utc(req.body.startTime), 'days') < 1)
        {
            console.log(dayjs.utc(value).diff(dayjs.utc(req.body.startTime), 'days'))
            return true
        }
    }
    return false
}), (req, res) =>
{
    const errors = validationResult(req).array()
    if (errors[0])
    {
        console.log(errors)
        res.status(400).send(errors[0])
    } else
    {
        let shiftData = {
            userID: req.user.userID,
            startDate: dayjs.utc(req.body.startTime).toJSON().slice(0,10),
            startTime: dayjs.utc(req.body.startTime).toJSON(),
            endTime: dayjs.utc(req.body.endTime).toJSON()
        }
        console.log(shiftData)
        Shift.create(shiftData, function(err, shift)
        {
            if (err) res.status(500).send(err)
            else res.json(shift)
        }) 
    }
})

shiftRouter.delete('/', validateApiKey, (req, res) =>
{
    Shift.findByIdAndDelete(req.body.shiftID).exec((err, shift) =>
    {
        if(err) console.log(err)
        else res.json(shift)
    })
})

shiftRouter.patch('/', validateApiKey, 
body("updates.startTime").isDate({format: "YYYY/MM/DD HH:mm"}),
body("updates.endTime").isDate({format: "YYYY/MM/DD HH:mm"}).custom((value, {req}) =>
{
    if (dayjs(value).isAfter(dayjs(req.body.updates.startTime))) return true
    return false
}), (req, res) =>
{
    const errors = validationResult(req).array()
    if (errors[0])
    {
        console.log(errors)
        res.status(400).send(errors[0])
    } else
    {
        let newShiftData = {
            startDate: dayjs.utc(req.body.updates.startTime).toJSON().slice(0,10),
            startTime: dayjs.utc(req.body.updates.startTime).toJSON(),
            endTime: dayjs.utc(req.body.updates.endTime).toJSON()
        }

        Shift.findByIdAndUpdate(req.body.shiftID, newShiftData).exec((err, shift) =>
        {
            if(err) {console.log(err); res.status(500).send();}
            else res.json(shift)
        })
    }
})

module.exports = shiftRouter