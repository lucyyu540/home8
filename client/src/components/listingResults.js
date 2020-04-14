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

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Popover from '@material-ui/core/Popover';
/**ICONS */
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';

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

  const [anchorEl, setAnchorEl] = React.useState(null);
  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

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
          {listings.map(({ lid, building, doorman, laundry, owner , roomType, bed, bath, count}) => (
          <React.Fragment key={lid}>
          <ListSubheader className={classes.subheader}>Recent</ListSubheader>
          <ListItem button>
          <ListItemAvatar><Avatar alt="Profile Picture" /></ListItemAvatar>
          <Grid item xs={12} sm container>
            <Grid item xs container direction="column" spacing={2}>
              <Grid item xs>
                <Typography gutterBottom variant="subtitle1">
                {roomType} {bed}bed{bath}bath
                </Typography>
                <Typography 
                  variant="body2" 
                  aria-owns={open ? 'mouse-over-popover' : undefined}
                  aria-haspopup="true"
                  onMouseEnter={handlePopoverOpen}
                  onMouseLeave={handlePopoverClose}
                >
                Owner: {owner[1]}
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
                {doorman &&(
                <Typography variant="body2" color="textSecondary">
                Doorman: <CheckIcon fontSize='small'/>
                </Typography>
                )}
                {!doorman && (
                <Typography variant="body2" color="textSecondary">
                Doorman: <CloseIcon fontSize='small'/>
                </Typography>
                )}
                <Typography variant="body2" color="textSecondary">
                  Building: {building}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Laundry: {laundry}
                </Typography>
              </Grid>
            </Grid>
            <Grid item>
              <Typography variant="body2" color="textSecondary">
                {count} people
              </Typography>
            </Grid>            
          </Grid>
          </ListItem>
          </React.Fragment>
          ))}
        </List>
      </Paper>
    </React.Fragment>
  );
}
