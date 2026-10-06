class User {
    constructor(id, username, passwordHash, role = 'user', active = true) {
        this.id = id;
        this.username = username;
        this.passwordHash = passwordHash;
        this.role = role;
        this.active = active;
    }

    isActive() {
        return this.active === true;
    }

    isAdmin() {
        return this.role === 'admin';
    }

    toPublic() {
        return {
            id: this.id,
            username: this.username,
            role: this.role
        };
    }
}

module.exports = User;