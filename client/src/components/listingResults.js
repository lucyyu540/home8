import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Avatar from '@material-ui/core/Avatar';
import { useAuth0, user } from "../react-auth0-spa";

const messages = [
  {
    id: 1,
    primary: 'Brunch this week?',
    secondary: "I'll be in the neighbourhood this week. Let's grab a bite to eat",
    person: '/static/images/avatar/5.jpg',
  },
  {
    id: 2,
    primary: 'Birthday Gift',
    secondary: `Do you have a suggestion for a good present for John on his work
      anniversary. I am really confused & would love your thoughts on it.`,
    person: '/static/images/avatar/1.jpg',
  },
  {
    id: 3,
    primary: 'Recipe to try',
    secondary: 'I am try out this new BBQ recipe, I think this might be amazing',
    person: '/static/images/avatar/2.jpg',
  }
];

const useStyles = makeStyles((theme) => ({
  text: {
    padding: theme.spacing(2, 2, 0),
  },
  paper: {
    top: 0,
    paddingBottom: 50,
    width:"50%"
  },
  list: {
    marginBottom: theme.spacing(2),
  },
  subheader: {
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function BottomAppBar() {
  const classes = useStyles();
  /**const [showResult, setShowResult] = React.useState(false);
  const [apiMessage, setApiMessage] = React.useState("");
  const { getTokenSilently } = useAuth0();
  const callPrivateAPI = async (email) => {
    try {
      console.log('trying /private with email: ', email);
      const data = {email: email}
      const token = await getTokenSilently();
      const response = await fetch("https://localhost:3000/private", {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }, 
        method: 'put', 
        body: JSON.stringify(data)
      });
      const responseData = await response.json();
      setShowResult(true);
      setApiMessage(responseData);
      console.log('logged in');
      console.log(responseData);

    } catch (error) {
      console.log(error)
    }
  };
  const callPublicAPI = async () => {
    try {
      const response = await fetch("https://localhost:3000/")
      const responseData = await response.json();
      setShowResult(true);
      setApiMessage(responseData);
    }
    catch(err) {
      console.log(err);
    }
  }
 
  const {user} = useAuth0();

  useEffect( ()=> {
  if (user) {
   callPrivateAPI(user.email);
  }
  else {
    console.log('not logged on)')
    callPublicAPI();
  } 
  }, [showResult] )*/

  return (
    <React.Fragment>
      <CssBaseline />
      <Paper square className={classes.paper}>
        <List className={classes.list}>
          {messages.map(({ id, primary, secondary }) => (
            <React.Fragment key={id}>
              {id === 1 && <ListSubheader className={classes.subheader}>Favorited</ListSubheader>}
              {id === 3 && <ListSubheader className={classes.subheader}>Most Recent</ListSubheader>}
              <ListItem button>
                <ListItemAvatar>
                  <Avatar alt="Profile Picture" />
                </ListItemAvatar>
                <ListItemText primary={primary} secondary={secondary} />
              </ListItem>
            </React.Fragment>
          ))}
        </List>
      </Paper>
    </React.Fragment>
  );
}
