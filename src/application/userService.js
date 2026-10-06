class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async getActiveUserById(id) {
        const user = await this.userRepository.findById(id);

        if (!user || !user.isActive()) {
            return null;
        }

        return user.toPublic();
    }
}

module.exports = UserService;