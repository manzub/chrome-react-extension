/* eslint-disable no-undef */
import React, { useEffect } from "react";
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';
import { ContentCopy, RefreshRounded } from "@mui/icons-material";
import { Checkbox, FormControlLabel, FormGroup, LinearProgress, Slider, Snackbar } from "@mui/material";
import { defaultStrengthConfig } from "../constants/constants";
import { useClipboard } from "use-clipboard-copy";

export default function Generate() {
  const clipboard = useClipboard();

  const [snackbar, setSnackbar] = React.useState(false);
  const [snackMsg, setSnackMsg] = React.useState(null);
  const [disabledCheckbox, setDisabled] = React.useState(false);
  const [passwordLength, setValue] = React.useState(10);
  const [strengthConfig, setParams] = React.useState(defaultStrengthConfig);
  const [passwordStrength, updateStrength] = React.useState({ color: 'success', message: 'good', validKey: 'password' });
  const [open, setOpen] = React.useState(true);

  const passwordLengthHandle = (event, newValue) => setValue(newValue)

  const strengthConfigHandle = (event) => {
    setParams({ ...strengthConfig, [event.target.name]: event.target.checked })
  }

  const resetGenerator = () => {
    setParams(defaultStrengthConfig);
    setValue(10);
    setDisabled(false);
  }

  // TODO: chrome get current tab
  const copyGenerated = React.useCallback(() => {
    clipboard.copy(passwordStrength.validKey);
    chrome.tabs && chrome.tabs.query({
      active: true,
      currentWindow: true
    }, tabs => {
      setSnackMsg(`copied to clickboard on ${new URL(tabs[0].url).origin}`);
      setSnackbar(true);
    })
  }, [clipboard, passwordStrength])

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnackbar(false);
  };

  useEffect(() => {
    const validChecks = Object.values(strengthConfig).filter(x => x === true);
    validChecks && setDisabled(!!(validChecks.length < 2));
  }, [strengthConfig]);

  useEffect(() => {
    // generate new passwords everytime changes is made
    let result = '';
    const characters = { uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', lowercase: 'abcdefghijklmnopqrstuvwxyz', numbers: '0123456789', randoms: '!@#$%&(){?}[]' }
    let charsPool = [];
    if (strengthConfig.lowercase) charsPool.push(characters.lowercase);
    if (strengthConfig.uppercase) charsPool.push(characters.uppercase);
    if (strengthConfig.numbers) charsPool.push(characters.numbers);
    if (strengthConfig.randoms) charsPool.push(characters.randoms);
    charsPool = charsPool.join("");
    const poolLength = charsPool.length;
    let counter = 0;
    while (counter < passwordLength) {
      result += charsPool.charAt(Math.floor(Math.random() * poolLength));
      counter += 1;
    }
    let passwordStrength = { validKey: result, color: result.length < 6 ? 'error' : 'success', message: result.length < 6 ? 'weak' : 'Good' }

    // TODO: switch (result.length) {
    updateStrength(passwordStrength);
  }, [passwordLength, strengthConfig])

  const action = (
    <React.Fragment>
      <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

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
          <h2>{passwordStrength.validKey}</h2>
        </div>
        <div className="buttonActions">
          {/* copy to clipboard button */}
          <IconButton onClick={copyGenerated}>
            <ContentCopy />
          </IconButton>
          {/* refresh / generate new password */}
          <IconButton onClick={resetGenerator}>
            <RefreshRounded />
          </IconButton>
        </div>
      </div>
      <LinearProgress color={passwordStrength.color} variant="determinate" value={100} />
      <h3 style={{ padding: '10px 5px', color: '#2e7d32', textTransform: 'capitalize' }}>{passwordStrength.message}</h3>
      <div className="generatorBlock">
        <p>Password Length: <input type="number" style={{ width: '35px', padding: '5px', fontSize: '15px' }} value={passwordLength} onChange={passwordLengthHandle} /> characters</p>
        <Slider defaultValue={10} value={passwordLength} min={4} max={30} onChange={passwordLengthHandle} />
        <FormGroup style={{ padding: '10px' }}>
          <FormControlLabel sx={{ padding: '5px 0px' }} control={<Checkbox disabled={disabledCheckbox} checked={strengthConfig.lowercase} onChange={strengthConfigHandle} name="lowercase" />} label="Lowercase (abc)" />
          <FormControlLabel sx={{ padding: '5px 0px' }} control={<Checkbox disabled={disabledCheckbox} checked={strengthConfig.uppercase} onChange={strengthConfigHandle} name="uppercase" />} label="Uppercase (ABC)" />
          <FormControlLabel sx={{ padding: '5px 0px' }} control={<Checkbox disabled={disabledCheckbox} checked={strengthConfig.numbers} onChange={strengthConfigHandle} name="numbers" />} label="Numbers (123)" />
          <FormControlLabel sx={{ padding: '5px 0px' }} control={<Checkbox disabled={disabledCheckbox} checked={strengthConfig.randoms} onChange={strengthConfigHandle} name="randoms" />} label="Randomized Symbols (?@&)" />
        </FormGroup>
      </div>
    </div>
    <Snackbar open={snackbar} autoHideDuration={3000} onClose={handleClose} message={snackMsg} action={action} />
  </div>)
}