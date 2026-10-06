const bcrypt = require('bcrypt');

// Hash bcrypt fijo utilizado cuando el usuario no existe.
// Evita terminar la autenticación demasiado rápido y reduce
// diferencias de tiempo entre usuarios existentes y no existentes.
const DUMMY_HASH =
    '$2b$12$4E7lmPHm5dGTU6nvDMORweHNOIsG7dNxNAfmK2wNeF7iqjMKyx8C';

class AuthService {
    constructor(userRepository, tokenService) {
        this.userRepository = userRepository;
        this.tokenService = tokenService;
    }

    async login(username, password) {
        const user = await this.userRepository.findByUsername(username);

        // Siempre realizar una comparación bcrypt.
        const hashToCompare = user
            ? user.passwordHash
            : DUMMY_HASH;

        const passwordIsValid = await bcrypt.compare(
            password,
            hashToCompare
        );

        // Respuesta genérica para no revelar si el usuario existe,
        // está desactivado o la contraseña es incorrecta.
        if (
            !user ||
            !user.isActive() ||
            !passwordIsValid
        ) {
            throw new Error('Credenciales inválidas');
        }

        const token = this.tokenService.generate(user);

        return {
            token,
            user: user.toPublic()
        };
    }

    verifyToken(token) {
        return this.tokenService.verify(token);
    }
}

module.exports = AuthService;