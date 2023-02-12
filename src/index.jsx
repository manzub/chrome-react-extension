import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider as ReduxProvider } from 'react-redux';
import store from './redux';
import { BrowserRouter } from 'react-router-dom';
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { FirebaseContext } from './context/firebase';

const firebaseConfig = {
  apiKey: "AIzaSyC2WHxn-gNBHV1EBxhlH6qe_v9xx6xNDUs",
  authDomain: "react-extension-passvault.firebaseapp.com",
  projectId: "react-extension-passvault",
  storageBucket: "react-extension-passvault.appspot.com",
  messagingSenderId: "563882686482",
  appId: "1:563882686482:web:1542280d09bcae74ab40cb",
  measurementId: "G-LCG1PWYM3D"
};

const firebase = initializeApp(firebaseConfig);
const firestore = getFirestore(firebase);
const auth = getAuth(firebase);

const { Provider } = FirebaseContext;


ReactDOM.render(
  <React.StrictMode>
    <Provider value={{ firebase, auth, firestore }}>
      <ReduxProvider store={store}>
        <BrowserRouter>
          <App auth={auth} />
        </BrowserRouter>
      </ReduxProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
