import { Tab, Tabs } from '@mui/material';
import { HelpRounded, LockClockRounded, LockResetRounded, PersonRounded } from "@mui/icons-material";
import * as ROUTES from './constants/routes';
import React from 'react';
import './App.css';
import './pages.css';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { LoggedInRedirect, ProtectedRoute } from './helpers/routes';
import Home from './pages/home';
import Page404 from './pages/page404';
import Generate from './pages/generate';
import Login from './pages/login';
import useAuthListener from './hooks/use-auth-listener';
import Signup from './pages/signup';

function App() {
  const { user } = useAuthListener();
  const navigate = useNavigate();
  const tabs = ['/', '/generate', '/alert', '/account'];
  const [value, setValue] = React.useState(0);


  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    navigate(tabs[newValue]);
  }

  return (
    <div className="App">
      <div className="AppContent">
        <Routes>
          <Route path={ROUTES.HOME} element={
            <ProtectedRoute user={user}>
              <Home />
            </ProtectedRoute>
          } />
          <Route path={ROUTES.GENERATE} element={
            <ProtectedRoute user={user}>
              <Generate />
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
          <Route path="*" element={<Page404 />} />
        </Routes>
      </div>
      { user &&  <div className='bottomNav'>
        <Tabs value={value} onChange={handleChange}>
          <Tab className='tabItem' icon={<LockClockRounded />} label={<span className='tabItemLink'>Vault</span>} />
          <Tab className='tabItem' icon={<LockResetRounded fontSize='small' />} label={<span className='tabItemLink'>Generate</span>} />
          <Tab className='tabItem' icon={<HelpRounded fontSize='small' />} label={<span className='tabItemLink'>Alert</span>} />
          <Tab className='tabItem' icon={<PersonRounded fontSize='small' />} label={<span className='tabItemLink'>Account</span>} />
        </Tabs>
      </div>}
    </div>
  );
}

export default App;
