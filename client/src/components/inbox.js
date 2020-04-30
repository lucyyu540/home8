import React, { useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { useAuth0, user } from "../react-auth0-spa";
import {useParams } from "react-router-dom";
import Container from '@material-ui/core/Container';

import TextField from '@material-ui/core/TextField';

/**LIST */
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

/**ICONS */
import Avatar from '@material-ui/core/Avatar';
import Badge from '@material-ui/core/Badge';
import Divider from '@material-ui/core/Divider';
import InputAdornment from '@material-ui/core/InputAdornment';
import SendIcon from '@material-ui/icons/Send';
import IconButton from '@material-ui/core/IconButton';


/**MY MODULES */
import Listing from './editListing'
import { ListItemIcon } from '@material-ui/core';
import '../App.css'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow:1,
    minWidth:'40%',
  },
  body: {
    height: '100vh',
    overflow:'auto'
  },
  innerBody: {//inner body
    marginBottom: 76,//app-bar heigh is 66ish
    overflow:'auto',
  },
  listItem : {
    margin: theme.spacing(1),
  },
  bubble: {
    padding: theme.spacing(2),
    margin: theme.spacing(1,3),
    maxWidth: 200,
  },
  chatroom: {
    overflow:'auto',
    padding: theme.spacing(3,0)
  },
  textField: {
    width: '100%'
  }
}));

export default function ListingResults() {
  const classes = useStyles();
  const { getTokenSilently, user } = useAuth0();
  const [convo, setConvo] = React.useState({});
  const [newMessage, setNewMessage] = React.useState("");
  /**height */
  const [chatroomHeight, setChatroomHeight] = React.useState('92vh');
  const messageHeight = React.useRef(null);

  const [sel, setSel] = React.useState(null);
  /**HANDLE FUNCTIONS **************************************************** */
  async function handleClickOpen(e){
    setSel(e);
  }
  function handleNewMessage(e) {
    setNewMessage(e.target.value);
  }
  /**API CALLS********************************************************** */
  async function handleSend() {
    console.log('send clicked');
    try{
      var to;
      if (convo[sel][0].from[1] == 'You') to = convo[sel][0].to[0];
      else to = convo[sel][0].from[0];
      const token = await getTokenSilently();
      const data = {
          to: to,
          content: newMessage,
      }
      const response = await fetch(`https://localhost:3000/private/send/message`, {
          headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }, 
          method: 'put', 
          body: JSON.stringify(data)
      });
      setNewMessage("");//clear textfield
      //getInbox();
    }
    catch(err) {
      console.log(err);
    }

  }

  async function markRead(unreadMid) {
    try {
      const token = await getTokenSilently();
      const data = {
        unreadMid: unreadMid
      }
      const response = await fetch(`https://localhost:3000/private/send/read`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }, 
        method: 'put', 
        body: JSON.stringify(data)
      });
      const responseData = await response.json();
  }
  catch(err) {
      console.log(err);
  }

  }


  async function getInbox() {
    try {
        const token = await getTokenSilently();
        const response = await fetch(`https://localhost:3000/private/send/inbox`, {
            headers: {
                Authorization: `Bearer ${token}`,
              }, 
            method: 'get', 
        });
        const responseData = await response.json();
        setConvo(responseData);
        console.log(responseData);
    }
    catch(err) {
        console.log(err);
    }
  }
  
  useEffect(() => {
    getInbox();
    if (sel!= null) {
      var temp = window.innerHeight - messageHeight.current.clientHeight-80;//appbar=66
      temp = vh(temp);
      setChatroomHeight(temp+'vh');
      /**look for unread messages from this person */
      var unreadMid = [];
      for (var i = 0 ; i < convo[sel].length; i ++) {
        if (convo[sel][i].read == 0) unreadMid.push(convo[sel][i].mid);
        else break;
      }
      if (unreadMid.length>0) markRead(unreadMid);
    }
  })
  

  function vh(v) {
    var h = window.innerHeight;
    return (v / h) * 100;
  }
  /**DISPLAY********************************************************* */
  const displaySelConvo = (sel) => (
    <Grid container direction="column-reverse">
      {convo[sel].map((key, index) => (
        <Grid item key={index}>
        {convo[sel][index].from[1] == 'You' && (
          <Grid container direction='row' justify='flex-end'>
            <Grid item >
            <Paper elevation={3} className={classes.bubble} style={{backgroundColor: '#6FB2E3'}}>
                <Typography variant="body2"color='textPrimary' >
                {convo[sel][index].content}
                </Typography>
            </Paper>
            </Grid>
            
          </Grid>
        )}
        {convo[sel][index].from[1] != 'You' && (
          <Grid container>
            <Grid item><Avatar alt="Profile Picture"/></Grid>
            <Grid item >
              <Paper elevation={3} className={classes.bubble}>
                <Typography variant="body2"color='textPrimary' >
                {convo[sel][index].content}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        )}
        </Grid>
      ))}
    </Grid>
  )
  /******************************************************************************* */
  /******************************************************************************* */
  /******************************************************************************* */

  return (
    <div className='rowC'>
    <div className={classes.root}>
      <Paper square className={classes.body}>
        <Paper square elevation={0} className={classes.innerBody}>
        <List className={classes.list}>
          {Object.keys(convo).map( (keyName, index) => (
          <React.Fragment key={index}>
          <ListItem 
            button
            onClick={() => handleClickOpen(keyName)}
          >
          <Grid item xs={12} sm container className={classes.listItem}>
            <Grid item xs container direction="column" spacing={2}>
              <Grid item xs> {/**TITLE = THE OTHER PERSON */}
              {/**last message from other person and is unread */}
              {/** convo[keyName][0].from[1] != 'You' && convo[keyName][0].read == 0 */}
                {convo[keyName][0].read == 0 && (
                  <Badge color="primary" variant="dot">
                    <Typography variant="h6" color='textPrimary'>
                      {keyName}
                    </Typography>
                </Badge>
                )}
                {/**last message from you/ from other person and is read */}
                {/** (convo[keyName][0].from[1] == 'You' || convo[keyName][0].read == 1)*/}
                {(convo[keyName][0].read == 1) && (
                  <Typography variant="h6" color='textPrimary'>
                    {keyName}
                  </Typography>
                )}
                
              </Grid>
              <Grid item xs>{/**MESSAGE PREVIEW */}
                {convo[keyName][0].type == 'request' && (
                  <Typography variant="body2"color='textSecondary' >
                  {convo[keyName][0].from[1]}: Sent a request.
                  </Typography>
                )}
                {convo[keyName][0].type == 'message' && (
                  <Typography variant="body2"color='textSecondary' >
                 {convo[keyName][0].from[1]}: {convo[keyName][0].content}
                  </Typography>
                )}
              </Grid>
            </Grid>
            <Grid item>
              <Typography variant="body2" color="textSecondary">
                {convo[keyName][0].time}
              </Typography>
            </Grid>            
          </Grid>
          </ListItem>
          </React.Fragment>
          ))}
        </List>
      </Paper>
      </Paper>
    </div>
    {/**CHATROOM******************************************************* */}
    <div className={classes.root}>
      {sel != null && (
        <div className={classes.body}>
          {/**CHATT HISTORY */}
          <Container style={{height: `${chatroomHeight}`}} className={classes.chatroom}>
          {displaySelConvo(sel)}
          </Container>
          {/**SEND MESSAGE */}
          <Container>
            <Grid container alignItems="flex-end" justify="center">
              <Grid item xs={12}>
                <TextField
                className={classes.textField}
                ref={messageHeight}
                multiline
                rows={10}
                value={newMessage}
                onChange={handleNewMessage}
                variant='outlined'
                InputProps={{
                  endAdornment: (
                      <InputAdornment position="start">
                        <IconButton onClick={handleSend}>
                        <SendIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                }}
                />
              </Grid>
            </Grid>

          </Container>
           
        </div>
      )}
    </div>
    </div>
  );
}
