import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import '../styles/Login.css';

function Login() {
  const [username, setusername]=useState('')
  const [password, setpassword]=useState('')
  const navigate = useNavigate();
  const login = async (e) => {
    e.preventDefault();
    try {
      console.log(username, password);
      const response = await axios.post('http://localhost:5000/login', {
        username,
        password,
      });
  
      console.log("Response Received:", response.data.message, 'Voter_id', response.data.v_id);
      const v_id = response.data.v_id;
  
      const response2 = await axios.post('http://localhost:5000/checkuser', {
        v_id,
      });
  
      const isValid = response2.data.boolean === "true";
      console.log(isValid);
      if (isValid) {
        localStorage.setItem('Voter_id', response.data.v_id);
        navigate('/');
      }
  
    } catch (err) {
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Server responded with error status:", err.response.status);
        console.error("Error message from server:", err.response.data.message);
        alert( "\nError message: " + err.response.data.message);
      } else if (err.request) {
        // The request was made but no response was received
        console.error("No response received from the server");
        alert("No response received from the server");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error setting up the request:", err.message);
        alert("Error setting up the request: " + err.message);
      }
    }
  }
  
  function handlechange(e, setter){
    setter(e.target.value)
  }
  return (
    <div className="login">
      <h1>Login</h1>
      <form className="login-form" onSubmit={login}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input type="text" id="username" name="username" placeholder="Enter your name" value={username} onChange={(e)=> handlechange(e, setusername)} />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" placeholder="Enter your password" value={password} onChange={(e)=>handlechange(e, setpassword)}/>
        </div>
        <button type="submit">Login</button>
        <div>
           <small>Don't have a account ? </small><a href="/signup">Signup</a>
        </div>
      </form>
    </div>
  );
}

export default Login;
