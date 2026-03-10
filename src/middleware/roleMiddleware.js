import User from "../models/User.js";

const authorize = (...roles) => {
    return async (req, res, next) => {
        try {
            // req.user is set by auth middleware and contains {id, role}
            const userId = req.user && req.user.id;
            const user = await User.findById(userId);

            if (!user) {
                return res.status(401).json({ message: "User not found" });
            }

            if (!roles.includes(user.role)) {
                return res.status(403).json({
                    message: `User role ${user.role} is not authorized to access this route`
                });
            }

            next();
        } catch (error) {
            console.error("Authorization error:", error);
            res.status(500).json({ message: "Server error during authorization" });
        }
    };
};

export default authorize;
