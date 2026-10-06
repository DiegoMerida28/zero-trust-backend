function errorMiddleware(error, req, res, next) {
    console.error('Error interno:', error.message);

    if (res.headersSent) {
        return next(error);
    }

    return res.status(500).json({
        error: 'Error interno del servidor'
    });
}

module.exports = errorMiddleware;