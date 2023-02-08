import React, { useEffect } from "react";
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';
import { CheckBox, ContentCopy, RefreshRounded } from "@mui/icons-material";
import { FormControlLabel, FormGroup, LinearProgress, Slider } from "@mui/material";

export default function Generate() {
  // eslint-disable-next-line no-unused-vars
  const [passwordLength, setValue] = React.useState(10);
  const [strengthConfig, setParams] = React.useState({ lowercase: true, uppercase: true, numbers: true, randoms: true });
  const [passwordStrength, updateStrength] = React.useState({color:'warning', progress:70, message:'good'});
  const [open, setOpen] = React.useState(true);

  const passwordLengthHandle = (event, newValue) => {
    setValue(newValue)
  }

  const strengthConfigHandle = (event) => {
    setParams({ ...strengthConfig, [event.target.name]: event.target.checked })
  }

  useEffect(() => {}, [passwordLength, ])

  return (<div>
    <Box sx={{ width: '100%', paddingBottom: '10px' }}>
      <Collapse in={open}>
        <Alert variant="outlined" severity="info" action={
          <IconButton aria-label="close" onClick={() => setOpen(false)} size="small" color="inherit">
            <CloseIcon fontSize="inherit" />
          </IconButton>} >
          <strong>Security tip:</strong> Use generated passwords to keep your accounts safe
        </Alert>
      </Collapse>
    </Box>
    <div className="passwordBlock">
      <div className="passwordOutput">
        <div className="passwordOutputBlock">
          <h6>Password Suggestion</h6>
          <h2>A4f$efdff&83</h2>
        </div>
        <div className="buttonActions">
          {/* copy to clipboard button */}
          <IconButton>
            <ContentCopy />
          </IconButton>
          {/* refresh / generate new password */}
          <IconButton>
            <RefreshRounded />
          </IconButton>
        </div>
      </div>
      <LinearProgress color={passwordStrength.color} variant="determinate" value={passwordStrength.progress} />
      <h3 style={{padding:'10px 5px',color:'#2e7d32',textTransform:'capitalize'}}>{passwordStrength.message}</h3>
      <div className="generatorBlock">
        <p>Password Length: <input type="number" style={{width:'20px',padding:'5px',fontSize:'15px'}} value={passwordLength} onChange={passwordLengthHandle} /> characters</p>
        <Slider defaultValue={10} value={passwordLength} min={6} max={30} onChange={passwordLengthHandle} />
        <FormGroup style={{padding:'10px'}}>
          <FormControlLabel sx={{padding:'5px 0px'}} control={<CheckBox checked={strengthConfig.lowercase} onChange={strengthConfigHandle} name="lowercase" />} label="Lowercase (abc)" />
          <FormControlLabel sx={{padding:'5px 0px'}} control={<CheckBox checked={strengthConfig.uppercase} onChange={strengthConfigHandle} name="uppercase" />} label="Uppercase (ABC)" />
          <FormControlLabel sx={{padding:'5px 0px'}} control={<CheckBox checked={strengthConfig.numbers} onChange={strengthConfigHandle} name="numbers" />} label="Numbers (123)" />
          <FormControlLabel sx={{padding:'5px 0px'}} control={<CheckBox checked={strengthConfig.randoms} onChange={strengthConfigHandle} name="randoms" />} label="Randomized Symbols (123)" />
        </FormGroup>
      </div>
    </div>
  </div>)
}