// backend/routes/api/users.js
const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const router = express.Router();

// Sign up
router.post('/', async (req, res, next) => {
    const { email, username, password } = req.body;

    const hashedPassword = bcrypt.hashSync(password, 10); // Salt rounds = 10
    try {
      const user = await User.create({
        username,
        email,
        hashedPassword
      });

      const safeUser = {
        id: user.id,
        email: user.email,
        username: user.username
      };

      await setTokenCookie(res, safeUser);

      return res.json({
        user: safeUser
      });
    } catch (error) {
      next(error); // Handle errors, perhaps duplicate username/email
    }
  });


module.exports = router;
