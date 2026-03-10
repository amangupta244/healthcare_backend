// utility to wrap async handlers and forward errors to express error middleware
export const asyncHandler = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
