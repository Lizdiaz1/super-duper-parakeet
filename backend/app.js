const express = require('express');
require('express-async-errors');
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const routes = require('./routes')
const { ValidationError } = require('sequelize');


const { environment } = require('./config');
//Create a variable called isProduction 
//that will be true if the environment is in production or not 
const isProduction = environment === 'production'

const app = express()

app.use(morgan('dev'))
//Add the cookie-parser middleware for parsing cookies
app.use(cookieParser())
app.use(express.json())


if(!isProduction) {
    //enable cors only in development 
    app.use(cors())
}




app.use(
    helmet.crossOriginResourcePolicy({
        policy: "cross-origin"
    })
)

// Set the _csrf token and create req.csrfToken method
app.use(
    csurf({
        cookie: {
            secure: isProduction,
            sameSite: isProduction && "Lax",
            httpOnly: true
        }
    })
)


app.use(routes)

//404 not found
app.use((_req, _res, next) => {
    const err = new Error("The requested resource couldn't be found.");
    err.title = "Resource Not Found";
    err.errors = { message: "The requested resource couldn't be found." };
    err.status = 404;
    next(err);
  });

// Process sequelize errors
app.use((err, _req, _res, next) => {

    if (err instanceof ValidationError) {
      let errors = {};
      for (let error of err.errors) {
        errors[error.path] = error.message;
      }
      err.title = 'Validation error';
      err.errors = errors;
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

  //tested

  
module.exports = app