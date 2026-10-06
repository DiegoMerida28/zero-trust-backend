const { z } = require('zod');

const loginSchema = z.object({
    username: z
        .string()
        .trim()
        .min(3, 'El usuario debe tener al menos 3 caracteres')
        .max(50, 'El usuario no puede superar los 50 caracteres'),

    password: z
        .string()
        .min(8, 'La contraseña debe tener al menos 8 caracteres')
        .max(128, 'La contraseña es demasiado larga')
});

module.exports = {
    loginSchema
};