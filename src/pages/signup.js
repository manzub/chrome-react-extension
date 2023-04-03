import React, { useContext } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Visibility, VisibilityOff, Close } from "@mui/icons-material";
import { Alert, Box, Button, Collapse, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, Snackbar, TextField } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { NavLink, useNavigate } from "react-router-dom";
import { FirebaseContext } from "../context/firebase";
import * as ROUTES from "../constants/routes";

export default function Signup() {
  const navigate = useNavigate();
  const { auth } = useContext(FirebaseContext);

  const [snackbar, setSnackbar] = React.useState(false);
  const [snackMsg, setSnackMsg] = React.useState(null);

  const [open, setOpen] = React.useState(false);
  const [error, setError] = React.useState('');
  const [isLoading, setLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [form, updateForm] = React.useState({ email: '', password: '' });

  const isInvalid = form.email === '' || form.password === '' || isLoading;

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const showError = (error) => {
    setOpen(true);
    setError(error);
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar(false);
  };

  async function handleSignin(e) {
    e.preventDefault();
    setLoading(true);

    try {
      await createUserWithEmailAndPassword(auth, form.email, form.password);
      setSnackMsg('User created successfully!');
      setSnackbar(true);
      setTimeout(() => {
        navigate(ROUTES.HOME)
      }, 4000);
    } catch (error) {
      updateForm({ email: '', password: '' })
      showError(Error(error).message);
      setLoading(false)
    }
  }


  const action = (
    <React.Fragment>
      <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  return (<div className="loginPage">
    <div className="loginHeader">
      <NavLink to="/login">Back to Login</NavLink>
      <h4>Get started with your email</h4>
    </div>
    <div className="loginBody">
      <Box sx={{
        '& .MuiTextField-root': { m: 1, width: '95%' }, marginBottom: '20px'
      }} component="form" noValidate autoComplete="off">
        <div>
          {error && <Collapse in={open}>
            <Alert severity="error" action={
              <IconButton aria-label="close" color="inherit" size="small" onClick={() => setOpen(false)} >
                <Close fontSize="inherit" />
              </IconButton>
            } sx={{ mb: 2 }}>{error}</Alert>
          </Collapse>}

          <div className="form-group" style={{ marginBottom: '30px' }}>
            <TextField value={form.email} onChange={({ target }) => updateForm({ ...form, email: target.value })} required label="Email address" />
          </div>

          <div className="form-group" style={{ marginBottom: '30px' }}>
            <FormControl sx={{ m: 1, width: '95%' }} variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
              <OutlinedInput
                error={form.password === ''}
                value={form.password}
                required
                onChange={({ target }) => updateForm({ ...form, password: target.value })}
                id="outlined-adornment-password"
                type={showPassword ? 'text' : 'password'}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
              />
            </FormControl>
            <h6 style={{ color: '#444' }}>Choose a secure password you will remember, other authorisation methods can be selected later.</h6>
          </div>

          <div className="buttonActions">
            <Button onClick={handleSignin} disabled={isInvalid} sx={{ m: 1, width: '95%', fontSize: '20px' }} variant="contained" size="large">Create an account</Button>
          </div>
        </div>
      </Box>
    </div>
    <Snackbar open={snackbar} autoHideDuration={3000} onClose={handleClose} message={snackMsg} action={action} />
  </div>)
}