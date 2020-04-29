import React, { useEffect } from 'react';
import { useAuth0, user } from "../react-auth0-spa";
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
/**LIST */
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Avatar from '@material-ui/core/Avatar';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Popover from '@material-ui/core/Popover';
/**ICONS */
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
/**DIALOG */
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
/**MY MODULES */
import Submap from './submap';
import Map from './map'
import GoogleMap from './googleMap'

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
  listItem : {
    alignItems: 'left'
  },
  popover: {
    pointerEvents: 'none',
  },
  popup: {
    padding: theme.spacing(1)
  },
  textPadding: {
    padding: theme.spacing(0,1)
  },
}));

export default function ListingResults(props) {
  const classes = useStyles();
  const { getTokenSilently, user,isAuthenticated, loginWithRedirect } = useAuth0();
  const [listings, setListings] = React.useState([]);
  const [favoriteListings, setFavoriteListings] = React.useState([]);
  const [req, setReq] = React.useState(null);
  const [room, setRoom] = React.useState({});
  console.log(req);
  useEffect(()=> {
    if (props.listings) setListings(props.listings);
    if (props.favoriteListings) setFavoriteListings(props.favoriteListings);
    /**GET ALL REQUESTS SENT BY USER */
    if (user) getSentRequests();
  },[props])
  /**API */
  async function getSentRequests() {
    try {
      const token = await getTokenSilently();
      const res = await fetch(`https://localhost:3000/private/send/outbox/requests`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }, 
      method: 'get', 
      });
      const data = await res.json();
      setReq(data);
    }
    catch(err) {
      console.log(err);
    }
  }
  async function requestAPI(index, owner, lid, fromDate, toDate, price, rooming, roomType) {
    console.log('request clicked');
    if (!user) return loginWithRedirect({});
    try{
      const token = await getTokenSilently();
      const data = {
          to: owner,
          lid: lid,
          fromDate: fromDate,
          toDate: toDate,
          price: price,
          rooming: rooming,
          roomType: roomType
      }
      const response = await fetch(`https://localhost:3000/private/send/request`, {
          headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }, 
          method: 'put', 
          body: JSON.stringify(data)
      });
      setRoom({...room, [`${index}`] : 1 });
    }
    catch(err) {
      console.log(err);
    }
}
  /**POP UP PERSONALITY ANALYSIS */
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handlePopoverClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  /**HANDLE SELECTED LISTING */
  const [on, setOn] = React.useState(false);
  const [ind, setInd] = React.useState(null);
  function handleClickOpen(i){
    props.updateSelected(listings[i].lid);
    setInd(i);
    for (var j = 0 ; j < req.length; j ++) {
      if (req[j].lid == listings[i].lid) {
        var temp = room;
        for (var index = 0 ; index < listings[i].price.length; index ++) {
          if (req[j].content == listings[i].fromDate[index]+ ' '+listings[i].toDate[index]+ ' '+listings[i].price[index]+ ' '+listings[i].rooming[index]+ ' '+listings[i].roomType[index]){
            temp[index] = 1;
            break;
          }
        }
        setRoom(temp);
      }
    }
    setOn(true);
  }
  function handleClose() {
    setRoom({});
    setOn(false);
    setInd(null);
  }
  
  
  /**HANDLE MOUSE HOVERING */
  function handleHovered(e) {
    props.updateHovered(e);
  }
  function unhandleHovered(e) {
    props.updateHovered(null);
  }
  /** DISPLAY */
  const displayPrice = (array) => (
    <div>
      {array.map((key, index) => (
        <div key={index}>${array[index]}</div>
      ))}
    </div>
  )
  const displayRoomingRoomType = (a, b) => (
    <div>
      {a.map((key, index) => (
        <div key={index}>{a[index]}{' '}{b[index]}</div>
      ))}
    </div>
  )
  const displayRooms = (i) => (
    listings[i].price.map((key, index) => (
      <ListItem key={index}>
      <Grid container alignItems="center">
          <Grid item xs = {2}>
              <Typography variant="body2"color='secondary'>${listings[i].price[index]} </Typography>
          </Grid>
          <Grid item xs = {3}>
              <Typography variant="body2"color='textPrimary'>{listings[i].roomType[index]} {listings[i].rooming[index]}</Typography>
          </Grid>
          <Grid item xs>
                <Grid container>
                    <Grid item><Typography variant="body2"color='secondary'>{listings[i].fromDate[index]}</Typography></Grid>
                    <Grid item><Typography className={classes.textPadding} variant="caption"color='textSecondary'>to</Typography></Grid>
                    <Grid item><Typography variant="body2"color='secondary'>{listings[i].toDate[index]}</Typography></Grid>
                </Grid>
          </Grid>
          <Grid item xs = {2} >
                {room && room[index] &&(
                    <Button color='primary' disabled>Requested</Button>
                )}
                {!room || !room[index] &&(
                    <Button color='primary'
                onClick={() => requestAPI(index, listings[i].owner[0], listings[i].lid, listings[i].fromDate[index], listings[i].toDate[index],listings[i].price[index],listings[i].rooming[index],listings[i].roomType[index])}
                >Request
                </Button>
                )}
          </Grid>
          
        </Grid>
      </ListItem>
    ))
)

  

  return (
    <React.Fragment>
      <CssBaseline />
      <Paper square className={classes.paper}>
        <List className={classes.list}>
        {favoriteListings.map(({ lid, bed, bath, roomType, owner }) => (
            <React.Fragment key={lid}>
              <ListSubheader className={classes.subheader}>Favorited</ListSubheader>
              <ListItem button className={classes.listItem}>
                <ListItemAvatar>
                  <Avatar alt="Profile Picture" />
                </ListItemAvatar>
                <ListItemText primary={roomType} secondary={owner[1]} />
              </ListItem>
            </React.Fragment>
          ))}
          <ListSubheader className={classes.subheader}>Recent</ListSubheader>
          {listings.map( (key, index) => (
          <React.Fragment key={index}>
          <ListItem 
            button
            onClick={() => handleClickOpen(index)}
            onMouseEnter={() => handleHovered(listings[index].lid)}
            onMouseLeave={() => unhandleHovered(listings[index].lid)}
          >
          <ListItemAvatar><Avatar alt="Profile Picture" /></ListItemAvatar>
          <Grid item xs={12} sm container>
            <Grid item xs container direction="column" spacing={2}>
              <Grid item xs>
                {/**TITLE OF LISTING */}
                <Typography variant="subtitle1">
                  {displayRoomingRoomType(listings[index].roomType, listings[index].rooming)}
                </Typography>
                <Typography gutterBottom variant="body2" color="textSecondary">
                  {listings[index].bed}bed{listings[index].bath}bath
                </Typography>
                <Typography 
                  variant="body2" 
                  aria-owns={open ? 'mouse-over-popover' : undefined}
                  aria-haspopup="true"
                  onMouseEnter={handlePopoverOpen}
                  onMouseLeave={handlePopoverClose}
                >
                {listings[index].owner[1]}
                </Typography>
                <Popover
                id="mouse-over-popover"
                className={classes.popover}
                classes={{paper: classes.popup}}
                open={open}
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                onClose={handlePopoverClose}
                disableRestoreFocus
                >
                <Typography>Personality Match Score</Typography>
                </Popover>
              </Grid>
            </Grid>
            <Grid item>
              <Typography gutterBottom variant="subtitle1" color="secondary">
                {displayPrice(listings[index].price)}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {listings[index].count} people
              </Typography>
            </Grid>            
          </Grid>
          </ListItem>
          </React.Fragment>
          ))}
        </List>
      </Paper>

      {/**POP UP ****************************************************/}
      {ind!=null && (<div>
      <Dialog
        open={on}
        onClose={handleClose}
        scroll='paper'
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        maxWidth='sm'
        fullWidth
      >
        <Submap coordinates={[listings[ind].longitude, listings[ind].latitude]} />
        <DialogTitle id="scroll-dialog-title">
          {listings[ind].bed}bed{listings[ind].bath}bath
        </DialogTitle>
        <DialogContent>
          {displayRooms(ind)}
        </DialogContent>
        <DialogContent dividers>
          <DialogContentText
            tabIndex={-1}
          >
            {listings[ind].description}            
          </DialogContentText>
          <DialogContentText
            tabIndex={-1}
          >
            Building: {listings[ind].building}
          </DialogContentText>
          <DialogContentText
            tabIndex={-1}
          >
            Laundry: {listings[ind].laundry}
          </DialogContentText>
          {listings[ind].doorman && (
            <DialogContentText
            tabIndex={-1}
          >
            Doorman
          </DialogContentText>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Favorite
          </Button>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>)}
    </React.Fragment>
  );
}
