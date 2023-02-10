import React, { useContext } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { OpenInNewRounded, Visibility, VisibilityOff, Close } from "@mui/icons-material";
import { Alert, Box, Button, Collapse, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { FirebaseContext } from "../context/firebase";
import * as ROUTES from "../constants/routes";
import { signInWithGoogle } from "../helpers/firebase";

export default function Signup() {
  const navigate = useNavigate();
  const { auth, firestore } = useContext(FirebaseContext);

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

  async function handleSignin(e) {
    e.preventDefault();
    setLoading(true);

    try {
      await createUserWithEmailAndPassword(auth, form.email, form.password);
      navigate(ROUTES.HOME)
    } catch (error) {
      updateForm({ email: '', password: '' })
      showError(Error(error).message);
      setLoading(false)
    }

  }

  async function handleGoogleSignin() {
    try {
      await signInWithGoogle(auth, firestore, showError);
      navigate(ROUTES.HOME);
    } catch (error) {
      
    }
  }

  return (<div className="loginPage">
    <div className="loginHeader">
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
            <h6 style={{ padding: '0px 10px', color: '#444' }}>To create an account please use an email that you trust as verification and backup would require this email address.</h6>
          </div>

          <div className="form-group" style={{ marginBottom: '30px' }}>
            <FormControl sx={{ m: 1, width: '95%' }} variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password">Master Password</InputLabel>
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
            <h6 style={{ color: '#444' }}>A password to validate your account after signup, other validation methods can be selected later.</h6>
          </div>

          <div className="buttonActions">
            <Button onClick={handleSignin} disabled={isInvalid} sx={{ m: 1, width: '95%', fontSize: '20px' }} variant="contained" size="large">Create an account</Button>
            <Button onClick={handleGoogleSignin} sx={{ m: 1, width: '95%', fontSize: '15px' }} variant="outlined" size="large" startIcon={<OpenInNewRounded />}>Continue with Google</Button>
          </div>
        </div>
      </Box>
    </div>
  </div>)
}