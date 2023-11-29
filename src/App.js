import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LobbyPage from './pages/LobbyPage';
import CodingInput from './pages/CodingInput';
import SmileyPage from './pages/SmileyPage';
import io from 'socket.io-client';

const App = () => {
  const baseurl = 'https://moveoprojectserver-production.up.railway.app/'
  const [sessionNumber, setSessionNumber] = useState(null); // Use null as the initial state
  const [isLoading, setIsLoading] = useState(true); // Loading state

  useEffect(() => {  
    const socket = io('https://moveoprojectserver-production.up.railway.app');
    socket.on('connect', () => {
      setSessionNumber(socket.id);
      setIsLoading(false); // Set loading to false when session number is available
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="app-container">
      <Router>
        {isLoading ? ( // Render loading state until sessionNumber is available
          <p>Loading...</p>
        ) : (
          <Routes>
            <Route path="/" element={<LobbyPage sessionNumber={sessionNumber} />} />
            <Route path="/Coding/:title" element={<CodingInput sessionNumber={sessionNumber} />} />
            <Route path="/Smiley" element={<SmileyPage/>} />
          </Routes>
        )}
      </Router>
    </div>
  );
};

export default App;
