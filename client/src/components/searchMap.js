import React, { Fragment , useEffect} from "react";
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


Geocode.setApiKey(config.GOOGLE_API_KEY);
Geocode.setLanguage("en");
Geocode.enableDebug();


export default function CustomizedInputBase() {
  const classes = useStyles();
  const [searchInput, setSearchInput] = React.useState("");
  const [searchCoordinates, setSearchCoordinates] = React.useState(null);
  const [needToChange, setNeedToChange] = React.useState(false);
  function mapUpdatedChange() {
    setNeedToChange(false);
  }
  /**HANDLE FUNCTIONS */
  function handleSearchInput(e) {
    setSearchInput(e.target.value);
  }
  function handleSearchClick(e) {
    if (searchInput === "") return;
    Geocode.fromAddress(searchInput).then(
      response => {
        const { lat, lng } = response.results[0].geometry.location;
        setNeedToChange(true);
        setSearchCoordinates({longitude : lng, latitude: lat});
      },
      error => {
        console.error(error);
      }
    );
  }
  /**console.log('longs and lat retrieved from search area: ')
  console.log(longitude);
  console.log(latitude);*/
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
        onChange={handleSearchInput}
      />
      <IconButton 
      //type="submit" 
      className={classes.iconButton} 
      aria-label="search"
      onClick={handleSearchClick}
      >
        <SearchIcon />
      </IconButton>
      <Divider className={classes.divider} orientation="vertical" />
      <IconButton color="secondary" className={classes.iconButton} aria-label="directions">
        <DirectionsIcon />
      </IconButton>
      
    </Paper>

    {/**MAP */}
    <Map needToChange={needToChange} searchCoordinates={searchCoordinates} mapUpdatedChange={mapUpdatedChange}/>
    </div>
  );
}
