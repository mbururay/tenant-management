import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {

    const navigate = useNavigate();

    const [username, setUsername] = useState("");

    const [password, setPassword] = useState("");

    const [confirmPassword, setConfirmPassword] = useState("");

    const handleRegister = async (e) => {

        e.preventDefault();

        if (!username.trim()) {

            alert("Username is required.");
            return;

        }

        if (!password) {

            alert("Password is required.");
            return;

        }

        if (password !== confirmPassword) {

            alert("Passwords do not match.");
            return;

        }

        try {

            const res = await fetch(
                "http://localhost:3001/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        username,
                        password
                    })
                }
            );

            const data = await res.json();

            if (!res.ok) {

                alert(data.error);
                return;

            }

            alert("User created successfully.");

            navigate("/login");

        }
        catch (err) {

            console.error(err);

            alert("Registration failed.");

        }

    };

    return (

        <div className="authPage">

            <div className="authCard">

                <h1>Create Account</h1>

                <form onSubmit={handleRegister}>

                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) =>
                            setUsername(e.target.value)
                        }
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                    />

                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) =>
                            setConfirmPassword(e.target.value)
                        }
                    />

                    <button type="submit">
                        Register
                    </button>

                </form>

            </div>

        </div>

    );

};

export default Register;