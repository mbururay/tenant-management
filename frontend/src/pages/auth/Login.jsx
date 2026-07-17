import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { authHeaders } from "../../api";

const Login = () => {

    const navigate = useNavigate();

    const [username, setUsername] = useState("");

    const [password, setPassword] = useState("");

    const API_URL = import.meta.env.VITE_API_URL;

    const handleLogin = async (e) => {

        e.preventDefault();

        try {

            const res = await fetch(
                `${API_URL}/login`,
                {
                    method: "POST",
                    headers: authHeaders(),
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

            localStorage.setItem(
                "token",
                data.token
            );

            navigate("/");

        }
        catch (err) {

            console.error(err);

            alert("Login failed.");

        }

    };

    return (

        <div className="loginPage">

            <div className="loginCard">

                <h1 className="loginTitle">
                    Serene Homes
                </h1>

                <p className="loginSubtitle">
                    Property Management System
                </p>

                <form
                    className="loginForm"
                    onSubmit={handleLogin}
                >

                    <input
                        className="loginInput"
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) =>
                            setUsername(e.target.value)
                        }
                    />

                    <input
                        className="loginInput"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                    />

                    <button
                        className="loginButton"
                        type="submit"
                    >
                        Login
                    </button>

                </form>

                <p
                    className="loginLink"
                    onClick={() =>
                        navigate("/ForgetPassword")
                    }
                >
                    Forgot Password?
                </p>

                <p
                    className="loginLink"
                    onClick={() =>
                        navigate("/register")
                    }
                >
                    New User? Register Account
                </p>

            </div>

        </div>

    );

};

export default Login;