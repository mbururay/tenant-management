// ======================================================
// AUTH CONTROLLER
// ======================================================
import pool from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import resend from "../resendClient.js";

// ======================================================
// LOGIN
// ======================================================
// POST /login
export const login = async (req, res) => {
    console.log("Login route hit");

    const { username, password } = req.body;

    try {
        const result = await pool.query(
            `
            SELECT *
            FROM users
            WHERE username = $1
            `,
            [username]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                error: "Invalid credentials"
            });
        }

        const user = result.rows[0];

        const valid = await bcrypt.compare(
            password,
            user.passwordhash
        );

        if (!valid) {
            return res.status(401).json({
                error: "Invalid credentials"
            });
        }

        const token = jwt.sign(
            {
                id: user.userid,
                username: user.username
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        res.json({
            token
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: err.message
        });
    }
};

// ======================================================
// REGISTER
// ======================================================
// POST /register
export const register = async (req, res) => {
    const { username, password } = req.body;

    try {
        const hash = await bcrypt.hash(password, 10);

        await pool.query(
            `
            INSERT INTO users
            (username, passwordHash)
            VALUES ($1, $2)
            `,
            [username, hash]
        );

        res.json({
            success: true
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: err.message
        });
    }
};

// ======================================================
// FORGOT PASSWORD
// ======================================================
// POST /forgot-password
export const forgotPassword = async (req, res) => {
    const { username } = req.body;

    try {
        const userResult = await pool.query(
            `
            SELECT
                userid,
                email
            FROM users
            WHERE username = $1
            `,
            [username]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({
                error: "User not found"
            });
        }

        const user = userResult.rows[0];

        const token = crypto.randomBytes(32).toString("hex");

        await pool.query(
            `
            INSERT INTO password_reset_tokens
            (
                userid,
                token,
                expiresat
            )
            VALUES
            (
                $1,
                $2,
                NOW() + INTERVAL '15 minutes'
            )
            `,
            [user.userid, token]
        );

        const resetLink = `${process.env.FRONTEND_URL}/ResetPassword/${token}`;

        await resend.emails.send({
            from: "onboarding@resend.dev",
            to: user.email,
            subject: "Reset Password",
            html: `
                <h2>Password Reset</h2>
                <p>Click below:</p>
                <a href="${resetLink}">
                    Reset Password
                </a>
            `
        });

        res.json({
            message: "Password reset email sent.",
            resetLink
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: err.message
        });
    }
};

// ======================================================
// RESET PASSWORD
// ======================================================
// POST /reset-password
export const resetPassword = async (req, res) => {
    const { token, password } = req.body;

    try {
        const tokenResult = await pool.query(
            `
            SELECT
                userid,
                expiresat
            FROM password_reset_tokens
            WHERE token = $1
            `,
            [token]
        );

        if (tokenResult.rows.length === 0) {
            return res.status(400).json({
                error: "Invalid reset token"
            });
        }

        const resetRecord = tokenResult.rows[0];

        if (new Date(resetRecord.expiresat) < new Date()) {
            return res.status(400).json({
                error: "Reset token has expired"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.query(
            `
            UPDATE users
            SET passwordHash = $1
            WHERE userId = $2
            `,
            [hashedPassword, resetRecord.userid]
        );

        await pool.query(
            `
            DELETE FROM password_reset_tokens
            WHERE token = $1
            `,
            [token]
        );

        res.json({
            message: "Password reset successfully"
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: err.message
        });
    }
};

// ======================================================
// TEST AUTH
// ======================================================
// GET /test-auth
export const testAuth = async (req, res) => {
    res.json({
        message: "Authenticated",
        user: req.user
    });
};