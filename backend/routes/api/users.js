// backend/routes/api/users.js
const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const validateSignup = [
  check('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage('Please provide a valid email.'),
  check('username')
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage('Please provide a username with at least 4 characters.'),
  check('username')
    .not()
    .isEmail()
    .withMessage('Username cannot be an email.'),
  check('password')
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more.'),
  handleValidationErrors,
];

// Consolidated Sign up
router.post('/', validateSignup, handleValidationErrors, async (req, res, next) => {
  const { email, firstName, lastName, password } = req.body;

  try {
      // Check if user already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
          return res.status(500).json({ message: "User already exists" });
      }

      // Hash the password
      const hashedPassword = bcrypt.hashSync(password, 10);

      // Create new user
      const user = await User.create({
          username,
          email,
          firstName,
          lastName,
          hashedPassword
      });

      // Log the user in
      setTokenCookie(res, user);

      return res.json({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      });
  } catch (error) {
      next(error);
  }
});
//get the current user
router.get('/current', restoreUser, (req, res) => {
  if (req.user) {
    const { id, firstName, lastName, email, username } = req.user;
    return res.json({
      user: { id, firstName, lastName, email, username }
    });
  } else {
    return res.json({ user: null });
  }
});

// Get all spots owned by the current user
router.get('/spots', requireAuth, async (req, res, next) => {
  try {
      const userId = req.user.id; 
      const spots = await Spot.findAll({
          where: { ownerId: userId },
          // additional attributes
      });

      res.json({ Spots: spots });
  } catch (error) {
      next(error);
  }
});


module.exports = router;
