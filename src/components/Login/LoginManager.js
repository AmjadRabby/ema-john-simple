import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './Firebase.config';

export const initializeLoginFramework = () => {
    if(firebase.apps.length === 0) {
        firebase.initializeApp(firebaseConfig);
    }
   
}

export   const handleGoogleSignIn = () => {
    const googleProvider = new firebase.auth.GoogleAuthProvider();
    return firebase.auth().signInWithPopup(googleProvider)
    .then(res => {
      const {displayName, photoURL, email} = res.user;
      const signedIn = {
        isSignedIn: true,
        name: displayName,
        email: email,
        password: '',
        photo: photoURL,
        success: true,
      };
      return signedIn;    
    })
    .catch(error => {
      console.log(error);
      console.log(error.message);
    })
  }

 
 export const handleFbSignIn = () => {
    const fbProvider = new firebase.auth.FacebookAuthProvider();
    return firebase.auth().signInWithPopup(fbProvider).then(function(result) {
      var token = result.credential.accessToken;      
      var user = result.user;
      user.success = true;
      return user;
           
    }).catch(function(error) {     
      var errorCode = error.code;
      var errorMessage = error.message;     
      console.error(errorCode, errorMessage);
    });
  }


 export const handleSignInOut = () => {
    return firebase.auth().signOut()
    .then(res => {
      const signedOutUser ={
        isSignedIn: false,
        name: '',
        email: '',
        photo: '',
        error: '',
        success: false,
      }
      return signedOutUser;
    })
    .catch(error => {
        //An error happened.
    });
  }

export const createUserWithEmailAndPassword = (name, email, password) => {
    return firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(res => {
      const newUserInfo = res.user;
      newUserInfo.error = '';
      newUserInfo.success = true;
      updateUserName(name);
      return newUserInfo;
    })
    .catch( error => {
      const newUserInfo = {};
      newUserInfo.error = error.message;
      newUserInfo.success = false
      return newUserInfo;
     
    });
}

export const signInWithEmailAndPassword = (email, password) => {
    return firebase.auth().signInWithEmailAndPassword(email, password)
      .then(res => {
          const newUserInfo = res.user;
          newUserInfo.error = '';
          newUserInfo.success = true;  
          return newUserInfo; 
         
      })
      .catch( error => {        
          const newUserInfo = {};
          newUserInfo.error = error.message;
          newUserInfo.success = false
          return newUserInfo;
         
      });
}

const updateUserName = name => {
    const user = firebase.auth().currentUser;

    user.updateProfile({
      displayName: name,
    }).then(function() {
      console.log('user name updated successfully')
    }).catch(function(error) {
      console.log(error)
    });
  }