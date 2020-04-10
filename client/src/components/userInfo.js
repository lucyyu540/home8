import React, { Fragment , useEffect} from "react";
import { useAuth0 } from "../react-auth0-spa";
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import { Link, useParams } from "react-router-dom";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
/** STTYLE */
import '../App.css'

/** ICONS */
import Divider from '@material-ui/core/Divider';
import EditIcon from '@material-ui/icons/Edit';

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
      overflow: 'scroll',
    },
    paper: {
      maxWidth: 350,
      margin: `${theme.spacing(4)}px`,
      marginRight: 'auto',
      padding: theme.spacing(2),
    },
    list: {
        textAlign:'center'
    },
    button: {
      float: 'right'
    }
  }));
  


export default function Profile(props){
    const classes = useStyles();
    const { loading, user, isAuthenticated } = useAuth0();
  const [showResult, setShowResult] = React.useState(false);
  const [thisUser, setThisUser] = React.useState({
    email: null,
    username: null,
    firstName: null,
    lastName: null,
    phone: null,
    nationality: null,
    dob: null,
    gender: null,
    genderPreference: null
  });
  const { getTokenSilently } = useAuth0();
  const getProfile = async (username) => {
    try {
      const token = await getTokenSilently();
      const response = await fetch(`https://localhost:3000/${username}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }, 
        method: 'put', 
      });
      const responseData = await response.json();
      setShowResult(true);
      setThisUser({
        username: responseData.username,
        firstName: responseData.firstName,
        lastName: responseData.lastName,
        gender: responseData.gender,
        nationality: responseData.nationality,
        dob: responseData.dob.substring(0,responseData.dob.indexOf('T'))
      });
      console.log(responseData)
    } catch (error) {
      console.log(error)
    }
  };

  const username = props.username;
  useEffect( ()=> {
    if (username) getProfile(username);
  }, [loading] )
  console.log(thisUser);
  console.log(props.match);
  


  return (


  
    <div className={classes.root}> 
        <Paper className={classes.paper}>
          {isAuthenticated && user.nickname === username && (
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            startIcon={<EditIcon/>}
            size="small"
            component={Link} to={`/${user.nickname}/edit`}>Edit</Button>
          )}
          <ListItem></ListItem>
          <List className={classes.list}>
            <div item className='name'> @{thisUser.username}</div>
            <Divider/>
            <ListItem item>Name: {thisUser.firstName } {thisUser.lastName } </ListItem>
            <ListItem item>Date of Birth: {thisUser.dob}</ListItem>
            <ListItem item>Gender: {thisUser.gender}</ListItem>
            <ListItem item>Nationality: {thisUser.nationality}</ListItem>
          </List>
        </Paper>

        <Paper className={classes.paper}>
          <List  className={classes.list}>
            <ListItem>Load Private information here</ListItem>
          </List>
        </Paper>
    </div>
      
  );
};

