const mongoose = require('mongoose')

let workSchema = new mongoose.Schema({
    userID: {
        type: String,
        required: true
    },
    startTime: {
        year: {
            type: Number,
            required: true
        },
        month: {
            type: Number,
            required: true
        },
        day: {
            type: Number,
            required: true
        },
        hour: {
            type: Number,
            required: true
        },
        minute: {
            type: Number,
            required: true
        },
    },
    endTime: {
        year: {
            type: Number,
            required: true
        },
        month: {
            type: Number,
            required: true
        },
        day: {
            type: Number,
            required: true
        },
        hour: {
            type: Number,
            required: true
        },
        minute: {
            type: Number,
            required: true
        },
    }
})

let shiftSchema = new mongoose.Schema({
    userID: {
        type: String,
        require: true
    },
    startDate: {
        type: Date,
        required: true
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    }
})

let userSchema = new mongoose.Schema({
    userID: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    theme: {
        type: String,
        default: 'aqua'
    },
    hourlySalary: {
        type: Number,
        default: 15
    },
    payPeriodType: {
        type: String,
        default: 'monthly'
    },
    payPeriodMonthly: {
        // Day of previous month before payout for when period starts and ends [inclusive, ..., non-inclusive]
        startDate: {
            type: String,
            default: '20'
        },
    },
    payPeriodBiWeekly: {
        // Pay out on even or uneven weeks
        payOutWeek: {
            type: String,
            default: 'even'
        },
        // Day of week money gets paid out
        payOutDay: {
            type: String,
            default: 'friday'
        },
        // Day of week pay period starts and ends 14 days later [inclusive, ..., non-inclusive]
        payPeriodDay: {
            type: String,
            default: 'monday'
        }
    },
    payPeriodWeekly: {
        // Day of week money gets paid out
        payOutDay: {
            type: String,
            default: 'friday'
        },
        // Day of week pay period starts and ends 7 days later [inclusive, ..., non-inclusive]
        payPeriodDay: {
            type: String,
            default: 'monday'
        }
    }
})

let requestSchema = new mongoose.Schema({
    userID: String,
    email: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    }
})

let Work = mongoose.model('Work', workSchema)
let Shift = mongoose.model('Shift', shiftSchema)
let User = mongoose.model('User', userSchema)
let Request = mongoose.model('Request', requestSchema)

// Initialize DB and export for use in application
mongoose.connect(process.env.MONGO_DB_CONN_URI, {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;

module.exports = {
    Work,
    Shift,
    User,
    Request,
    db
}