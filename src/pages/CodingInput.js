import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Highlighter } from "../services/Highlighter";
import 'highlight.js/styles/vs.css';
import './CodingInput.css'
import io from 'socket.io-client';

const baseurl = 'https://moveoprojectserver-production.up.railway.app/'
const socket = io('https://moveoprojectserver-production.up.railway.app');


const CodingInput = ({  sessionNumber }) => {
  const navigate = useNavigate() // React hook for navigation
  const effectrun = useRef(false) // Ref to manage useEffect logic
  const { title } = useParams() // Get URL parameters using React Router
  const [code, setCodeContent] = useState('') // State for code content
  const [isMentor, setIsMentor] = useState(true) // State for mentor status

  useEffect(() => {
    if (effectrun.current === false ) {

    // Fetch mentor status based on title and sessionNumber
    fetch(`${baseurl}updateMentor`, {method: 'POST', headers: {'Content-Type': 'application/json',},
      body: JSON.stringify({ title: title, sessionId: sessionNumber }),
    })
      .then((response) => {if (!response.ok) {throw new Error('Failed to fetch mentor status')}
        return response.json();
      })
      .then((data) => {setIsMentor(data.updated)})
      .catch((error) => {console.error('Error fetching mentor status:', error)});
    
      // Fetch code content based on the title
    fetch(`${baseurl}code/${title}`)
      .then((response) => {if (!response.ok) {throw new Error('Failed to fetch code')}
        return response.json();
      })
      .then((data) => {setCodeContent(data.code)
      })
      .catch((error) => {console.error('Error fetching code:', error);
      });
    }
    return () => {
      // Check and update mentor on component unmount
      fetch(`${baseurl}checkAndUpdateMentor`, {method: 'POST', headers: {'Content-Type': 'application/json',},
        body: JSON.stringify({ title: title, sessionId: sessionNumber }),
      })
        .then((response) => {
          if (!response.ok) {throw new Error('Failed to check and update mentor')}
          return response.json();
        })
        .then((data) => {console.log(data.message); // Display the server response message
        })
        .catch((error) => {console.error('Error checking and updating mentor:', error);
        });
      effectrun.current = true
    };
  }, [title, sessionNumber]);
  
  // useEffect hook to set up event listeners for WebSocket communication
  useEffect(() => {
    // Event listener for 'textUpdated' event from the server
    socket.on('textUpdated', (updatedCode) => {setCodeContent(updatedCode)});
  }, []);    

  // Function to handle textarea input change
  const handleInputChange = (e) => {
    setCodeContent(e.target.value);
    socket.emit('textChanged', e.target.value);
  };

  // Function to handle submission of code by student
  const handleSubmission = () => {
  fetch(`${baseurl}updateCode`, {method: 'POST', headers: {'Content-Type': 'application/json',},
      body: JSON.stringify({title: title, code: code}),
  })
  .then((response) => {
      if (!response.ok) {throw new Error('Failed to update code')}
      return response.json();
  })
  .then((data) => {
    if (data.message === 'Match the solution') {navigate('/Smiley')}
     else {navigate('/')}    
  })
  .catch((error) => {console.error('Error updating code:', error)});  
  };

  return (
    <div>
      <h2 style={{ textAlign: 'center' }}> {isMentor ? 'Hello mentor' : 'Hello student'}</h2>
      <h2 name='title' style={{ textAlign: 'center' }}>{title}</h2>  
    <div className='textarea-container'>      
      <div className='highlighter'>  
      <Highlighter className="highlighter">
          {code}
        </Highlighter>
        </div>  
       {!isMentor && (
        <div>
          <textarea name='code' placeholder="Enter your code" value={code} onChange={handleInputChange} readOnly={isMentor} className="textarea"/>
        <button className='button' onClick={handleSubmission}>Submit</button> 
        </div>
        )}
    </div>
    </div>
  );
};

export default CodingInput;