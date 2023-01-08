const jwt = require('jsonwebtoken');
const { error } = require('../helper/baseResponse');

const authenticate = (req, res, next) => {
  const userToken = req.headers.authorization;
  if (!userToken) {
    return res.status(401).json(error('Please authenticate using valid token', 401));
  }

  try {
    const token = userToken.split(' ');
    const JWT_TOKEN = token[1];
    const data = jwt.verify(JWT_TOKEN, process.env.JWT_KEY);
    req.user = data.user;
    next();
  } catch (err) {
    return res.status(401).json(error(err.message, 401));
  }
};

module.exports = authenticate;
