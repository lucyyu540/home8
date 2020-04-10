import React from 'react';
import {useParams } from "react-router-dom";


import UserInfo from './userInfo'
import Personality from './personality'

import '../App.css'
export default function Profile() {
    const username = useParams().username;
    console.log(username);
    return( 
        <div className='rowC'>
            <UserInfo username={username}/>
            <Personality username={username}/>
        </div>
    );
}