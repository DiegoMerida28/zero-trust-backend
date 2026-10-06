const jwt = require('jsonwebtoken');
const env = require('../config/env');

class TokenService {
    generate(user) {
        return jwt.sign(
            {
                sub: String(user.id),
                username: user.username,
                role: user.role
            },
            env.JWT_SECRET,
            {
                expiresIn: env.JWT_EXPIRES_IN,
                issuer: env.JWT_ISSUER,
                audience: env.JWT_AUDIENCE,
                algorithm: 'HS256'
            }
        );
    }

    verify(token) {
        return jwt.verify(token, env.JWT_SECRET, {
            issuer: env.JWT_ISSUER,
            audience: env.JWT_AUDIENCE,
            algorithms: ['HS256']
        });
    }
}

module.exports = TokenService;