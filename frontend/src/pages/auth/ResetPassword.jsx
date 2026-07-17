import { useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./ResetPassword.css";
import { authHeaders } from "../../api";

const ResetPassword = () => {
    const navigate = useNavigate();

    const API_URL = import.meta.env.VITE_API_URL;

    const { token } = useParams();

    const [newPassword, setNewPassword] = useState("");

    const [confirmPassword, setConfirmPassword] = useState("");

    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!newPassword || !confirmPassword) {

            alert("Please complete all fields.");

            return;

        }

        if (newPassword !== confirmPassword) {

            alert("Passwords do not match.");

            return;

        }

        try {

            const res = await fetch(
                `${API_URL}/reset-password`,
                {
                    method: "POST",

                    headers: authHeaders(),

                    body: JSON.stringify({
                        token,
                        password: newPassword
                    })
                }
            );

            const data = await res.json();

            if (!res.ok) {

                throw new Error(
                    data.error || "Password reset failed."
                );

            }

            setMessage(
                "Password reset successfully. You may now log in."
            );

            setNewPassword("");
            setConfirmPassword("");
            navigate("/Login")

        }
        catch (err) {

            console.error(err);

            alert(err.message);

        }

    };

    return (

        <div className="resetPasswordPage">

            

            <div className="resetPasswordCard">

                <h1>
                    Reset Password
                </h1>

                <p>
                    Enter your new password below.
                </p>

                <form onSubmit={handleSubmit}>

                    <input
                        type="password"
                        className="resetPasswordInput"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) =>
                            setNewPassword(e.target.value)
                        }
                    />

                    <input
                        type="password"
                        className="resetPasswordInput"
                        placeholder="Confirm New Password"
                        value={confirmPassword}
                        onChange={(e) =>
                            setConfirmPassword(e.target.value)
                        }
                    />

                    <button
                        type="submit"
                        className="resetPasswordButton"
                    >
                        Reset Password
                    </button>

                </form>

                {message && (

                    <div className="resetPasswordMessage">

                        {message}

                    </div>

                )}

            </div>

        </div>

    );

};

export default ResetPassword;