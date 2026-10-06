const { z } = require('zod');
require('dotenv').config();

const envSchema = z.object({
    NODE_ENV: z
        .enum(['development', 'production', 'test'])
        .default('development'),

    PORT: z.coerce
        .number()
        .int()
        .positive()
        .default(3000),

    DB_HOST: z.string().min(1),
    DB_PORT: z.coerce.number().int().positive().default(3306),
    DB_NAME: z.string().min(1),
    DB_USER: z.string().min(1),
    DB_PASSWORD: z.string().min(1),

    JWT_SECRET: z
        .string()
        .min(64, 'JWT_SECRET debe tener al menos 64 caracteres'),

    JWT_EXPIRES_IN: z.string().default('15m'),
    JWT_ISSUER: z.string().default('zero-trust-backend'),
    JWT_AUDIENCE: z.string().default('zero-trust-frontend'),
    FRONTEND_ORIGIN: z.string().url()
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
    console.error('Error en las variables de entorno:');
    console.error(result.error.flatten().fieldErrors);
    process.exit(1);
}

module.exports = result.data;