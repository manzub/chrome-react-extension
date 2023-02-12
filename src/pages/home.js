import React, { useContext } from "react";
import { AddRounded, Close, ContactsRounded, ContentCopy, DeleteRounded, OpenInNewRounded, PaymentRounded, SearchRounded } from "@mui/icons-material";
import { IconButton, InputAdornment, Snackbar, TextField } from "@mui/material";
import { Button } from "../helpers/styledComponents";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import useContent from "../hooks/use-content";
import { decryptData } from "../encrypt";
import { useClipboard } from "use-clipboard-copy";
import { deleteDoc, doc } from "firebase/firestore";
import { FirebaseContext } from "../context/firebase";
import { useNavigate } from "react-router-dom";

export default function Home({ user }) {
  const navigate = useNavigate();
  const clipboard = useClipboard();
  const { firestore } = useContext(FirebaseContext);

  const [snackbar, setSnackbar] = React.useState(false);
  const [snackMsg, setSnackMsg] = React.useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const open = Boolean(anchorEl);
  const { vault: vaultItems } = useContent('vault', user.uid)

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const clipboardCopy = (text) => {
    const decryptedText = decryptData(text);
    clipboard.copy(decryptedText);
    setSnackbar(true);
    setSnackMsg('copied to clickboard');
  }

  const deleteVaultItem = async (vaultItem) => {
    try {
      const reference = doc(firestore, "vault", vaultItem.docId)
      await deleteDoc(reference);
      setSnackbar(true);
      setSnackMsg(`Deleted ${vaultItem.web_url}`)
    } catch (error) {
      setSnackbar(true);
      setSnackMsg(error.message);
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
    <div className="homeHeader">
      <TextField className="searchTextField" InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchRounded />
          </InputAdornment>
        ),
      }} variant="outlined" label="Search your vault" />
      <Button>Vault <OpenInNewRounded /></Button>
      <IconButton aria-label="Add New" onClick={handleClick}>
        <AddRounded />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={() => navigate('/create')}><DeleteRounded /> Add password</MenuItem>
        <MenuItem onClick={handleClose}><ContactsRounded /> Add address</MenuItem>
        <MenuItem onClick={handleClose}><PaymentRounded /> Add payment card</MenuItem>
        <MenuItem onClick={handleClose}>Save all entered data</MenuItem>
      </Menu>
    </div>
    <div className="homeContents" style={{ padding: '10px 0px' }}>
      {vaultItems.length === 0 && <React.Fragment>
        <h4 style={{ textAlign: 'center' }}>Nothing in vault yet</h4>
      </React.Fragment>}

      {vaultItems.map((item, idx) => (<React.Fragment key={idx}>
        <div className="vaultItem">
          <div className="vaultItemInfo">
            <img src={`${item.web_url}/favicon.ico`} alt="favicon" />
            <div className="vaultItemDetails">
              <p>{item.web_url}</p>
              <h4>{item.email}</h4>
            </div>
          </div>
          <div className="buttonActions">
            <IconButton onClick={() => clipboardCopy(item.value)}>
              <ContentCopy />
            </IconButton>
            <IconButton onClick={() => deleteVaultItem(item)}>
              <DeleteRounded />
            </IconButton>
          </div>
        </div>
      </React.Fragment>))}
    </div>
    <Snackbar open={snackbar} autoHideDuration={3000} onClose={handleClose} message={snackMsg} action={action} />
  </div>)
}