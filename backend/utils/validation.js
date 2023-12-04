// backend/utils/validation.js
const { validationResult } = require('express-validator');
const { check } = require('express-validator');

const handleValidationErrors = (req, _res, next) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    const errors = {};
    validationErrors.array().forEach((error) => {
      errors[error.param] = error.msg;
    });

    const err = new Error("Bad request.");
    err.errors = errors;
    err.status = 400;
    err.title = "Bad request.";
    next(err);
  } else {
    next();
  }
};

const validateSignup = [
    check('email')
        .isEmail()
        .withMessage('Please provide a valid email.'),
    check('firstName')
        .not()
        .isEmpty()
        .withMessage('First name is required.'),
    check('lastName')
        .not()
        .isEmpty()
        .withMessage('Last name is required.'),
    // Add any additional validations here
];

module.exports = { validateSignup, handleValidationErrors };
