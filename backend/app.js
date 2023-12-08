const express = require('express');
require('express-async-errors');
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { ValidationError } = require('sequelize');

// Routes
const sessionRouter = require('./routes/api/session');
const spotsRouter = require('./routes/api/spots');
const usersRouter = require('./routes/api/users');
const reviewsRouter = require('./routes/api/reviews');
const bookingsRouter = require('./routes/api/bookings');

require('dotenv').config();
const { environment } = require('./config');
const isProduction = environment === 'production';

const app = express();

// auth setup
app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());

if (!isProduction) {
    app.use(cors());  // Enable CORS only in development
}

app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

app.use(csurf({
    cookie: {
        secure: isProduction,
        sameSite: isProduction && "Lax",
        httpOnly: true
    }
}));

// Route handlers
app.use('/api/session', sessionRouter);
app.use('/api/spots', spotsRouter);
app.use('/api/users', usersRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/bookings', bookingsRouter);

// Catch unhandled requests and forward to error handler
app.use((_req, _res, next) => {
    const err = new Error("The requested resource couldn't be found.");
    err.title = "Resource Not Found";
    err.errors = { "message": "The requested resource couldn't be found." };
    err.status = 404;
    next(err);
});

// Process sequelize errors
app.use((err, _req, _res, next) => {
    if (err instanceof ValidationError) {
        let errors = {};
        err.errors.forEach(error => {
            errors[error.path] = error.message;
        });
        err.title = 'Validation error';
        err.errors = errors;
        err.status = 400;
    }
    next(err);
});

// Error formatter
app.use((err, _req, res, _next) => {
    res.status(err.status || 500);
    console.error(err);
    res.json({
        title: err.title || 'Server Error',
        message: err.message,
        errors: err.errors,
        stack: isProduction ? null : err.stack
    });
});

module.exports = app;
