import React, { useEffect } from 'react';
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
  }
}));

export default function ListingResults(props) {
  const classes = useStyles();
  var listings = props.listings;
  var favoriteListings = props.favoriteListings;
  if (!listings) listings = [];
  if (!favoriteListings) favoriteListings = [];
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
  function handleClickOpen(e){
    console.log('clicked a listing', listings[e].lid);
    props.updateSelected(listings[e].lid);
    setInd(e);
    setOn(true);
  }
  function handleClose() {
    setOn(false);
  }
  
  
  /**HANDLE MOUSE HOVERING */
  function handleHovered(e) {
    console.log('hovering over a listing', e);
    props.updateHovered(e);
  }
  function unhandleHovered(e) {
    props.updateHovered(null);
  }
  

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
          {listings.map( (key, index) => (
          <React.Fragment key={index}>
          <ListSubheader className={classes.subheader}>Recent</ListSubheader>
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
                <Typography gutterBottom variant="subtitle1">
                {listings[index].roomType} {listings[index].bed}bed{listings[index].bath}bath
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
                {listings[index].doorman &&(
                <Typography variant="body2" color="textSecondary">
                Doorman: <CheckIcon fontSize='small'/>
                </Typography>
                )}
                {!listings[index].doorman && (
                <Typography variant="body2" color="textSecondary">
                Doorman: <CloseIcon fontSize='small'/>
                </Typography>
                )}
                <Typography variant="body2" color="textSecondary">
                  Building: {listings[index].building}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Laundry: {listings[index].laundry}
                </Typography>
              </Grid>
            </Grid>
            <Grid item>
              <Typography gutterBottom variant="subtitle1">
                ${listings[index].price}
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

      {/**POP UP */}
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
          {listings[ind].roomType} {listings[ind].bed}bed{listings[ind].bath}bath
        </DialogTitle>
        <DialogContent>{listings[ind].address}</DialogContent>
        <DialogContent> Roomates: </DialogContent>
        <DialogContent>${listings[ind].price}</DialogContent>
        <DialogContent dividers>
          <DialogContentText
            id="scroll-dialog-description"
            tabIndex={-1}
          >
            {listings[ind].description}            
          </DialogContentText>
          <DialogContentText
            id="scroll-dialog-description"
            tabIndex={-1}
          >
            Building: {listings[ind].building}
          </DialogContentText>
          <DialogContentText
            id="scroll-dialog-description"
            tabIndex={-1}
          >
            Laundry: {listings[ind].laundry}
          </DialogContentText>
          {listings[ind].doorman && (
            <DialogContentText
            id="scroll-dialog-description"
            tabIndex={-1}
          >
            Doorman
          </DialogContentText>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Request
          </Button>
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
