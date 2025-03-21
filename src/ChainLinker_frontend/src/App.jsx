import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Redirector from "./pages/Redirector";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:id" element={<Redirector />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
