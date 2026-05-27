// a safety check for requests
// when a request is sent, a safety check is made

const corsOptions = {
  origin: JSON.parse(process.env.CORS_ORIGIN) || "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200,
};

module.exports = corsOptions;
