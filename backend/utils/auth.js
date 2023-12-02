// backend/utils/auth.js
const jwt = require('jsonwebtoken');
const { jwtConfig } = require('../config'); // Adjust the path if needed
const { User } = require('../db/models'); // Adjust the path if needed

const { secret, expiresIn } = jwtConfig;

// Sends a JWT Cookie
const setTokenCookie = (res, user) => {
  const safeUser = {
    id: user.id,
    email: user.email,
    username: user.username
  }
  // Create the token.
    const token = jwt.sign(
      { data: safeUser },
      secret,
      { expiresIn: parseInt(expiresIn) } // Convert expiresIn to an integer
    );

    const isProduction = process.env.NODE_ENV === "production";

    // Set the token cookie
    res.cookie('token', token, {
      maxAge: expiresIn * 1000, // maxAge in milliseconds
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction && "Lax"
    });

    return token;
  };

const restoreUser = (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
      return next();
    }

    return jwt.verify(token, secret, null, async (err, jwtPayload) => {
      if (err) {
        res.clearCookie('token');
        return next();
      }

      try {
        const { id } = jwtPayload.data;
        const user = await User.scope('currentUser').findByPk(id);
        if (!user) throw new Error('User not found');
        req.user = user;
      } catch (e) {
        res.clearCookie('token');
        return next();
      }

      return next();
    });
  };

const requireAuth = (req, res, next) => {
  restoreUser(req, res, () => {
      if (req.user) return next();

      const err = new Error('Authentication required');
      err.status = 401;
      err.title = 'Authentication required';
      err.errors = ['Authentication required'];
      return res.status(401).json({
          message: err.message,
          statusCode: err.status,
          errors: err.errors
      });
  });
};

const requireRole = (requiredRole) => {
  return (req, res, next) => {
      if (!req.user) {
          // User not logged in
          return res.status(401).json({ message: "Authentication required" });
      }

      if (req.user.role !== requiredRole) {
          // User does not have the required role
          return res.status(403).json({ message: "Forbidden: insufficient permissions" });
      }

      next(); // User has the required role, proceed to the route handler
  };
};

  module.exports = { setTokenCookie, restoreUser, requireAuth };
