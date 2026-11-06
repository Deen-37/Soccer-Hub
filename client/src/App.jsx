
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import ViewPost from "./pages/ViewPost";
import EditPost from "./pages/EditPost";
import Navbar from "./components/Navbar";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
function App() {




  return (
    <>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreatePost />} />
          <Route path="/post/:id" element={<ViewPost />} />
          <Route path="/edit/:id" element={<EditPost />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>

    </>

  )

}

export default App;