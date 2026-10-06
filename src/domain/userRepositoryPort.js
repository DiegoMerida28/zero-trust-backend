class UserRepositoryPort {
    async findByUsername(username) {
        throw new Error('Método findByUsername() no implementado');
    }

    async findById(id) {
        throw new Error('Método findById() no implementado');
    }

    async create(user) {
        throw new Error('Método create() no implementado');
    }
}

module.exports = UserRepositoryPort;