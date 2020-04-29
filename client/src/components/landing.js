import React, { useEffect} from "react";
import { useAuth0, user } from "../react-auth0-spa";

/** MY MODULES */
import ListingResults from './listingResults'
import SearchMap from './searchMap'

import '../App.css'
export default function Landing() {
    const[listings, setListings] = React.useState(null);
    const[favoriteListings, setFavoriteListings] = React.useState(null);
    const [range, setRange] = React.useState([0,0,0,0]);
    const [readyAPI, setReadyAPI] = React.useState(false); //call api after map view range has been set
    function updateRange(value) {
        setRange(value);
        setReadyAPI(true);
    }
    const [selected, setSelected] = React.useState(null);
    const [hovered, setHovered] = React.useState(null);
    function updateSelected(value) {setSelected(value);}
    function updateHovered(value) {setHovered(value);}
  const { getTokenSilently, user } = useAuth0();
  /**API CALLS */
  /**private */
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
      setListings(responseData.public);
      setFavoriteListings(responseData.favorites);

    } catch (error) {
      console.log(error)
    }
  };
  /**public */
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

  useEffect( ()=> {
    if (readyAPI) {
        if (user) getCustomListings(range);
        else getListings(range);
        setReadyAPI(false);
    }
  }, [user, range] )

    return( 
        <div className='rowC'>
            <SearchMap 
            updateRange={updateRange}//function for child
            listings={listings}
            selected={selected}
            hovered={hovered}
            />
            <ListingResults 
            listings={listings}
            favoriteListings = {favoriteListings}
            updateHovered = {updateHovered}
            updateSelected = {updateSelected}
            />            
        </div>
    );
}