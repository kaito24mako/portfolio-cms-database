function auth(req, res, next) {
  console.log("Authorising");
  return next();
}

module.exports = auth;
