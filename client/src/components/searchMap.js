import React, { useEffect} from "react";
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
import GoogleMap from './googleMap'

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

/**SEARCH BY ADDRESS */
Geocode.setApiKey(config.GOOGLE_API_KEY);
Geocode.setLanguage("en");
Geocode.enableDebug();


export default function SearchMap(props) {
  const classes = useStyles();
  /**Range */
     //bottom left long lat: a, b
    //top right long lat: c, d
    //a, b, c , d,
    /** long --> x axis lat --> y axis
     * a,d  c,d
     * a,b  c,b
     */
  const [range, setRange] = React.useState([0,0,0,0]);
  function mapUpdateRange(value) {//child
    setRange(value);
  }
  useEffect(()=> {
    props.updateRange(range);//parent
  }, range);

  /**search area */
  const [searchInput, setSearchInput] = React.useState("");
  const [searchCoordinates, setSearchCoordinates] = React.useState(null);

  var listings = props.listings;
  var selected = props.selected;
  var hovered = props.hovered;

  /**HANDLE FUNCTIONS */
  function handleSearchInput(e) {
    setSearchInput(e.target.value);
  }
  function handleSearchClick() {
    if (searchInput === "") return;
    Geocode.fromAddress(searchInput).then(
      response => {
        const { lat, lng } = response.results[0].geometry.location;
        setSearchCoordinates({longitude : lng, latitude: lat});
      },
      error => {
        console.error(error);
      }
    );
  }
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


    {/**<GoogleMap />*/}
    {/**MAP */}
    <Map 
    searchCoordinates={searchCoordinates} 
    mapUpdateRange={mapUpdateRange}
    listings={listings}
    selected={selected}
    hovered={hovered}
    />
    </div>
  );
}
