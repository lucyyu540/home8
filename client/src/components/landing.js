import React, { useEffect} from "react";
import { useAuth0, user } from "../react-auth0-spa";

/** MY MODULES */
import Map from './map'
import ListingResults from './listingResults'
import SearchMap from './searchMap'

import '../App.css'
export default function Landing() {
    const[listings, setListings] = React.useState();
    const [range, setRange] = React.useState([0,0,0,0]);
    function updateRange(value) {
        setRange(value);
    }
  const { getTokenSilently, user } = useAuth0();
  /**API CALLS */
  const getCustomListings = async (range) => {
    try {
      console.log('trying /private/listings');
      const token = await getTokenSilently();
      const data = {
          a: range[0],
          b: range[1],
          c: range[2],
          d: range[3]
      }
      const response = await fetch("https://localhost:3000/private/listings", {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }, 
        method: 'put', 
        body: JSON.stringify(data)
      });
      const responseData = await response.json();
      console.log(responseData);
      setListings(responseData);

    } catch (error) {
      console.log(error)
    }
  };
  const getListings = async (range) => {
    try {
        const data = {
            a: range[0],
            b: range[1],
            c: range[2],
            d: range[3]
        }
      const response = await fetch("https://localhost:3000/listings", {
        headers: {
          'Content-Type': 'application/json'
        }, 
        method: 'put', 
        body: JSON.stringify(data)
    });
      const responseData = await response.json();
      console.log(responseData);
      setListings(responseData);
    }
    catch(err) {
      console.log(err);
    }
  }
  /**updating listings based on map view*/
  useEffect( ()=> {
  if (user) {
   getCustomListings(range);
  }
  else {
    console.log('not logged on)')
    getListings(range);
  } 
  }, [user, range] )


  console.log(range);
  console.log(listings);


    return( 
        <div className='rowC'>
            <SearchMap updateRange={updateRange}/>
            <ListingResults listings={listings}/>
        </div>
    );
}