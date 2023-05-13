export const validateJsonSyntax = (err, req, res, next) => {
    if (err instanceof SyntaxError && err.type === 'entity.parse.failed') {
        return res.status(400).json({ message: 'Invalid JSON payload' });
    }
    next();
};
