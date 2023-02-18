/* eslint-disable no-undef */
import React, { useContext, useEffect } from "react";
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
  const [displayItems, setDisplayItems] = React.useState([]);

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

  const filterVaultItems = ({ target }) => {
    let searchText = String(target.value);
    if(searchText.length > 0) {
      const results = vaultItems.filter(function(item) {
        if(String(item.email).includes(searchText)) return true;
        if(String(item?.username).includes(searchText)) return true;
        if(String(item.web_url).includes(searchText)) return true;
        return false;
      })
      setDisplayItems(results);
    } else setDisplayItems(vaultItems);
  }

  useEffect(() => {
    setDisplayItems(vaultItems);
  }, [vaultItems])

  const action = (
    <React.Fragment>
      <IconButton size="small" aria-label="close" color="inherit" onClick={() => setSnackbar(false)}>
        <Close fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  return (<div>
    <div className="homeHeader">
      <TextField onChange={filterVaultItems} className="searchTextField" InputProps={{
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
      {displayItems.length === 0 && <React.Fragment>
        <h4 style={{ textAlign: 'center' }}>Nothing to see here!</h4>
      </React.Fragment>}

      {displayItems.map((item, idx) => {
        const domain = new URL(item.web_url);
        return(<React.Fragment key={idx}>
          <div className="vaultItem">
            <div className="vaultItemInfo">
              <img width="50" src={item.favIconUrl} alt="favicon" />
              <div className="vaultItemDetails">
                <p>{domain.origin}</p>
                <h4>{item.email || item.username}</h4>
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
        </React.Fragment>)
      })}
    </div>
    <Snackbar open={snackbar} autoHideDuration={3000} onClose={handleClose} message={snackMsg} action={action} />
  </div>)
}