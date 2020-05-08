import React,{ useEffect } from 'react';

import Paper from '@material-ui/core/Paper';
import { Link, useParams } from "react-router-dom";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Grid from '@material-ui/core/Grid';

import { makeStyles } from '@material-ui/core/styles';
import { useAuth0, user } from "../react-auth0-spa";
/**FORM */
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

import { ResponsivePie } from '@nivo/pie'
import Typography from '@material-ui/core/Typography';


/**STYLES */
import '../App.css'
import { ListItemText, Divider } from '@material-ui/core';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { red } from '@material-ui/core/colors';
const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    paper: {
      width: 400,
      maxHeight: 530,
      paddingBottom: 50,
      margin: `${theme.spacing(4)}px `,
      //padding: theme.spacing(2),
      flexGrow:1,
      overflow: 'auto',
    },
    secondPaper: {
      padding: theme.spacing(2),
      backgroundColor: '#818385',
      //232324,818385
      display: 'flex',
      width: 250,
      margin: `${theme.spacing(4)}px `
    },
    list: {
        textAlign:'center',
    },
  }));
export default function Personality(props) {
    const classes = useStyles();
    const { getTokenSilently, user,isAuthenticated } = useAuth0();
    const username = useParams().username;
    const [ans, setAns] = React.useState(0);
    const [qTemp, setQTemp] = React.useState({});
    const [data, setData] = React.useState([{
      "id": "complete",
      "label": "complete",
      "value": 0,
      },
      {
      "id": "incomplete",
      "label": "incomplete",
      "value": 0,
    } ]);
    const [match, setMatch] = React.useState([{
      "id": "pos",
      "label": "pos",
      "value": 0,
      },
      {
      "id": "neg",
      "label": "neg",
      "value": 0,
    } ]);
    /**API FUNCTIONS */
    const getQuestion = async () => {
      try {
        const token = await getTokenSilently();
        const response = await fetch(`https://localhost:3000/private/get-question`, {
            headers: {
                Authorization: `Bearer ${token}`,
              }, 
            method: 'get', 
        });
        const responseData = await response.json();//question template
        setQTemp(responseData.qTemp);
        setData(
          [{
            "id": "complete",
            "label": "complete",
            "value": responseData.x-1,
            },
            {
            "id": "incomplete",
            "label": "incomplete",
            "value": responseData.n-responseData.x+1,
          } ]);
          setAns(0);
      }
      catch(err) {
        console.log(err);
      }
    }
    async function getComparison(username) {
      try{
        const token = await getTokenSilently();
        const data = {
          username: username
        }
        const response = await fetch(`https://localhost:3000/private/compare`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
              }, 
            method: 'put', 
            body: JSON.stringify(data)
        });
        const responseData = await response.json();//similarity
        setMatch(
          [{
            "id": "pos",
            "label": "pos",
            "value": responseData.score,
            },
            {
            "id": "neg",
            "label": "neg",
            "value": 100 - responseData.score,
          } ]);
      }
      catch(err) {
        console.log(err);
      }

    }
    async function submitAnswer() {
      try{
        const token = await getTokenSilently();
        const data = {
          qid: qTemp.qid,
          ans: ans
        }
        const response = await fetch(`https://localhost:3000/private/submit-answer`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
              }, 
            method: 'put', 
            body: JSON.stringify(data)
        });
        getQuestion();

      }
      catch(err) {
        console.log(err);
      }
    }
    useEffect(() => {
      if (user) {
        if (user.nickname === username) {
          getQuestion();
        }
        else {
          getComparison(username);
        }

      }
    }, [user]);
    /**HANDLE FUNCTIONS */
    function handleChange(e) {
      setAns(e.target.value);
    }
    const pie = (data) => (
      <ResponsivePie
          data={data}
          margin={{ top: 30, right: 30, bottom: 0, left: 30 }}
          fit={false}
          pixelRatio={2}
          startAngle={-90}
          endAngle={90}
          innerRadius={0.85}
          colors={{ scheme: 'nivo' }}
          borderWidth={1}
          enableRadialLabels={false}
          radialLabelsSkipAngle={10}
          radialLabelsTextXOffset={6}
          radialLabelsTextColor="#333333"
          radialLabelsLinkOffset={0}
          radialLabelsLinkDiagonalLength={16}
          radialLabelsLinkHorizontalLength={24}
          radialLabelsLinkStrokeWidth={1}
          radialLabelsLinkColor={{ from: 'color' }}
          enableSlicesLabels={false}
          slicesLabelsSkipAngle={10}
          slicesLabelsTextColor="#333333"
          animate={true}
          motionStiffness={90}
          motionDamping={15}
          isInteractive={false}          
      />
  )    
    const displayQuestion = () => (
      <div>
        <div style={ { height: '150px' }}>{pie(data)}</div>
        <Grid container direction='column' alignItems='center'>
            <Grid item>{data[0].value} out of {data[0].value + data[1].value} complete</Grid>
            <Grid item className='name'>Q:</Grid>
            <Grid item>
              <Paper className={classes.secondPaper} square>
                <List>
                <Typography >{qTemp.question}</Typography>
                {qTemp.one && (<Typography color='secondary'>1: {qTemp.one}</Typography>)}
                {qTemp.two && (<Typography color='secondary'>2: {qTemp.two}</Typography>)}
                {qTemp.three && (<Typography color='secondary'>3: {qTemp.three}</Typography>)}
                {qTemp.four && (<Typography color='secondary'>4: {qTemp.four}</Typography>)}
                {qTemp.five && (<Typography color='secondary'>5: {qTemp.five}</Typography>)}
                </List>
               
              </Paper>
          </Grid>
        </Grid>

      {data[1].value>0 && (<Grid
        container
        direction="row"
        justify="center"
        alignItems="flex-start"
        >
       <FormControl component="fieldset">
      <RadioGroup value={ans} row aria-label="personalityA" name="personalityA"
      onChange={handleChange}>
        <FormControlLabel
          value="1"
          control={<Radio color="primary" size="small"/>}
          label="1"
          labelPlacement="top"
        />
        <FormControlLabel
          value="2"
          control={<Radio color="primary" size="small"/>}
          label="2"
          labelPlacement="top"
        />
        <FormControlLabel
          value="3"
          control={<Radio color="primary" size="small"/>}
          label="3"
          labelPlacement="top"
        />
        <FormControlLabel
          value="4"
          control={<Radio color="primary" size="small"/>}
          label="4"
          labelPlacement="top"
        />
        <FormControlLabel
          value="5"
          control={<Radio color="primary" size="small"/>}
          label="5"
          labelPlacement="top"
        />
      </RadioGroup>
    </FormControl>
    </Grid>)}

    <List>
      <ListItem button disabled={!ans} onClick={submitAnswer} type='submit'>
        <ListItemText className={classes.list}>
        <NavigateNextIcon />
        </ListItemText>
      </ListItem>
    </List>
    

      </div>
    );
    const matchPie = (match) => (
      <ResponsivePie
          data={match}
          margin={{ top: 30, right: 30, bottom: 0, left: 30 }}
          fit={false}
          pixelRatio={2}
          innerRadius={0.85}
          colors={{ scheme: 'nivo' }}
          borderWidth={1}
          enableRadialLabels={false}
          radialLabelsSkipAngle={10}
          radialLabelsTextXOffset={6}
          radialLabelsTextColor="#333333"
          radialLabelsLinkOffset={0}
          radialLabelsLinkDiagonalLength={16}
          radialLabelsLinkHorizontalLength={24}
          radialLabelsLinkStrokeWidth={1}
          radialLabelsLinkColor={{ from: 'color' }}
          enableSlicesLabels={false}
          slicesLabelsSkipAngle={10}
          slicesLabelsTextColor="#333333"
          animate={true}
          motionStiffness={90}
          motionDamping={15}
          isInteractive={false}          
      />
  )
    const displayComparison = () => (
      <div>
        <div style={ { height: '50vh' }}>{matchPie(match)}</div>
        <Grid container direction='column' alignItems='center'>
          <Grid item>
          <Paper className={classes.secondPaper}>
            <Grid container direction='column' alignItems='center' justify='center'>
              <Grid item>
                <Typography style={{fontFamily:'digit', fontSize:'3vh'}} color='secondary'>
                match score
                </Typography>
              </Grid>
              <Grid item>
                <Typography style={{fontFamily:'digit', fontSize:'8vh'}}>
                {match[0].value.toFixed(2)}%
                </Typography>
              </Grid>
            </Grid>
          </Paper>
          <Divider style={{margin:'theme.spacing(3,0)'}}/>
          </Grid>
          <Grid item>

          </Grid>
       
        </Grid>
        
      </div>
    );

    return( 
        
        <div className={classes.root}>
            <Paper className={classes.paper}>
                {isAuthenticated && user.nickname === username && (
                    <div>
                      {displayQuestion()}
                    </div>
                  )}
                {isAuthenticated && user.nickname != username&& (
                    displayComparison()
                )}
                {!isAuthenticated && (
                    <div>
                      log in to compare
                    </div>
                )}
            </Paper>            
        </div>
    );
}