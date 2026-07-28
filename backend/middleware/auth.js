import jwt from "jsonwebtoken";

const auth = (req, res, next) => {

    const authHeader = req.headers.authorization;


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

        console.log("TOKEN VALID:", decoded);

        req.user = decoded;

        next();

    }
    catch (err) {

        console.error("JWT ERROR:", err.message);

        return res.status(401).json({
            error: err.message
        });

    }

};

export default auth;