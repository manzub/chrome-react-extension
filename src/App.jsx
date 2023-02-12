import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import { HelpRounded, LockClockRounded, LockResetRounded, LogoutRounded } from "@mui/icons-material";
import * as ROUTES from './constants/routes';
import React from 'react';
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
import { signOut } from 'firebase/auth';

function App({ auth }) {
  const { user } = useAuthListener();
  const navigate = useNavigate();
  const tabs = ['/', '/generate', '/alert', '/account'];
  const [value, setValue] = React.useState(0);


  const handleChange = (event, newValue) => {
    setValue(newValue);
    if (newValue === 3) signOut(auth);
    else navigate(tabs[newValue]);
  }

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
