import React from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
/**ICONS/STYLES*/
import SearchIcon from '@material-ui/icons/Search';
import DirectionsIcon from '@material-ui/icons/Directions';
import Divider from '@material-ui/core/Divider';

/**GEO */
import Geocode from "react-geocode";

/**MY MODULES */
import Map from './map'
import config from "../auth_config.json";


const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      top: 0,
      paddingBottom: 50,
      width:"50%"
    },
    paper: {
      padding: '2px 4px',
      display: 'flex',
      alignItems: 'center',
    },
    input: {
      marginLeft: theme.spacing(2),
      flex: 1,
    },
    iconButton: {
      padding: 10,
    },
    divider: {
      height: 28,
      margin: 4,
    },
  }),
);
function handleSearch(e) {


}


Geocode.setApiKey(config.GOOGLE_API_KEY);
Geocode.setLanguage("en");
Geocode.enableDebug();

Geocode.fromLatLng("48.8583701", "2.2922926").then(
  response => {
    const address = response.results[0].formatted_address;
    console.log(address);
  },
  error => {
    console.error(error);
  }
);

export default function CustomizedInputBase() {
  const classes = useStyles();

  return (
    <div className={classes.root}>

    {/**SEARCH */}
    <Paper 
    color='default'
    component="form" 
    className={classes.paper} 
    square
    >
      <InputBase
        className={classes.input}
        placeholder="Search area"
        inputProps={{ 'aria-label': 'search map' }}
      />
      <IconButton 
      type="submit" 
      className={classes.iconButton} 
      aria-label="search"
      onClick={handleSearch}
      >
        <SearchIcon />
      </IconButton>
      <Divider className={classes.divider} orientation="vertical" />
      <IconButton color="secondary" className={classes.iconButton} aria-label="directions">
        <DirectionsIcon />
      </IconButton>
      
    </Paper>

    {/**MAP */}
    <Map />
    </div>
  );
}
