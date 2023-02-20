import { Close } from "@mui/icons-material";
import { Alert, Box, Card, CardContent, Collapse, IconButton, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { decryptData } from "../encrypt";
import useAuthListener from "../hooks/use-auth-listener";
import useContent from "../hooks/use-content";

export default function Alerts() {
  const { user } = useAuthListener();
  const [open, setOpen] = React.useState(false);
  const [error, setError] = React.useState('');

  const { vault: vaultItems } = useContent('vault', user.uid);

  function duplicatePasswords(vaultItems) {

  }

  useEffect(() => {
    // TODO: compromised passwords later
    duplicatePasswords(vaultItems);
  }, [vaultItems]);

  return (<div>
    <Typography variant="h5" sx={{fontWeight:'bold',fontSize:20}} gutterBottom>Protect yourself from hackers</Typography>
    <Box sx={{ backgroundColor: '#fff', width: '95%', borderRadius: '5px', padding: '10px', minHeight: ' 300px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Card>
          <CardContent>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>Total saved Items</Typography>
            <Typography variant="h5">{vaultItems.length}</Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>Total Compromises</Typography>
            <Typography variant="h5">0</Typography>
          </CardContent>
        </Card>
      </div>
      {error && <Collapse sx={{ marginBottom: '20px' }} in={open}>
        <Alert severity="error" action={
          <IconButton aria-label="close" color="inherit" size="small" onClick={() => setOpen(false)} >
            <Close fontSize="inherit" />
          </IconButton>
        } sx={{ mb: 2 }}>{error}</Alert>
      </Collapse>}
    </Box>
  </div>)
}