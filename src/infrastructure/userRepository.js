const UserRepositoryPort = require('../domain/userRepositoryPort');
const User = require('../domain/user');
const { pool } = require('./db');

class UserRepository extends UserRepositoryPort {
    async findByUsername(username) {
        const [rows] = await pool.execute(
            `SELECT id, username, password_hash, role, is_active
             FROM users
             WHERE username = ?
             LIMIT 1`,
            [username]
        );

        if (rows.length === 0) {
            return null;
        }

        const row = rows[0];

        return new User(
            row.id,
            row.username,
            row.password_hash,
            row.role,
            Boolean(row.is_active)
        );
    }

    async findById(id) {
        const [rows] = await pool.execute(
            `SELECT id, username, password_hash, role, is_active
             FROM users
             WHERE id = ?
             LIMIT 1`,
            [id]
        );

        if (rows.length === 0) {
            return null;
        }

        const row = rows[0];

        return new User(
            row.id,
            row.username,
            row.password_hash,
            row.role,
            Boolean(row.is_active)
        );
    }

    async create() {
        throw new Error(
            'La creación de usuarios no está habilitada para este repositorio'
        );
    }
}

module.exports = UserRepository;
