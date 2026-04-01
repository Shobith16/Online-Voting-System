const jwt = require('jsonwebtoken');
const User = require('../models/user');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Access denied. Invalid token format.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

const verifyAdmin = async (req, res, next) => {
  verifyToken(req, res, async () => {
    try {
      const user = await User.findOne({ v_id: req.user.v_id });
      if (user && user.isAdmin) {
        next();
      } else {
        return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
      }
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error.' });
    }
  });
};

module.exports = { verifyToken, verifyAdmin };
