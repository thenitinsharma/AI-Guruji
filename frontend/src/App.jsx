import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Chat from './pages/Chat';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Chat />} />
        {/* We will add Quiz, Dashboard, Landing later */}
      </Routes>
    </Router>
  );
}

export default App;
