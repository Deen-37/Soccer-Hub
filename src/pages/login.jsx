import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
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

        const response = await fetch("http://localhost:3000/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(form)
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.error);
            return;
        }

        // Save JWT for authenticated requests
        localStorage.setItem("token", data.token);

        alert("Login successful!");
        navigate("/");
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