const rateLimit = require("express-rate-limit");

const { logEvents } = require("./logger");

const loginLimiter = rateLimit({
  windowMs: 60 * 1000, //  1 minute
  limit: 5, //  Limit each IP to 5 requests per `window` (here, per 1 minute).
  standardHeaders: true, //  Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, //  Disable the `X-RateLimit-*` headers
  message: {
    message:
      "Too many login attempts from this IP, please try again after 60 second pause",
  },
  handler: (req, res, next, options) => {
    logEvents(
      `Too Many Requests: ${options.message.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
      "errLog.log"
    );
    res.status(options.statusCode).send(options.message);
  },
});

module.exports = loginLimiter;
