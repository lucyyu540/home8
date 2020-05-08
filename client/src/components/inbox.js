import React, { useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { useAuth0, user } from "../react-auth0-spa";
import Container from '@material-ui/core/Container';
import { Link } from "react-router-dom";

import TextField from '@material-ui/core/TextField';

/**LIST */
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import SnackbarContent from '@material-ui/core/SnackbarContent';

/**ICONS */
import Avatar from '@material-ui/core/Avatar';
import Badge from '@material-ui/core/Badge';
import Divider from '@material-ui/core/Divider';
import InputAdornment from '@material-ui/core/InputAdornment';
import SendIcon from '@material-ui/icons/Send';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import CloseIcon from '@material-ui/icons/Close';


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
  bubble: {//paper bubble 
    padding: theme.spacing(1),
    margin: theme.spacing(1,0),
    maxWidth: 200,
  },
  chatroom: {//container
    overflow:'auto',
    padding: theme.spacing(2)
  },
  textField: {
    width: '100%'
  },
  fab: {
    margin: theme.spacing(1)
  },
  snackBar: {
    position: 'absolute',
    zIndex:1,
  }
}));

export default function ListingResults() {
  const classes = useStyles();
  const { getTokenSilently, user } = useAuth0();
  const [convo, setConvo] = React.useState({});
  const [newMessage, setNewMessage] = React.useState("");
  const [receivedRequests, setReceivedRequests] = React.useState([]);
  /**height */
  const [chatroomHeight, setChatroomHeight] = React.useState('92vh');
  const messageHeight = React.useRef(null);
  /**scroll */
  const messagesEndRef = useRef(null);
  const [scroll, setScroll] = React.useState(0);
  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
  }

  const [sel, setSel] = React.useState(null);
  /**HANDLE FUNCTIONS **************************************************** */
  async function handleClickOpen(e){
    setSel(e);
    setScroll(1);//scroll to bottom of the chat
    /**make snackbar */
    var temp = []
    for (var i = 0 ; i < convo[e].length; i++) {
      if (convo[e][i].type == 'request' && convo[e][i].to[1] == 'You') temp.push(convo[e][i])
    }
    setReceivedRequests(temp);
  }
  function handleNewMessage(e) {
    setNewMessage(e.target.value);
  }
  function closeSnackBar(index) {
    console.log('close snack bar clicked')
    var temp = receivedRequests; 
    temp.splice(index,1);
    console.log(temp);
    setReceivedRequests(temp);
  }
  function handleEnter(e) {
    if (e.key == 'Enter'){
      handleSend();
    }   
  }
  /**API CALLS********************************************************** */
  
  async function handleSend() {
    console.log('send clicked or enter pressed');
    try{
      var to;
      if (convo[sel][0].from[1] == 'You') to = convo[sel][0].to[0];
      else to = convo[sel][0].from[0];
      const token = await getTokenSilently();
      const data = {
          to: to,
          content: newMessage,
      }
      const response = await fetch(`https://localhost:3000/private/notification/message`, {
          headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }, 
          method: 'put', 
          body: JSON.stringify(data)
      });
      setNewMessage("");//clear textfield
      setScroll(1);//scroll to bottom of the chat
      //getInbox();
    }
    catch(err) {
      console.log(err);
    }

  }

  async function markRead() {
    var unreadMid = [];
    for (var i = 0 ; i < convo[sel].length; i ++) {
      if (convo[sel][i].read == 0 && convo[sel][i].to[0] == user.sub) unreadMid.push(convo[sel][i].mid);
      else break;//alr read or sent by me
    }
    if (unreadMid.length==0) return;
    try {
      const token = await getTokenSilently();
      const data = {
        unreadMid: unreadMid
      }
      const response = await fetch(`https://localhost:3000/private/notification/read`, {
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
        const response = await fetch(`https://localhost:3000/private/notification/inbox`, {
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
  //1. send accept message
  //2. add person to mates under listing
  //3. delete space available
  async function accept(req) {
    console.log('accepting request', req);
    try {
      const token = await getTokenSilently();
      const data = {
        content: req.content,
        lid : req.lid,
        mid : req.mid,
        from : req.from[0]
      }
      await fetch(`https://localhost:3000/private/listing/accept`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }, 
        method: 'put', 
        body: JSON.stringify(data)
      });
    }
    catch(err) {
      console.log(err);
    }

  }
  //delete message  
  async function decline(req) {
    try {
      const token = await getTokenSilently();
      const data = {
        mid: req.mid,
      }
      await fetch(`https://localhost:3000/private/notification/inbox/delete`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }, 
        method: 'put', 
        body: JSON.stringify(data)
      });
      if (convo[sel].length == 1) setSel(null);
    }
    catch(err) {
      console.log(err);
    }

  }
  /**********************USE EFFECT************************************ */
  
  useEffect(() => {
    getInbox();
    /**ENTERED A CHATROOM */
    if (sel!= null) {
      /**mark unread messages as read */
      markRead();
      if (scroll) {
        /**height */
        var temp = window.innerHeight - messageHeight.current.clientHeight-80;//appbar=66
        temp = vh(temp);
        setChatroomHeight(temp+'vh');
        //scroll
        scrollToBottom(); 
        if (scroll == 1) setScroll(scroll+1);
        else setScroll(0);
      }
    }
  },[convo])

  

  /**HELPER FUNCTTIONS ********************************************/
  function vh(v) {
    var h = window.innerHeight;
    return (v / h) * 100;
  }
  function formatTime(s) {
    //s --> in universal time zone
    const tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
    const message = new Date(s);//convertd to local time zone
    const messageISO = (new Date(new Date(s) - tzoffset)).toISOString();
    const nowISO = (new Date(Date.now() - tzoffset)).toISOString();

    const nowDate0Time = new Date( nowISO.split("T")[0] ).getTime();
    const messageDate0Time = new Date( messageISO.split("T")[0] ).getTime();
    //same year, month, date
    if (nowDate0Time == messageDate0Time) {//same date --> display time
      return formatTwelveHourClock( message.getHours(), message.getMinutes());
    }
    else if ( nowDate0Time- messageDate0Time== (1000 * 60 * 60 * 24)) {//yesterday, display time
      return "Yesterday " + formatTwelveHourClock( message.getHours(), message.getMinutes());
    }
    //weekday, time
    else if (nowDate0Time- messageDate0Time < (1000 * 60 * 60 * 24*7)) {
      return message.toString().split(" ")[0] + " " + formatTwelveHourClock( message.getHours(), message.getMinutes());
    }
    else {//display month, date, and time
      return message.toString().split(" ")[1] + " " + message.getDate() + ", " + formatTwelveHourClock( message.getHours(), message.getMinutes());
    }
  }
  function formatTwelveHourClock(hour, min) {
    if (min < 10) min = "0"+min;
    if (hour > 12) {
      hour -= 12;
      return hour+":"+min+" PM"
    }
    else {
      return hour+":"+min+" AM"
    }
  }

  /**CHAT DISPLAY********************************************************* */
  const youReceivedRequest = (req) => (
    <Grid container>
      <Grid item>
      <Typography variant="body2"color='textPrimary'>
        You received a request for a {req.content.split(" ")[4]} {req.content.split(" ")[3]} at:
      </Typography>
      <Fab variant="extended"
      className={classes.fab}
      color='default' 
      component={Link} 
      to={`/listing/${req.lid}`}>
        Go to listing
      </Fab>
      </Grid>
    </Grid>
  )


  const displayReceivedRequestsSnackbar = () => (
    <div  className={classes.snackBar}>
    {receivedRequests.map((key, index) => (
      <SnackbarContent 
      key = {index}
      message = {
        <Grid container direction='column'>
          <Grid item>
            <Typography variant='body2'>
            Pending request:
            </Typography>
          </Grid>
          <Grid item style={{marginLeft:3}}>
            <Typography 
            color='primary'
            variant='body2'
            component={Link} 
            to={`/listing/${receivedRequests[index].lid}`}>
            {receivedRequests[index].content.split(" ")[4]} {receivedRequests[index].content.split(" ")[3]}
            </Typography>
          </Grid>
        </Grid>
      }
      action={
      <Grid container direction='column' justify='flex-end'>
        <Grid item>{/**row 1 */}<Grid container justify='flex-end'>
          <Grid item>
            <IconButton color='inherit' onClick={() => closeSnackBar(index)}><CloseIcon/></IconButton>
          </Grid>
        </Grid></Grid>
        <Grid item> {/**row 2 */}<Grid container alignItems='center'>
           <Grid item>
              <Button color='primary' onClick={() => {
                accept(receivedRequests[index]);
                closeSnackBar(index);
              }}>Accept</Button>
          </Grid>
          <Grid item>
            <Button color='primary' onClick={() => {
              decline(receivedRequests[index]); 
              closeSnackBar(index);
              }}>Decline</Button>
          </Grid>
        </Grid></Grid>
    </Grid>
      }/>
    ))}
    </div>
  )

  const displaySelConvo = (sel) => (
    <Grid container direction="column-reverse">
      {convo[sel].map((key, index) => (
        <Grid item key={index}>
          {/**SENT BY YOU */}
        {convo[sel][index].from[1] == 'You' && convo[sel][index].type == 'message' && (
          <Grid container direction='row' justify='flex-end'>
            <Grid item >
            <Paper elevation={3} className={classes.bubble} style={{backgroundColor: '#6FB2E3'}}>
                <Typography variant="body2"color='textPrimary' >
                {convo[sel][index].content}
                </Typography>
                <Typography variant="caption"color='textSecondary' >
                {formatTime(convo[sel][index].time)}
                </Typography>
            </Paper>
            </Grid>
          </Grid>
        )}
        {/**SENT BY OTHER PERSON */}
        {convo[sel][index].from[1] != 'You' && (
          <Grid container>
            <Grid item><Avatar className={classes.listItem} alt="Profile Picture"/></Grid>
            <Grid item >
              <Paper elevation={3} className={classes.bubble}>
                {/**type = message */}
                {convo[sel][index].type == 'message' &&(
                <Typography variant="body2"color='textPrimary' >
                {convo[sel][index].content}
                </Typography>
                )}
                {/**type = request */}
                {convo[sel][index].type == 'request' &&(
                youReceivedRequest(convo[sel][index])
                )}
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
        <List>
          {Object.keys(convo).map( (keyName, index) => (
          <React.Fragment key={index}>
          <ListItem 
            button
            onClick={() => handleClickOpen(keyName)}
          >
            <Grid container alignItems='center' spacing={2} className={classes.listItem}>
              <Grid item xs={2}> {/**TITLE = THE OTHER PERSON */}
              {/**last message from other person and is unread */}
                {convo[keyName][0].from[1] !='You' && convo[keyName][0].read==0 && (
                  <Badge color="primary" variant="dot">
                    <Typography variant="h6" color='textPrimary'>
                      {keyName}
                    </Typography>
                </Badge>
                )}
                {/**last message from you/ from other person and is read */}
                {(convo[keyName][0].from[1]=='You' || convo[keyName][0].read==1) && (
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
              <Grid item> {/**DATE */} 
              <Typography variant="body2" color="textSecondary">
                {formatTime(convo[keyName][0].time)}
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
          {displayReceivedRequestsSnackbar()}
          {displaySelConvo(sel)}
          <div ref = {messagesEndRef} />
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
                onKeyPress={handleEnter}
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
