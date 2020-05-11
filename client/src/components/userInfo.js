import React, {useEffect} from "react";
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
import { Typography } from "@material-ui/core";

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
      display: 'flex',
      width: 250
    },
    list: {
        alignItems:'center',
        textAlign:'center',
        justifyContent: 'center',
    },
    rightAlign: {
      textAlign:'right'
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
      //responseData.dob.substring(0,responseData.dob.indexOf('T'))
      const responseData = await response.json();
      setShowResult(true);
      setThisUser({
        username: responseData.username,
        firstName: responseData.firstName,
        lastName: responseData.lastName,
        gender: responseData.gender,
        nationality: responseData.nationality,
        dob: responseData.dob,
        reviews: responseData.reviews
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
  
/**heler function */
function formatDate(date) {
  const d = new Date(date);
  const s = d.toString().split(" ")[1] + " " + d.getDate()+ ", "+ d.getFullYear();
  return s;
}

  return (


  
    <div className={classes.root}> 
        <Paper className={classes.paper}>
          {/**EDIT IF USER */}
          {isAuthenticated && user.nickname === username && (
          <div className={classes.rightAlign}>
            <Button
            color="primary"
            startIcon={<EditIcon/>}
            className={classes.button}
            component={Link} to={`/user/${user.nickname}/edit`}
            >
              Edit
            </Button>
          </div>  
          )}
          <List className={classes.list}>
            <div className='name'> @{thisUser.username}</div>
            <ListItem className={classes.list}>
            <Paper variant="outlined" square className={classes.secondPaper}>
              <List>
                <ListItem >
                  <Typography variant="body2" >
                    {thisUser.firstName } {thisUser.lastName }
                  </Typography>
                </ListItem>
                {thisUser.dob && (
                <ListItem >
                  <Typography variant="body2" >
                  {formatDate(thisUser.dob)}
                  </Typography>
                </ListItem>)}
                {thisUser.gender && (<ListItem >
                  <Typography variant="body2" >
                    {thisUser.gender}
                  </Typography>
                </ListItem>)}
                {thisUser.nationality &&(<ListItem>
                  <Typography variant="body2" color='primary'>
                    {thisUser.nationality}
                  </Typography>
                </ListItem>)}
              </List>
            </Paper>
            </ListItem>
          </List>
        </Paper>

        <Paper className={classes.paper}>
          <List className={classes.list}>
            {thisUser.reviews && (thisUser.reviews.map((key, index) => (
              <ListItem key={index}>
                {thisUser.reviews[index].review}
              </ListItem>
            )
            ))}
            
          </List>
        </Paper>
    </div>
      
  );
};

