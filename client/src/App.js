import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./components/navigation/header";
import Footer from "./components/navigation/footer";
import { useAuth } from "./context/AuthContext";
import { Box } from '@mui/material';




function App() {
  const { user, updateUser, logout } = useAuth()


  return (
    
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header user={user} updateUser={updateUser} logout={logout}/>
      <Outlet user={user} updateUser={updateUser} logout={logout}/>
      <Box sx={{ mt: 'auto' }}>
        <Footer />
      </Box>
    </Box>
  );
}

export default App;