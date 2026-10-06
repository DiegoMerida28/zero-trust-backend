function createAuthMiddleware(tokenService, userService) {
    return async (req, res, next) => {
        try {
            const authHeader = req.headers.authorization;

            if (!authHeader) {
                return res.status(401).json({
                    error: 'Autenticación requerida'
                });
            }

            const [scheme, token] = authHeader.split(' ');

            if (scheme !== 'Bearer' || !token) {
                return res.status(401).json({
                    error: 'Token inválido'
                });
            }

            // Verificar firma, expiración, issuer y audience del JWT
            const decoded = tokenService.verify(token);

            // Verificar nuevamente al usuario en la base de datos
            const user = await userService.getActiveUserById(decoded.sub);

            if (!user) {
                return res.status(401).json({
                    error: 'Usuario no autorizado'
                });
            }

            req.user = user;

            next();
        } catch (error) {
            return res.status(401).json({
                error: 'Token inválido o expirado'
            });
        }
    };
}

module.exports = createAuthMiddleware;