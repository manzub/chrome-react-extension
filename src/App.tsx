import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import { HelpRounded, LockClockRounded, LockResetRounded, LogoutRounded } from "@mui/icons-material";
import * as ROUTES from './constants/routes';
import React, { useEffect } from 'react';
import './App.css';
import './pages.css';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { LoggedInRedirect, ProtectedRoute } from './helpers/routes';
import Home from './pages/home';
import Generate from './pages/generate';
import Login from './pages/login';
import useAuthListener from './hooks/use-auth-listener';
import Signup from './pages/signup';
import Create from './pages/create';
import { Auth, signOut } from 'firebase/auth';
import Alerts from './pages/alerts';
import { addDoc, collection, Firestore } from 'firebase/firestore';
import { encryptData } from './encrypt';

interface AppProps {
  auth: Auth,
  firestore: Firestore
}

function App({ auth, firestore }: AppProps) {
  const { user } = useAuthListener();
  const navigate = useNavigate();
  const tabs = ['/', '/generate', '/alerts', '/account'];
  const [value, setValue] = React.useState(0);


  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    if (newValue === 3) signOut(auth);
    else navigate(tabs[newValue]);
  }

  useEffect(() => {
    chrome.tabs && chrome.tabs.query({
      active: true, currentWindow: true
    }, function(tabs) {
      chrome.storage.local.get("saved").then(result => {
        let savedData = [...result.saved];
        if(savedData) {
          // add array items to vault and remove when done
          savedData.slice().reverse().forEach(async function(item) {
            let vaultItem = { ...item, value: encryptData(item.value), owner: user.uid };
            await addDoc(collection(firestore, "vault"), vaultItem);
            savedData.pop();
          })
          chrome.storage.local.set({ saved: [] });
        }
        console.log(result.saved);
      })
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="App">
      <div className="AppContent">
        <Routes>
          <Route path={ROUTES.HOME} element={
            <ProtectedRoute user={user}>
              <Home user={user} />
            </ProtectedRoute>
          } />
          <Route path={ROUTES.GENERATE} element={
            <ProtectedRoute user={user}>
              <Generate />
            </ProtectedRoute>
          } />
          <Route path={ROUTES.CREATE} element={
            <ProtectedRoute user={user}>
              <Create />
            </ProtectedRoute>
          } />
          <Route path={ROUTES.ALERT} element={
            <ProtectedRoute user={user}>
              <Alerts />
            </ProtectedRoute>
          } />

          <Route path="/login" element={
            <LoggedInRedirect user={user} redirectPath={ROUTES.HOME}>
              <Login />
            </LoggedInRedirect>
          } />
          <Route path="/signup" element={
            <LoggedInRedirect user={user} redirectPath={ROUTES.HOME}>
              <Signup />
            </LoggedInRedirect>
          } />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
      {user && <div className='bottomNav'>
        <BottomNavigation value={value} onChange={handleChange}>
          <BottomNavigationAction className='tabItem' icon={<LockClockRounded />} label={<span className='tabItemLink'>Vault</span>} />
          <BottomNavigationAction className='tabItem' icon={<LockResetRounded fontSize='small' />} label={<span className='tabItemLink'>Generate</span>} />
          <BottomNavigationAction className='tabItem' icon={<HelpRounded fontSize='small' />} label={<span className='tabItemLink'>Alert</span>} />
          <BottomNavigationAction className='tabItem' icon={<LogoutRounded fontSize='small' />} label={<span className='tabItemLink'>Logout</span>} />
        </BottomNavigation>
      </div>}
    </div>
  );
}

export default App;
