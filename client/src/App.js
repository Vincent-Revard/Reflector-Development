import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./components/navigation/header";
import Footer from "./components/navigation/footer";
import { useAuth } from "./context/AuthContext";
import ProfileProvider from "./context/ProfileProvider";

function App() {
  const { user, updateUser, logout } = useAuth()

  return (
    <>
      <ProfileProvider>
      <Header user={user} updateUser={updateUser} logout={logout} />
      <h1>This is my container location for home</h1>;
      <Outlet user={user} updateUser={updateUser} logout={logout}/>
      <Footer />
      </ProfileProvider>
    </>
  );
}

export default App;