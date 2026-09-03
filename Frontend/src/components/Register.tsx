import { useState } from "react";
import axios from "axios";

function Register() {
    const [name, setName] = useState("");/*setName is a state variable that holds the value of the name input field, and setName is a function to 
    update that value.*/
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            setError("");
            setMessage("");

            const response = await axios.post("/users/register", {
                name,
                email,
                password,
            });

            setMessage(response.data.message);

            setName("");
            setEmail("");
            setPassword("");

        } catch (error) {
            console.error("Registration failed:", error);
            setError("Registration failed.");
        }
    };

    return (
        <div className="auth-page">

            <form
                className="auth-form"
                onSubmit={handleSubmit}
            >

                <h2>Register</h2>

                <p className="auth-subtitle">
                    Create your account to apply for jobs
                </p>

                <input
                    className="auth-input"
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Name"
                    required
                />

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
                    Register
                </button>

                {message && (
                    <p className="auth-success">
                        {message}
                    </p>
                )}

                {error && (
                    <p className="auth-error">
                        {error}
                    </p>
                )}

            </form>

        </div>
    );
}

export default Register;