import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { useAuth0, user } from "../react-auth0-spa";
import {useParams } from "react-router-dom";

/**LIST */
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
/**ICONS */
import AddIcon from '@material-ui/icons/Add';

/**MY MODULES */
import Listing from './editListing'
import { ListItemIcon } from '@material-ui/core';
import '../App.css'

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow:1,
        minWidth: '35%'
    },
  text: {
    padding: theme.spacing(2, 2, 0),
  },
  paper: {
    top: 0,
    paddingBottom: 50,
    height:'85vh',
  },
  list: {
    marginBottom: theme.spacing(2),
  },
  listItem : {
    margin: theme.spacing(2),
  },
}));

export default function ListingResults() {
  const classes = useStyles();
  const { getTokenSilently, user } = useAuth0();
  const [listings, setListings] = React.useState([]);
  const lid = useParams().lid;


  /**HANDLE SELECTED LISTING */
  const [ind, setInd] = React.useState(null);
  function handleClickOpen(e){
    setInd(e);
    if (e == listings.length) {
      const newListing = {
        longitude: 0,
        latitude: 0,
        active: 1
      }
      listings.push(newListing);
    }
    console.log(listings[e]);
  }


  async function getMyListings() {
    try {
        const token = await getTokenSilently();
        const response = await fetch(`https://localhost:3000/private/my-listings`, {
            headers: {
                Authorization: `Bearer ${token}`,
              }, 
            method: 'get', 
        });
        const responseData = await response.json();//question template
        setListings(responseData);
    }
    catch(err) {
        console.log(err);
    }
  }
  
  useEffect(() => {
      getMyListings();
      if (lid != 'all') {
        //find index of listing with lid
        for (var i = 0 ; i < listings.length; i ++) {
          if (listings[i].lid == lid) return setInd(i);
        }
      }
  }, [user, listings.length])

  const displayPrice = (array) => (
    <div>
      {array.map((key, index) => (
        <div key={index}>${array[index]}</div>
      ))}
    </div>
  )
  return (
    <div className='rowC'>
    <div className={classes.root}>
      <Paper square className={classes.paper}>
        <List className={classes.list}>
          {listings.map( (key, index) => (
          <React.Fragment key={index}>
          <ListItem 
            button
            onClick={() => handleClickOpen(index)}
          >
          <Grid item xs={12} sm container className={classes.listItem}>
            <Grid item xs container direction="column" spacing={2}>
              <Grid item xs>
                {listings[index].active==1 &&(
                    <Typography gutterBottom variant="subtitle1" color='secondary'>
                        {listings[index].address}
                    </Typography>
                )}
                {listings[index].active==0 &&(
                <Typography gutterBottom variant="subtitle1" color='textSecondary'>
                    {listings[index].address}
                </Typography>)}
              </Grid>
              <Grid item xs>
                <Typography variant="body2"color='textSecondary' >
                  id: {listings[index].lid}
                </Typography>
              </Grid>
            </Grid>
            <Grid item>
              <Typography gutterBottom variant="subtitle1">
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
          <ListItem button onClick={() => handleClickOpen(listings.length)}>
              <ListItemIcon><AddIcon/></ListItemIcon>
              <ListItemText>Add listing</ListItemText>
          </ListItem>
        </List>
      </Paper>
    </div>
    <div className={classes.root}>
        {ind!=null &&(
            <Listing 
            listing={listings[ind]} 
            getMyListings= {getMyListings}
            />
        )}
    </div>
    </div>
  );
}
