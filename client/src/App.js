import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./components/navigation/header";
import Footer from "./components/navigation/footer";
import { useAuth } from "./context/AuthContext";

function App() {
  const { user, updateUser } = useAuth()

  return (
    <>
      <Header user={user} updateUser={updateUser}/>
      <h1>This is my container location for home</h1>;
      <Outlet user={user} updateUser={updateUser} />
      <Footer />
    </>
  );
}

export default App;