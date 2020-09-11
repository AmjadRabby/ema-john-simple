import React, { useState } from 'react';
import { useContext } from 'react';
import { userContext } from '../../App';
import { useHistory, useLocation } from 'react-router-dom';
import { 
  initializeLoginFramework, 
  handleGoogleSignIn, 
  handleSignInOut, 
  handleFbSignIn, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from './LoginManager';

initializeLoginFramework();

function Login() {
  const [newUser, setNewUser] = useState(false);
  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    photo: '',
  });

  const [loggedInUser, setLoggedInUser] = useContext(userContext);
  const history = useHistory();
  const location = useLocation()
  let { from } = location.state || { from: { pathname: "/" } };

  const googleSignIn = () => {
    handleGoogleSignIn()
    .then(res => {
      handleResponse(res, true);
    })
  }
  const fbSignIn = () => {
    handleFbSignIn()
    .then(res => {
      handleResponse(res, true);
    })
  }
  const signInOut = () => {
    handleSignInOut()
    .then(res => {
      handleResponse(res, false);
    })
  }
  const handleResponse = (res, redirect) => {
    setUser(res);
    setLoggedInUser(res);
    if(redirect){
      history.replace(from);
    }
  }

  const handleBlur = (event) => {
    let isFieldValid = true;
    if(event.target.name === 'email'){
      isFieldValid = /\S+@\S+\.\S+/.test(event.target.value);      
    }
    if(event.target.name === 'password'){
      const isPasswordValid = event.target.value.length > 6;
      const passwordHashNumber = /\d{1}/.test(event.target.value);
      isFieldValid = passwordHashNumber && isPasswordValid;
    }
    if(isFieldValid){
      const newUserInfo = {...user};
      newUserInfo[event.target.name] = event.target.value;
      setUser(newUserInfo);
    }
  }

  const handleSubmit = (event) => {
    if(newUser && user.email && user.password){
      createUserWithEmailAndPassword(user.name, user.email, user.password)
      .then(res => {
        handleResponse(res, true);
      })
    }
    if(!newUser && user.email && user.password){
      signInWithEmailAndPassword(user.email, user.password)
      .then(res => {
        handleResponse(res, true);
      })
    }
    event.preventDefault();
  }

  return (
    <div style={{textAlign: 'center'}}>
        <h1>Please Login First</h1>
          <br/>
        <input type="checkbox" onChange={() => setNewUser(!newUser)} name="newUser" id=""/>
        <label htmlFor="newUser"> New User Sign Up</label>
        <br/>
        <form onSubmit={handleSubmit}>
        {newUser && <input type="text" name="name" onBlur={handleBlur} placeholder="Enter Your Name" required/>}
          <br/>
          <input type="email" name="email" onBlur={handleBlur} placeholder="Your Email Address"  required/>
            <br/>
          <input type="password" name="password" onBlur={handleBlur} placeholder="Your Password" required/>
            <br/><br/>
          <input type="submit" value={newUser ? 'Sign up' : 'Sign in'}/>
        </form>
        <p style={{color: "red"}}>{user.error}</p>
        {
          user.success && <p style={{color: "green"}}>User {newUser? 'created' : 'Logged In'} successfully</p>
        }
        {
          user.isSignedIn ?  <button onClick={signInOut}>Sign Out</button> :  
          <button onClick={googleSignIn}>Google</button>
        }
        <button onClick={fbSignIn}>Facebook</button>
    </div>
  );
}

export default Login;
