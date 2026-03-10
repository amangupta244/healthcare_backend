import logger from '../config/logger.js';

const authorize = (...roles) => {
    return (req, res, next) => {
        // req.user is set by auth middleware after JWT verification; trust the role it carries.
        const userRole = req.user && req.user.role;

        if (!userRole) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        if (!roles.includes(userRole)) {
            logger.warn('Unauthorized access attempt: role %s tried to access route requiring %s', userRole, roles.join('/'));
            return res.status(403).json({
                message: `User role ${userRole} is not authorized to access this route`,
            });
        }

        next();
    };
};

export default authorize;
