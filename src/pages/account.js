import { LogoutRounded } from "@mui/icons-material";
import { signOut } from "firebase/auth";
import { Box, List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { useContext } from "react";
import { FirebaseContext } from "../context/firebase";

export default function Account() {
  const { auth } = useContext(FirebaseContext);

  return(<div className="accountsPage">
    <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      <List component="nav" aria-label="account accounts">
        <ListItemButton onClick={() => signOut(auth)}>
          <ListItemIcon>
            <LogoutRounded />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </List>
    </Box>
  </div>)
}