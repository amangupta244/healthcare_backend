// centralized error-handling middleware
// should be added after all routes in app.js

import logger from '../config/logger.js';

// eslint-disable-next-line no-unused-vars -- Express requires 4-arg signature for error handlers
export const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';
    let status = statusCode;
    const details = err.details || null;

    // handle mongoose duplicate key error
    if (err.code === 11000) {
        status = 409;
        message = 'Resource already exists';
    }

    // log error with request context
    logger.error('%s %s %d - %s', req.method, req.originalUrl, status, err.stack || err);

    res.status(status).json({
        success: false,
        message,
        ...(details && { details })
    });
};
