import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./components/navigation/header";
import Footer from "./components/navigation/footer";
import { useAuth } from "./context/AuthContext";




function App() {
  const { user, updateUser, logout } = useAuth()


  return (
    <>
      <Header user={user} updateUser={updateUser} logout={logout}/>
      <Outlet user={user} updateUser={updateUser} logout={logout}/>
      <Footer />
    </>
  );
}

export default App;