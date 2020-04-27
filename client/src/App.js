import React, { useEffect } from 'react';
import {ThemeProvider } from '@material-ui/core/styles';
import {Router, Route, Switch} from 'react-router-dom';
import { useAuth0, user } from "./react-auth0-spa";

/**COMPONENTS */
import LandingPage from './components/landing'
import Navbar from './components/navbar'
import PrivateRoute from "./components/PrivateRoute";
import Profile from './components/profile';
import Inbox from './components/inbox'
import history from "./utils/history";
import EditProfile from './components/editProfile';
import MyListings from "./components/myListings";
import Listing from './components/listing';

/**STYLE*/
import './App.css';
import theme from './theme'

function App() {
  const { loading } = useAuth0();
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return (//jsx describes what ui will look like. Babel later compiles this and calls React.createClass
    <ThemeProvider theme={theme}>
      <Router history={history}>
        <Navbar />
        <Switch>
          <Route exact path='/' component = {LandingPage}/>
          <Route exact path='/listing/:lid' component={Listing} />
          <PrivateRoute path="/inbox" component={Inbox} />
          <PrivateRoute exact path="/:username/edit" component={EditProfile} />
          <PrivateRoute path="/my-listings/:lid" component={MyListings} />
          <Route exact path="/:username" component={Profile} />
        </Switch>
      </Router>
      
    </ThemeProvider>
  );
}

export default App;
