import jwt from 'jsonwebtoken';
import config from '../config/index.js';

const protect = (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, config.jwtSecret);
            // store id and role on req.user for downstream middleware and controllers
            req.user = { id: decoded.id, role: decoded.role };
            return next();
        } catch {
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

export default protect;
