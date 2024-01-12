import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './Screen/Home';
import Results from './Screen/Results';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/results" element={<Results  />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
