import { AddRounded, ContactsRounded, ContentCopy, DeleteRounded, MoreHorizRounded, OpenInNewRounded, PaymentRounded, SearchRounded } from "@mui/icons-material";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import { Button } from "../helpers/styledComponents";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import React from "react";

export default function Home() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

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
        <MenuItem onClick={handleClose}><DeleteRounded /> Add password</MenuItem>
        <MenuItem onClick={handleClose}><ContactsRounded /> Add address</MenuItem>
        <MenuItem onClick={handleClose}><PaymentRounded /> Add payment card</MenuItem>
        <MenuItem onClick={handleClose}>Save all entered data</MenuItem>
      </Menu>
    </div>
    <div className="homeContents" style={{padding: '10px 0px'}}>
      <div className="vaultItem">
        <div className="vaultItemInfo">
          <img src="https://dev.to/favicon.ico" alt="favicon" />
          <div className="vaultItemDetails">
            <p>dev.to</p>
            <h4>wisdomokon89@gmail.com</h4>
          </div>
        </div>
        <div className="buttonActions">
          <IconButton>
            <ContentCopy />
          </IconButton>
          <IconButton>
            <MoreHorizRounded />
          </IconButton>
        </div>
      </div>
    </div>
  </div>)
}