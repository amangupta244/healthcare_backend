export const getProfile = (req, res) => {
    // req.user is populated by auth middleware
    res.status(200).json({ success: true, user: req.user });
};