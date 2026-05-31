import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Chat from './pages/Chat';
import Quiz from './pages/Quiz';
import Motivator from './pages/Motivator';
import Flashcards from './pages/Flashcards';
import StudyPlan from './pages/StudyPlan';
import Dashboard from './pages/Dashboard';
import Report from './pages/Report';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/"            element={<Landing />} />
        <Route path="/chat"        element={<Chat />} />
        <Route path="/quiz"        element={<Quiz />} />
        <Route path="/motivate"    element={<Motivator />} />
        <Route path="/flashcards"  element={<Flashcards />} />
        <Route path="/study-plan"  element={<StudyPlan />} />
        <Route path="/dashboard"   element={<Dashboard />} />
        <Route path="/report"      element={<Report />} />
      </Routes>
    </Router>
  );
}

export default App;
