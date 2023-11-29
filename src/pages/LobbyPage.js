import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Typography, List, ListItem, ListItemText, Paper } from '@mui/material';
import './LobbyPage.css'; // Import the associated CSS file

const LobbyPage = ({sessionNumber}) => {
  const baseurl = 'https://moveoprojectserver-production.up.railway.app/'
  const [codeBlocks, setCodeBlocks] = useState([]);

  useEffect(() => {
    fetchTitles();
  }, []);

  const fetchTitles = async () => {
    try {
      const response = await fetch(`${baseurl}titles`); 
      if (!response.ok) {throw new Error('Failed to fetch titles')}
      const data = await response.json();
      setCodeBlocks(data);
    } catch (error) {console.error('Error fetching titles:', error)}
  };
  
  return (
    <Paper elevation={3} className="lobby-container">
      <Typography variant="h4" gutterBottom className="center-text">
        Choose a Code Block {sessionNumber}
      </Typography>
      <List component="nav">
        {codeBlocks.map((block, index) => (
          <ListItem key={index} button component={Link} to={`/Coding/${block.title}`} className="code-block-item">
            <ListItemText primary={block.title} />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default LobbyPage;
