// Fetches dev environment variables using dotenv librry if necessary

let env = process.env.NODE_ENV || 'development';

if (env === 'development')
{
    require('dotenv').config()
}

// Importing server framework
let express = require('express')

// Importing middleware and other dependencies
let morgan = require('morgan');
let cookieParser = require('cookie-parser');
let cors = require('cors');
let ejs = require('ejs');
const { validateApiKeyOptional } = require('./middleware');

// Importing API routes
let authRouter = require('./routes/auth');
let shiftRouter = require('./routes/shifts');
let settingsRouter = require('./routes/settings');

// Importing front-end routes
let frontEndRouter = require('./routes/front-end');

// Importing database
let { db, Request } = require('./models');

// Connecting to db
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() 
{
    console.log('Connected to database.');

    // Rendering app and configuring routes + middleware
    var app = express();

    app.set('trust proxy', 1)
    app.use(express.static('public'));
    app.use(express.urlencoded({extended: true}));
    app.use(express.json());
    app.set('view engine', 'ejs');
    app.use(morgan('dev'));
    app.use(cors({origin:'http://localhost:3000', optionsSuccessStatus: 200, credentials: true}));
    app.options('*', cors());
    app.use(cookieParser());
    app.use(authRouter);
    app.use('/shifts', shiftRouter);
    app.use('/settings', settingsRouter);
    app.use(frontEndRouter);

    // Route for feature requests
    app.post('/request-feature', validateApiKeyOptional ,(req, res, next) =>
    {
        if (req.user)
        {
            Request.create({
                userID: req.user.userID,
                email: req.body.email,
                message: req.body.message
            }, (err, request) =>
            {
                if (err) res.render('login', {
                    errorMessage: 'An error occured when submitting your request'
                })
                else {
                    res.render('login', {
                        errorMessage: ''
                    })
                }
            })
        } else 
        {
            Request.create({
                email: req.body.email,
                message: req.body.message
            }, (err, request) =>
            {
                if (err) res.render('login', {
                    errorMessage: 'An error occured when submitting your request'
                })
                else {
                    res.render('login', {
                        errorMessage: ''
                    })
                }
            })
        }
    })

    // Starting the server
    app.listen(process.env.PORT || 4000, () =>
    {
        console.log('Server is listening.')
    })
});
