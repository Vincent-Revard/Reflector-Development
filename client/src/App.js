import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./components/navigation/header";
import Footer from "./components/navigation/footer";

function App() {
  return (
    <>
      <Header />
      <h1>Project Client</h1>;
      <Outlet /> {/* Render the content of nested routes */}
      <Footer />
    </>
  );
}

export default App;