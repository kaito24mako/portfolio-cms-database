function logger(req, res, next) {
  console.log("Logging request");
  return next();
}

module.exports = logger;
