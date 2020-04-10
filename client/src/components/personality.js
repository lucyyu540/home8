import React from 'react';
import Paper from '@material-ui/core/Paper';
import { Link, useParams } from "react-router-dom";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { makeStyles } from '@material-ui/core/styles';

/**STYLES */
import '../App.css'
const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 2,
      overflow: 'scroll',
      padding: theme.spacing(0, 3),
    },
    paper: {
      maxWidth: 400,
      margin: `${theme.spacing(4)}px auto`,
      padding: theme.spacing(2),
      //right: 30
    },
    list: {
        textAlign:'center'
    },
  }));
export default function Personality(props) {
    const classes = useStyles();
    return( 
        
        <div className={classes.root}>
            <Paper className={classes.paper}>
                <div className='name'color ='primary'>personality analysis</div>

            </Paper>
            
        </div>
    );
}