import jwt from "jsonwebtoken";

const auth = (req, res, next) => {

    const authHeader = req.headers.authorization;

    // No Authorization header
    if (!authHeader) {

        return res.status(401).json({
            error: "Authentication required"
        });

    }

    // Make sure it is a Bearer token
    if (!authHeader.startsWith("Bearer ")) {

        return res.status(401).json({
            error: "Invalid authentication format"
        });

    }

    const token = authHeader.split(" ")[1];

    if (!token) {

        return res.status(401).json({
            error: "Authentication token missing"
        });

    }

    try {

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        console.log("TOKEN VALID:", decoded);

        req.user = decoded;

        next();

    } catch (err) {

        console.error("JWT ERROR:", err.message);

        return res.status(401).json({
            error: "Invalid or expired session"
        });

    }

};

export default auth;