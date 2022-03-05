const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try{
    // The convencion is to send in form of " Bearer token... "
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, "secret_text");
    next();
  } catch(err){
    res.status(401).json({
      message: "Autentifikacija neuspešna!"
    });
  }
};
