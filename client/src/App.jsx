import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import ViewPost from "./pages/ViewPost";
import EditPost from "./pages/EditPost";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
function App() {
  // Logged-in user's JWT (null when logged out).
  // Starts from localStorage so users stay logged in after a refresh.
  const [token, setToken] = useState(localStorage.getItem("token"));

  // Log out: forget the token in the browser and in React state
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <>
      <Navbar token={token} logout={logout} />
      <main className="container">
        <Routes>
          {/* Private pages: only for logged-in users */}
          <Route path="/" element={<ProtectedRoute token={token}><Home /></ProtectedRoute>} />
          <Route path="/create" element={<ProtectedRoute token={token}><CreatePost /></ProtectedRoute>} />
          <Route path="/post/:id" element={<ProtectedRoute token={token}><ViewPost /></ProtectedRoute>} />
          <Route path="/edit/:id" element={<ProtectedRoute token={token}><EditPost /></ProtectedRoute>} />

          {/* Public pages */}
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login setToken={setToken} />} />
        </Routes>
      </main>

    </>

  )

}

export default App;