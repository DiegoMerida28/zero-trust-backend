class UserController {
    dashboard = async (req, res) => {
        return res.status(200).json({
            message: 'Acceso autorizado al Dashboard',
            user: req.user
        });
    };
}

module.exports = UserController;