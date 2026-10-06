const { loginSchema } = require('./authValidator');

class AuthController {
    constructor(authService) {
        this.authService = authService;
    }

    login = async (req, res, next) => {
        try {
            const validation = loginSchema.safeParse(req.body);

            if (!validation.success) {
                return res.status(400).json({
                    error: 'Solicitud inválida'
                });
            }

            const { username, password } = validation.data;

            const result = await this.authService.login(
                username,
                password
            );

            return res.status(200).json({
                message: 'Autenticación correcta',
                token: result.token,
                user: result.user
            });
        } catch (error) {
            if (error.message === 'Credenciales inválidas') {
                return res.status(401).json({
                    error: 'Credenciales inválidas'
                });
            }

            next(error);
        }
    };
}

module.exports = AuthController;