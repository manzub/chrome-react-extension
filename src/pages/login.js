import React, { useContext } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { OpenInNewRounded, Visibility, VisibilityOff, Close } from "@mui/icons-material";
import { Alert, Box, Button, Collapse, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { FirebaseContext } from "../context/firebase";
import * as ROUTES from "../constants/routes";
import { signInWithGoogle } from "../helpers/firebase";

export default function Login() {
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
      await signInWithEmailAndPassword(auth, form.email, form.password);
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
      <h3>LOG IN</h3>
      <p>
        OR <Link to="/signup">CREATE AN ACCOUNT</Link>
      </p>
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
          <TextField value={form.email} onChange={({ target }) => updateForm({ ...form, email: target.value })} required label="Email address" />
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
          <Button onClick={handleSignin} disabled={isInvalid} sx={{ m: 1, width: '95%', fontSize: '20px' }} variant="contained" size="large">LOG IN</Button>
        </div>
      </Box>
      <h5 style={{ textAlign: 'center', marginBottom: '10px' }}><Link>FORGOT PASSWORD ?</Link></h5>
      <Button onClick={handleGoogleSignin} sx={{ m: 1, width: '95%', fontSize: '15px' }} variant="outlined" size="large" startIcon={<OpenInNewRounded />}>Continue with Google</Button>
    </div>
  </div>)
}