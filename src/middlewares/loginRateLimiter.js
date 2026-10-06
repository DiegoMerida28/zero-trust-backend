const { rateLimit } = require('express-rate-limit');

const loginRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,

    standardHeaders: 'draft-8',
    legacyHeaders: false,

    skipSuccessfulRequests: true,

    message: {
        error: 'Demasiados intentos de autenticación. Intenta nuevamente más tarde.'
    }
});

module.exports = loginRateLimiter;