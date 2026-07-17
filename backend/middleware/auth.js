import jwt from "jsonwebtoken";

const auth = (req, res, next) => {

    const authHeader = req.headers.authorization;
    const a = 1;

    if (!authHeader) {

        return res.status(401).json({
            error: "Access denied"
        });

    }

    const token = authHeader.split(" ")[1];

    try {

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;

        next();

    }
    catch {

        return res.status(401).json({
            error: "Invalid token"

        });

    }

};

export default auth;