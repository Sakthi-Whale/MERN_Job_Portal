import { useState } from "react";/*here we are importing the useState hook from React to manage the state of the 
email, password, and error messages in the login form.*/
import axios from "axios";

interface LoginProps {
    onLogin: (token: string) => void;
}/*here we are defining a TypeScript interface called LoginProps that specifies the expected props for the Login 
component.*/

function Login({ onLogin }: LoginProps) {
    const [email, setEmail] = useState("");/*setemail is a state variable that holds the value of the email 
input field, and setEmail is a function to update that value.*/
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");/*here we are error state to store any error messages that may occur 
during the login process.*/

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            setError("");

            const response = await axios.post("/users/login", {
                email,
                password,
            });

            const token = response.data.token;

            localStorage.setItem("token", token);

            onLogin(token);

        } catch (error) {
            console.error("Login failed:", error);
            setError("Invalid email or password.");
        }
    };

    return (
        <div className="auth-page">

            <form
                className="auth-form"
                onSubmit={handleSubmit}
            >

                <h2>Login</h2>

                <p className="auth-subtitle">
                    Login to continue to the job portal
                </p>

                <input
                    className="auth-input"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="Email"
                    required
                />

                <input
                    className="auth-input"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Password"
                    required
                />

                <button
                    className="auth-button"
                    type="submit"
                >
                    Login
                </button>

                {error && (
                    <p className="auth-error">
                        {error}
                    </p>
                )}

            </form>

        </div>
    );
}

export default Login;