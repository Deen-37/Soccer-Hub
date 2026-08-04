import { useEffect } from "react";
import { useState } from "react";
import { supabase } from "./client";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import ViewPost from "./pages/ViewPost";
import EditPost from "./pages/EditPost";
import Navbar from "./components/Navbar";
function App() {
  useEffect(() => {
    const response = async () => {
      const { data, error } = await supabase
        .from("Post")
        .select("*")

      console.log(data)
      console.log(error)
    }
  }, [])




  return (
    <>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreatePost />} />
          <Route path="/post/:id" element={<ViewPost />} />
          <Route path="/edit/:id" element={<EditPost />} />
        </Routes>
      </main>

    </>

  )

}

export default App;