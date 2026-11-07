import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../api/auth";

function SignUp() {
    const [form, setForm] = useState({
        username: "",
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
            await register(form);

            alert("Account created!");
            navigate("/login");
        } catch (error) {
            // Validation error, duplicate user, or server error
            alert(error.message);
        }
    };

    return (
        <div className="page">
            <h1>Create Account</h1>

            <form className="form-card" onSubmit={handleSubmit}>
                <input
                    name="username"
                    placeholder="Username"
                    value={form.username}
                    onChange={handleChange}
                    required
                />

                <br /><br />

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

                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
}

export default SignUp;