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

/**Expansion panel */
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
/**ICONS */
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Avatar from '@material-ui/core/Avatar';
import Badge from '@material-ui/core/Badge';
import Divider from '@material-ui/core/Divider';
import InputAdornment from '@material-ui/core/InputAdornment';
import SendIcon from '@material-ui/icons/Send';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import CloseIcon from '@material-ui/icons/Close';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';


/**MY MODULES */
import Listing from './editListing'
import { ListItemIcon, Icon } from '@material-ui/core';
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
  panelHeader: {
    padding: theme.spacing(3),
    //color: theme.palette.primary.main
  },
  selectedPanelHeader: {
    color: 'primary'
  },
  userButton : {
    color: theme.palette.primary.main,
    margin: theme.spacing(2),
    padding: theme.spacing(1)
  }
}));

export default function ListingResults() {
  const classes = useStyles();
  const { getTokenSilently, user } = useAuth0();
  const [current, setCurrent] = React.useState(null);
  const [past, setPast] = React.useState(null);
  const [mates, setMates] = React.useState(null);
  /**HANDLE FUNCTIONS **************************************************** */

  /**API CALLS********************************************************** */
  async function loadAll(req) {
    try {
      const token = await getTokenSilently();
      const response = await fetch(`https://localhost:3000/private/residence/history`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }, 
        method: 'get'
      });
      const responseData = await response.json();
      setCurrent(responseData.currentResidence);
      setPast(responseData.pastResidence);
      setMates(responseData.mates)
      console.log(responseData);
    }
    catch(err) {
      console.log(err);
    }
  }
  async function getMates(req) {
    try {
      const token = await getTokenSilently();
      const data = {
      }
      await fetch(`https://localhost:3000/private/residence/mates`, {
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

  /**********************USE EFFECT************************************ */
  
  useEffect(() => {
    loadAll();
  },[])

  /**********************DISPLAY************************************ */

  const displayHomes = (homes) => (
    <Grid container direction="column">
    <Divider/>
    {homes.map((key, index) => (
      <Grid item key={index}>
      <Grid container alignItems="center">
        <Grid item xs={10} >
                <Typography>{homes[index].address}</Typography>
        </Grid>
        <Grid item xs = {2}>
          <IconButton color="primary" component={Link} to={`/listing/${homes[index].lid}`}> 
            <ArrowForwardIcon/>
          </IconButton>
        </Grid>
      </Grid>
      </Grid>
        ))}
    </Grid>
  )
  const displayMates = (mates) => (
    <Grid container direction="column">
    <Divider/>
    {mates.map((key, index) => (
      <Grid item key={index}>
      <Grid container alignItems="center">
        <Grid item xs={10} >
          <Button
          className={classes.userButton}
           component={Link} 
           to={`/${mates[index].username}`}
          >{mates[index].username}</Button>
        </Grid>
        <Grid item xs = {2}>
          <IconButton color="primary"> 
            <ArrowForwardIcon/>
          </IconButton>
        </Grid>
      </Grid>
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
        <ExpansionPanel>
        <ExpansionPanelSummary className={classes.panelHeader} expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.selectedPanelHeader}>Current Home</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          {current!=null &&( 
              displayHomes(current)
        )}
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel>
        <ExpansionPanelSummary  className={classes.panelHeader} expandIcon={<ExpandMoreIcon />}>
          <Typography>Past Homes</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
        {past!=null &&( 
              displayHomes(past)
        )}
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel>
        <ExpansionPanelSummary  className={classes.panelHeader} expandIcon={<ExpandMoreIcon />}>
          <Typography>Your Mates</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
        {mates!=null &&( 
              displayMates(mates)
        )}
        </ExpansionPanelDetails>
      </ExpansionPanel>

      </Paper>
    </Paper>
    </div>
    </div>
  );
}
