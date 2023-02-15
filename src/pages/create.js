/* eslint-disable no-undef */
import { ArrowBackRounded, Visibility, VisibilityOff, Close } from '@mui/icons-material';
import { Box, Button, Collapse, Alert, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField, Snackbar } from '@mui/material';
import { addDoc, collection } from 'firebase/firestore';
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FirebaseContext } from '../context/firebase';
import { encryptData } from '../encrypt';
import useAuthListener from '../hooks/use-auth-listener';

export default function Create() {
  const navigate = useNavigate();
  const { user } = useAuthListener();
  const { firestore } = useContext(FirebaseContext);

  const [snackbar, setSnackbar] = React.useState(false);
  const [snackMsg, setSnackMsg] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [error, setError] = React.useState('');
  const [isLoading, setLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [form, updateForm] = React.useState({ favIconUrl: '', web_url: '', email: '', value: '' });

  const isInvalid = form.web_url === '' || form.email === '' || form.value === '' || isLoading;

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const showError = (error) => {
    setOpen(true);
    setError(error);
  }

  async function addToVault(e) {
    e.preventDefault();
    setLoading(true)

    try {
      await addDoc(collection(firestore, "vault"), { ...form, owner: user.uid })
      setLoading(false);
      setSnackbar(true);
      setSnackMsg(`Added ${form.web_url} to vault!`)
    } catch(error) {
      setLoading(false);
      setSnackbar(false);
      setSnackMsg("");
      showError(error.message);
    }
  }

  const action = (
    <React.Fragment>
      <IconButton size="small" aria-label="close" color="inherit" onClick={() => setSnackbar(false)}>
        <Close fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  return (<div>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <IconButton onClick={() => navigate('/')}>
        <ArrowBackRounded />
      </IconButton>
      <h4>Add to PassVault?</h4>
    </div>
    {/* TODO: chrome get current tab */}
    <Box sx={{ backgroundColor: '#fff', width: '95%', borderRadius: '5px', padding: '10px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <img src={`${form.favIconUrl}`} alt='' style={{ height: '54px' }} />
        <TextField sx={{ flex: 2, margin: '0px 0px 0px 10px' }} required id="outlined-required" label="Website Url" value={form.web_url} onChange={({ target }) => updateForm({ ...form, web_url: target.value })} />
      </div>
      <div style={{ marginTop: '20px' }}>
      {error && <Collapse sx={{ marginBottom: '20px' }} in={open}>
            <Alert severity="error" action={
              <IconButton aria-label="close" color="inherit" size="small" onClick={() => setOpen(false)} >
                <Close fontSize="inherit" />
              </IconButton>
            } sx={{ mb: 2 }}>{error}</Alert>
          </Collapse>}
        <TextField sx={{ marginBottom: '20px', width: '100%' }} required label="Email" value={form.email} onChange={({ target }) => updateForm({ ...form, email: target.value })} />
        <FormControl sx={{ width: '100%' }} variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password">Master Password</InputLabel>
          <OutlinedInput
            error={form.value === ''}
            required
            value={form.value}
            onChange={({target}) => updateForm({ ...form, value: encryptData(target.value) })}
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
        <div style={{ marginTop: '20px', display: 'flex', gap: 4 }}>
          <Button onClick={() => navigate('/')} variant="text">Not Now</Button>
          <Button onClick={addToVault} disabled={isInvalid} variant="contained">Add</Button>
        </div>
      </div>
    </Box>
    <Snackbar open={snackbar} autoHideDuration={3000} onClose={() => setSnackbar(false)} message={snackMsg} action={action} />
  </div>)
}