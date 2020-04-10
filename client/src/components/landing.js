import React from 'react';

import Map from './map'
import ListingResults from './listingResults'
import SearchMap from './searchMap'

import '../App.css'
export default function Landing() {
    return( 
        <div className='rowC'>
            <SearchMap />
            <ListingResults/>
        </div>
    );
}