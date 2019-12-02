import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:4000/api/users')
  .then(res => {
    setUsers(res.data)
  })
  .catch(err => {
    console.log(err);
  })
  }, [])

  return (
    <div className="App">
      {
        users.map(user => 
          <React.Fragment>
            <p>{user.id}</p>
            <p>{user.name}</p>
            <p>{user.bio}</p>
          </React.Fragment>
        )
      }
    </div>
  );
}

export default App;
