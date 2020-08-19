import React, { useEffect } from 'react';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { makeStyles, responsiveFontSizes } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import clsx from 'clsx';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
/**ICONS */
import AccountCircle from '@material-ui/icons/AccountCircle';
import MoreIcon from '@material-ui/icons/MoreVert';
import MenuIcon from '@material-ui/icons/Menu';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListIcon from '@material-ui/icons/List';
import MailIcon from '@material-ui/icons/Mail';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import HomeIcon from '@material-ui/icons/Home';
import { Link } from "react-router-dom";
import Divider from '@material-ui/core/Divider';
import Badge from '@material-ui/core/Badge';



/**AUTH0 */
import { useAuth0 } from '../react-auth0-spa';


const useStyles = makeStyles ( (theme) => ({
    AppBarTop: {
        top: 0,
        bottom: 'auto',
        backgroundColor: theme.palette.primary,
    },
    AppBarBottom: {
      top: 'auto',
      bottom: 0,
      backgroundColor: theme.palette.primary,
    },
    iconButton: {
      position: 'fixed',
      zIndex: 1,
      flexGrow: 1,
      right:20,
    },
    grow: {
      flexGrow: 1,
    },
    list: {
      width: 250,
    },
    fullList: {
      width: 'auto',
    },
}));
export default function NavBar() {
  
  const classes = useStyles();
  const { getTokenSilently, isAuthenticated, loginWithRedirect, logout, user } = useAuth0();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [noti, setNoti] = React.useState(0);
  /**HANDLE CHANGE */
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [state, setState] = React.useState({
    left: false,
  });
  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };
  async function getNotifications () {
    try{
      const token = await getTokenSilently();
      const response = await fetch(`https://localhost:3000/private/notification/inbox/unread`, {
          headers: {
              Authorization: `Bearer ${token}`,
            }, 
          method: 'get', 
      });
      const data = await response.json();//unread messages
      const count = await data.length;//notifications count
      console.log(data);
      setNoti(count);
    }
    catch(err) {
      console.log(err);
    }
  }
  /**SYNC EVERY MIN****************************************************************** */
  useEffect(()=> {
    if (user) {
      const interval = setInterval(() => {
        console.log('interval')
        getNotifications();
      }, 60000);//every min
      return () => clearInterval(interval);
    }
  }, [])
 /**SYNC EVERY MIN****************************************************************** */
  const list = (anchor) => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === 'top' || anchor === 'bottom',
      })}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      {!isAuthenticated && (
      <List>
          <ListItem 
          button key={'Log in/Register'}
          onClick={() => loginWithRedirect({
              appState: {targetUrl: window.location.pathname}
          })}>
            <ListItemIcon><ExitToAppIcon /></ListItemIcon>
            <ListItemText primary={'Log in/Register'} />
          </ListItem>
      </List>)}
      {isAuthenticated && (
      <List>
          <ListItem button component={Link} to='/' key={'Home'}>
            <ListItemIcon><HomeIcon /></ListItemIcon>
            <ListItemText primary={'Home'} />
          </ListItem>
          <ListItem button component={Link} to={`/user/${user.nickname}`} key={'Profile'}>
            <ListItemIcon><AccountCircle /></ListItemIcon>
            <ListItemText primary={'Profile'} />
          </ListItem>
          <ListItem button component={Link} to='/inbox' key={'Inbox'}>
            <ListItemIcon>
            <Badge badgeContent={noti} color='error'><MailIcon /></Badge>
            </ListItemIcon>
            <ListItemText primary={'Inbox'} />
          </ListItem>
      </List>
      
      )}
    {isAuthenticated && (<Divider />)}
    {isAuthenticated &&(
       <List>
         <ListItem button component={Link} to='/my-homes' key={'MyHomes'}>
            <ListItemIcon><ListIcon /></ListItemIcon>
            <ListItemText primary={'My homes'} />
          </ListItem>
          <ListItem button component={Link} to='/my-listings/all' key={'MyListings'}>
            <ListItemIcon><ListIcon /></ListItemIcon>
            <ListItemText primary={'My listings'} />
          </ListItem>
       </List>
    )}
    {isAuthenticated && (<Divider />)}
    {isAuthenticated &&(
       <List>
           <ListItem 
           button key={'Log out'}
           onClick={() => logout({})}>
             <ListItemIcon><ExitToAppIcon /></ListItemIcon>
             <ListItemText primary={'Log out'} />
           </ListItem>
       </List>
    )}


     
    </div>
  );

  
    return (
      <React.Fragment>
        <AppBar
        position='fixed'
        color='primary'
        className={classes.AppBarTop}
        >
          <IconButton
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            edge="end"
            className={classes.iconButton}
          >
            <AccountCircle/>
          </IconButton>
          {isAuthenticated && (
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={open}
            onClose={handleClose}
            >
              <MenuItem onClick={() => logout({})}>Log out</MenuItem>

            </Menu>
          )}
          {!isAuthenticated && (
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={open}
            onClose={handleClose}
            >
              <MenuItem onClick={() => loginWithRedirect({
              appState: {targetUrl: window.location.pathname}
          })}>Log in</MenuItem>
            </Menu>
          )}
        </AppBar>

        <AppBar 
        position="fixed" 
        className={classes.AppBarBottom}
        >
        <Toolbar>
          {['left'].map((anchor) => (
            <React.Fragment key={anchor}>
              <IconButton 
              onClick={toggleDrawer(anchor, true)}
              edge="start" color="inherit" aria-label="open drawer">
                <MenuIcon />
              </IconButton>
              <Drawer anchor={anchor} open={state[anchor]} onClose={toggleDrawer(anchor, false)}>
                {list(anchor)}
              </Drawer>
            </React.Fragment>
        ))}
          
          
          <div className={classes.grow} />
          <IconButton edge="end" color="inherit">
            <MoreIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      </React.Fragment>
    );
        
    
}