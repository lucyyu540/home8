import React, { useEffect }  from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useAuth0, user } from "../react-auth0-spa";
import {useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import Box from '@material-ui/core/Box';
import Snackbar from '@material-ui/core/Snackbar';


/**LIST */
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import ListItemIcon from '@material-ui/core/ListItemIcon';

/**ICONS */
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
import { Button } from '@material-ui/core';

/**MAP */
import Geocode from "react-geocode";
/**MY MODULES */
import Submap from './submap';
import '../App.css'
import config from "../auth_config.json";
import { add } from 'ol/coordinate';

/**SEARCH BY ADDRESS */
Geocode.setApiKey(config.GOOGLE_API_KEY);
Geocode.setLanguage("en");
Geocode.enableDebug();


const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow:1,
        overflow:'auto',
        height: '92vh',
    },

  button: {
    padding: theme.spacing(1),
  },
  center: {
    textAlign: 'center'
  },
  right: {
    float:'right',
  },
  left:{
    float:'left'
  },
  body: {
    padding: theme.spacing(5),
  },
  box: {
    margin: theme.spacing(1),
    padding: theme.spacing(0,1),
  },
  header: {
    padding: theme.spacing(5,0)
  },
  bottomPadding: {
    padding: theme.spacing(0,0,5)
  },
  divider: {
    margin: theme.spacing(5,0,0)
  }
}));

export default function Listing(props) {
  const classes = useStyles();
  const { getTokenSilently, user,isAuthenticated } = useAuth0();
  const lid = useParams().lid;
  const [listing, setListing] = React.useState({
    longitude : 0, 
    latitude : 0,
    mates: [],
    price : []
})

  /**API CALLS */
  useEffect(() => {
    if (user) privateAPI();
    else publicAPI();
  }, [user]) 
  console.log(listing);
  async function privateAPI() {
    try{
      const token = await getTokenSilently();
      const response = await fetch(`https://localhost:3000/private/listing/${lid}`, {
          headers: {
              Authorization: `Bearer ${token}`,
            }, 
          method: 'get', 
      });
      const responseData = await response.json();
      setListing(responseData);
    }
    catch(err) {
      console.log(err);
    }
  }
  async function publicAPI() {
    try{
        const response = await fetch(`https://localhost:3000/listing/${lid}`, {
            method: 'get', 
        });
        const responseData = await response.json();
        setListing(responseData);
      }
      catch(err) {
        console.log(err);
      }
  }
  const displayRooms = () => (
      listing.price.map((key, index) => (
        <ListItem key={index}>
        <Grid container>
            <Grid item xs = {2}>
                <Typography variant="body1"color='secondary'>{listing.price[index]} </Typography>
            </Grid>
            <Grid item xs = {8}>
                <Typography variant="body1"color='textPrimary'>{listing.roomType[index]} {listing.rooming[index]}</Typography>
            </Grid>
            <Grid item xs = {2}>
                <Button color='primary'>Request</Button>
            </Grid>
          </Grid>
        </ListItem>
      ))
)
 
  
  return (
    <div className={classes.root}>
    <Submap coordinates={[listing.longitude,listing.latitude]} />
    <List className={classes.body}>
        <List className={classes.left}>
        {/**id */}
        <Typography variant="body2"color='textSecondary' >
            id: {listing.lid}
        </Typography>
         {/**owner profile link */}
        <Typography variant="body2"color='textSecondary' className={classes.bottomPadding}>
            owner: 
            {listing.owner && (
            <Typography variant="body2"color='textSecondary' component={Link} to={`/${listing.owner[1]}`}>
            {' '} {listing.owner[1]}
            </Typography>)}
        </Typography>
            
        </List>

        <List className={classes.right}>
        {/**IF OWNER, LINK TO EDITING LISTING */}
        {listing.owner && listing.owner[0] == user.sub && (<Button
            color="primary"
            startIcon={<EditIcon/>}
            className={classes.button}
            component={Link} to={`/my-listings/${listing.lid}`}
            variant='outlined'
            >
              Edit Listing
        </Button>)}
        {/**count */}
        <ListItem >
            <Typography variant="body2"color='textSecondary' >
                {listing.count} people
            </Typography>
        </ListItem>

        </List>
      
   
      {/**MATES */}
      <ListItem>
        {listing.mates.map( (key,index) => ( 
          <Button color='primary' component={Link} to={`/${listing.mates[index][1]}`} key={'Profile'}>{listing.mates[index][1]}</Button>
        ))
        }
      </ListItem>
      {/**BODY******************************************** */}
      {/** if resident: 
       * title: address
       */}
        {/**if resident, reveal address */}
      <ListItem>
      <Typography variant="h5"color='textPrimary' className={classes.header}>
        {listing.address}
      </Typography>
      </ListItem>
       {/**if not resident, title of listing page */}
      {!listing.address &&(
        <div>
        <Typography variant="h5"color='textPrimary' className={classes.header}>
           {listing.bed}Bed{listing.bath}Bath
        </Typography>
        <Typography variant="body2"color='textSecondary' className={classes.bottomPadding}>
           {listing.description}
        </Typography>
        </div>
      )}
      <Divider/>
        {/**show room availability */}
      {listing.price && (<ListItem>
        <Typography variant="h5"color='textPrimary' className={classes.header}>
            Space Available
        </Typography>
      </ListItem>)}
        {displayRooms()}
        <Divider className={classes.divider} />
         {/**building amenities */}
        <ListItem>
            <Typography variant="h5"color='textPrimary' className={classes.header}>
                Building Amenities
            </Typography>
        </ListItem>
        <ListItem>
            <Typography variant="body2"color='textSecondary'>
                Building: {listing.building}
            </Typography>
        </ListItem>
        <ListItem>
            <Typography variant="body2"color='textSecondary'>
                Laundry: {listing.laundry}
            </Typography>
        </ListItem >
        {listing.doorman==1 && (<ListItem >
            <Typography variant="body2"color='textSecondary'>
                Doorman: Yes
            </Typography>
        </ListItem>)}
        {listing.doorman==0 && (<ListItem >
            <Typography variant="body2"color='textSecondary'>
                Doorman: No
            </Typography>
        </ListItem>)}
        </List>
    </div>
  );
}
