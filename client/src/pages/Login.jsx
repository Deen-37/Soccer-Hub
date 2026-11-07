import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/auth";

// setToken comes from App, so logging in updates the whole app right away
function Login({ setToken }) {
    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const navigate = useNavigate();

    const handleChange = (event) => {
        setForm({
            ...form,
            [event.target.name]: event.target.value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const data = await login(form);

            // Save JWT for authenticated requests
            localStorage.setItem("token", data.token);
            setToken(data.token); // tell App the user is logged in

            alert("Login successful!");
            navigate("/");
        } catch (error) {
            // Wrong email/password or server error
            alert(error.message);
        }
    };

    return (
        <div className="page">
            <h1>Login</h1>

            <form className="form-card" onSubmit={handleSubmit}>
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    required
                />

                <br /><br />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    required
                />

                <br /><br />

                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default Login;