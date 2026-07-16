import { useState } from "react";

import "./ForgetPassword.css";


const ForgetPassword = () => {

    const [username, setUsername] = useState("");

    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!username.trim()) {

            alert("Please enter your username.");

            return;

        }

        try {

            const res = await fetch(
                "http://localhost:3001/forgot-password",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        username
                    })
                }
            );

            const data = await res.json();

            if (!res.ok) {

                throw new Error(
                    data.error || "Request failed."
                );

            }

            setMessage(
                "If the username exists, a password reset email has been sent."
            );

            setUsername("");

        }
        catch (err) {

            console.error(err);

            alert(err.message);

        }

    };

    return (

        <div className="forgotPasswordPage">

            

            <div className="forgotPasswordCard">

                <h1>
                    Forgot Password
                </h1>

                <p>
                    Enter your username and we'll send a password reset email to the address linked to your account.
                </p>

                <form onSubmit={handleSubmit}>

                    <input
                        type="text"
                        className="forgotPasswordInput"
                        placeholder="Username"
                        value={username}
                        onChange={(e) =>
                            setUsername(e.target.value)
                        }
                    />

                    <button
                        type="submit"
                        className="forgotPasswordButton"
                    >
                        Send Reset Link
                    </button>

                </form>

                {message && (

                    <div className="forgotPasswordMessage">

                        {message}

                    </div>

                )}

            </div>

        </div>

    );

};

export default ForgetPassword;