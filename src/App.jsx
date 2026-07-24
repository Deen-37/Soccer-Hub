import { useEffect } from "react";
import { useState } from "react";
import { supabase } from "./client";

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

    <h1> Soccer </h1 >
  )

}

export default App;