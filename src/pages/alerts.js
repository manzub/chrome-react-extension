import { OpenInNewOutlined } from "@mui/icons-material";
import { Alert, Box, Button, Card, CardContent, Collapse, List, ListItem, ListItemAvatar, ListItemText, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { decryptData } from "../encrypt";
import useAuthListener from "../hooks/use-auth-listener";
import useContent from "../hooks/use-content";

export default function Alerts() {
  const { user } = useAuthListener();
  const [open, setOpen] = React.useState(false);
  const [duplicates, updateDuplicates] = React.useState(false);
  const [error, setError] = React.useState('');

  const { vault: vaultItems } = useContent('vault', user.uid);

  function duplicatePasswords(vaultItems) {
    let arr = [...vaultItems];
    let duplicates = [];
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length; j++) {
        // do not compare same elements
        if (i !== j) {
          // check if elements match
          let password1 = decryptData(arr[i].value);
          let password2 = decryptData(arr[j].value);
          if (password1 === password2) {
            // duplicate element found
            duplicates.push([arr[i], arr[j]]);
            // terminate inner loop
            break;
          }
        }
      }
      // terminate outer loop
      if (duplicates.length > 0) {
        setError(`You have ${duplicates.length} compromised passwords`);
        setOpen(true);
        updateDuplicates(duplicates);
        break;
      }
    }
  }

  useEffect(() => {
    // find compromised passwords
    duplicatePasswords(vaultItems);
  }, [vaultItems]);

  return (<div>
    <Typography variant="h5" sx={{ fontWeight: 'bold', fontSize: 20 }} gutterBottom>Protect yourself from hackers</Typography>
    <Box sx={{ backgroundColor: '#fff', width: '95%', borderRadius: '5px', padding: '10px', minHeight: ' 300px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <Card>
          <CardContent>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>Total saved Items</Typography>
            <Typography variant="h5">{vaultItems?.length || 0}</Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>Total Compromises</Typography>
            <Typography variant="h5">{duplicates?.length || 0}</Typography>
          </CardContent>
        </Card>
      </div>
      {error && <Collapse sx={{ marginBottom: '20px' }} in={open}>
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
      </Collapse>}
      <div style={{ border: '1px solid #e3e3e3', padding: 5 }}>
        { duplicates.length > 0 && <p style={{ fontSize: 12, marginBottom: 20 }}>Change these passwords immediately to keep your account safe</p>}
        <List sx={{ padding: 0, '& li': { padding: 0 } }}>
          {duplicates.length > 0 && [].concat(...duplicates).map((item, idx) => <React.Fragment key={idx}>
            <ListItem secondaryAction={
              <Button variant="contained" sx={{ fontSize: 10 }} edge="end" aria-label="delete">
                <Link to={`/edit/${item.docId}`} style={{ display: 'flex', alignItems:'center',color:'inherit',textDecoration:'none' }}>
                  Edit <OpenInNewOutlined />
                </Link>
              </Button>
            }>
              <ListItemAvatar>
                <img width={40} src={item.favIconUrl} alt="favicon" />
              </ListItemAvatar>
              <ListItemText primary={`${item.web_url.substring(0, 15)}...`} secondary={item.email === '' ? item.username : item.email} />
            </ListItem>
          </React.Fragment>)}
        </List>
        { (!duplicates || duplicates.length === 0) && <h2 style={{ color: 'green' }}>Everything look safe and secure</h2> }
      </div>
    </Box>
  </div>)
}