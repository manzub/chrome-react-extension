import { ArrowBackRounded, Visibility, VisibilityOff, Close } from '@mui/icons-material';
import { Box, Button, Collapse, Alert, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Create() {
  const navigate = useNavigate();

  const [open, setOpen] = React.useState(false);
  const [error, setError] = React.useState('');
  const [isLoading, setLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [form, updateForm] = React.useState({ web_url: '', email: '', password: '' });

  const isInvalid = form.web_url === '' || form.email === '' || form.password === '' || isLoading;

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
      setLoading(false);
    } catch(error) {
      setLoading(false);
      showError(error.message);
    }
  }

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
        <img src={`${form.web_url}/favicon.ico`} alt='' style={{ height: '54px' }} />
        <TextField sx={{ flex: 2, margin: '0px 0px 0px 10px' }} required id="outlined-required" label="Website Url" value={form.web_url} onChange={({target}) => updateForm({ ...form, web_url: target.value })} />
      </div>
      <div style={{ marginTop: '20px' }}>
      {error && <Collapse sx={{ marginBottom: '20px' }} in={open}>
            <Alert severity="error" action={
              <IconButton aria-label="close" color="inherit" size="small" onClick={() => setOpen(false)} >
                <Close fontSize="inherit" />
              </IconButton>
            } sx={{ mb: 2 }}>{error}</Alert>
          </Collapse>}
        <TextField sx={{ marginBottom: '20px', width: '100%' }} required label="Email" value={form.email} onChange={({target}) => updateForm({ ...form, email: target.value })} />
        <FormControl sx={{ width: '100%' }} variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password">Master Password</InputLabel>
          <OutlinedInput
            error={form.password === ''}
            required
            value={form.password}
            onChange={({target}) => updateForm({ ...form, password: target.value })}
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
  </div>)
}