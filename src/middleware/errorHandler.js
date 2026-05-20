const debugApiError = require("debug")("app:ApiErrorHandler:error");

const ApiError = require("../utils/ApiError");

function apiErrorHandler(err, req, res, next) {
  if (err instanceof ApiError) {
    return res.status(err.code).json(err.message);
  } else {
    debugApiError(err);
    res.status(500).json({
      message: "Something went wrong...try again later",
    });
  }
}

module.exports = apiErrorHandler;
