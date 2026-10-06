const express = require('express');

const AuthService = require('../application/authService');
const UserService = require('../application/userService');
const UserRepository = require('../infrastructure/userRepository');
const TokenService = require('../infrastructure/tokenService');

const AuthController = require('./authController');
const UserController = require('./userController');

const createAuthMiddleware = require('../middlewares/authMiddleware');
const loginRateLimiter = require('../middlewares/loginRateLimiter');

const router = express.Router();

// Adaptadores de infraestructura
const userRepository = new UserRepository();
const tokenService = new TokenService();

// Casos de uso
const authService = new AuthService(
    userRepository,
    tokenService
);
const userService = new UserService(userRepository);

// Adaptadores de entrada
const authController = new AuthController(authService);
const userController = new UserController();

// Middleware de autenticación
const authMiddleware = createAuthMiddleware(
    tokenService,
    userService
);

// Ruta pública
router.post(
    '/auth/login',
    loginRateLimiter,
    authController.login
);

// Ruta protegida para consultar la sesión actual
router.get(
    '/auth/me',
    authMiddleware,
    authController.me
);

// Ruta protegida del Dashboard
router.get(
    '/dashboard',
    authMiddleware,
    userController.dashboard
);

module.exports = router;