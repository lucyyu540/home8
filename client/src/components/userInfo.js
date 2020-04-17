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
    },
    paper: {
      width: 350,
      margin: `${theme.spacing(4)}px`,
      padding: theme.spacing(2),
      overflow: 'auto',
    },
    secondPaper: {
      padding: theme.spacing(2),
      //backgroundColor: '#232324',
      display: 'flex',
      width: 250
    },
    list: {
        alignItems:'center',
        textAlign:'center'
    },
    button: {
      float: 'right'
    },
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
          <List className={classes.list}>
            <div className='name'> @{thisUser.username}</div>
            <ListItem>
            <Paper variant="outlined" square className={classes.secondPaper}>
              <List className={classes.list}>
                <ListItem >{thisUser.firstName } {thisUser.lastName }</ListItem>
                <ListItem >{thisUser.dob}</ListItem>
                <ListItem >Gender: {thisUser.gender}</ListItem>
                <ListItem >Nationality: {thisUser.nationality}</ListItem>
              </List>
            </Paper>
            </ListItem>
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

