import React, {useEffect} from "react";
import { useAuth0 } from "../react-auth0-spa";
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import { Link, useParams } from "react-router-dom";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Grid from '@material-ui/core/Grid';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';

/**DIALOG */
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

/** STTYLE */
import '../App.css'

/** ICONS */
import Divider from '@material-ui/core/Divider';
import EditIcon from '@material-ui/icons/Edit';
import { Typography } from "@material-ui/core";
import Avatar from '@material-ui/core/Avatar';


const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    paper: {
      width: 350,
      maxHeight: 500,
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
    review: {
      margin: theme.spacing(2),
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
  const [dialog, setDialog] = React.useState(false);
  const [review, setReview] = React.useState(null);
  function handleDialogClose() {
    setDialog(false);
    setReview(null);
  }
  function handleDialogOpen(review) {
    setDialog(true);
    setReview(review);
  }

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
  
/**helper function */
function formatDate(date) {
  const d = new Date(date);
  const s = d.toString().split(" ")[1] + " " + d.getDate()+ ", "+ d.getFullYear();
  return s;
}
function formatPreview(text) {
  if (!text) return;
  if (text.length> 100) {
    return text.substring(0,100)+ "..."
  }
  else return text;
}
/**display functions */
const displayScore = (score) => (
  <div>
  {parseFloat(score) < 40 && (
    <Typography style={{fontFamily:'digit', fontSize:'25px', color:'red'}}>
    {score}%
    </Typography>)}
    {parseFloat(score) >= 40
    && parseFloat(score) < 80 &&(
    <Typography style={{fontFamily:'digit', fontSize:'25px', color:'orange'}}>
    {score}%
    </Typography>)}
    {parseFloat(score) >= 80 &&(
    <Typography color='secondary' style={{fontFamily:'digit', fontSize:'25px'}}>
    {score}%
    </Typography>)}
  </div>
)
const displayReviewDetails = (review) => (
  <Dialog
  open={dialog}
  onClose={handleDialogClose}
  scroll='paper'
  maxWidth='sm'
  fullWidth
>
  <DialogTitle>
    {displayScore(review.score)}
  </DialogTitle>

  <DialogContent dividers>
    {review.review}
  </DialogContent>
  <DialogActions>
    <Button onClick={handleDialogClose}>
    Close
    </Button>
  </DialogActions>
</Dialog>
)
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
            <Typography style={{fontFamily:'England', fontSize:'100px'}}> @{thisUser.username}</Typography>
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
          <Grid container justify='center'>
            <Grid item>
              <Typography style={{fontFamily:'Autography', fontSize:'50px'}}>
                Reviews
              </Typography>
            </Grid>
          </Grid>
          <Divider />
          <List>
            {thisUser.reviews && (thisUser.reviews.map((key, index) => (
              thisUser.reviews[index].review && (
              <ListItem  
              button 
              key={index}
              onClick={() => handleDialogOpen(thisUser.reviews[index])}
              >
                <Grid container alignItems='center'>
                  {/**SCORE */}
                  <Grid item xs={2}>
                    <Avatar alt="Profile Picture"/>
                  </Grid>
                  {/**REVIEW PREVIEW */}
                  <Grid item xs>
                    <Typography variant='body2'>
                      {formatPreview(thisUser.reviews[index].review)}
                    </Typography>
                  </Grid>
                </Grid>         
              </ListItem>
              )
            )))}
          </List>
        </Paper>
        {dialog && displayReviewDetails(review)}
    </div>
      
  );
};

