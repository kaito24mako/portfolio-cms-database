function admin(req, res, next) {
  //* Checks our decoded token = req.user from our auth middleware.
  //! So if we manually change a user to isAdmin, we need a new token.
  if (!req.user.isAdmin) {
    return res.status(403).send("Access denied");
  }
  next();
}

module.exports = admin;
