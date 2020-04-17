import React, { Fragment , useEffect} from "react";
import { useAuth0 } from "../react-auth0-spa";
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from "react-router-dom";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import InputAdornment from '@material-ui/core/InputAdornment';
import countryList from 'react-select-country-list'
import MenuItem from '@material-ui/core/MenuItem';
import List from '@material-ui/core/List';

/** STTYLE */
import '../App.css'

/** ICONS */
import Divider from '@material-ui/core/Divider';
import SaveIcon from '@material-ui/icons/Save';
import AccountCircle from '@material-ui/icons/AccountCircle';
import PhoneIcon from '@material-ui/icons/Phone';
import LockIcon from '@material-ui/icons/Lock';
const useStyles = makeStyles((theme) => ({
    root: {
      overflow: 'hidden',
      '& .MuiTextField-root': {
        margin: theme.spacing(1),
        width: '25ch',
      },
    },

    paper: {
      maxWidth: 500,
      maxHeight: 550,
      margin: `${theme.spacing(4)}px auto`,
      padding: theme.spacing(2),
      textAlign: 'center',
      paddingBottom: 50,
      overflow: 'auto',
    },
    button: {
      width: 400
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 200,
      },
  }));
  
/**SELECT OPTIONS */
const countryOptions = countryList().getData();//options for countries
const genderOptions = [
    {value: 'F', label: "Female"},
    {value: 'M', label: "Male"},
    {value: 'O', label: 'Other'},
    {value: 'U', label: 'Prefer not to say'}
];
const genderPreferenceOptions = [
    {value: 'F', label: "Female"},
    {value: 'M', label: "Male"},
    {value: 'N', label: 'No preference'},
];



export default function EditProfile(props){
/**HOOKS */
const classes = useStyles();
const { getTokenSilently, user, loading} = useAuth0();
/**STATES */
  const [email, setEmail] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [dob, setDob] = React.useState("")
  const [country, setCountry] = React.useState("");
  const [gender, setGender] = React.useState("");
  const [genderPreference, setGenderPreference] = React.useState("");
  const [change, setChange] = React.useState(false);
  
/**GET USER INFO FROM SERVER */
  const getProfile = async () => {
    try {
      const token = await getTokenSilently();
      const response = await fetch(`https://localhost:3000/private/my-profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }, 
        method: 'put', 
      });
      const responseData = await response.json();
      setEmail(responseData.email);
      setUsername(responseData.username);
      setFirstName(responseData.firstName);
      setLastName(responseData.lastName);
      setDob(responseData.dob.substring(0,responseData.dob.indexOf('T')));
      setPhone(responseData.phone)
      setCountry(responseData.nationality);
      setGender(responseData.gender);
      setGenderPreference(responseData.genderPreference);
      console.log(dob);

    } catch (error) {
      console.log(error)
    }
  };
  /**PUT UPDATED USER INFO IN SERVER */
  const updateProfile = async () => {
      try {
        const data = {
            email: email,
            username: username,
            firstName: firstName,
            lastName: lastName,
            dob: dob,
            phone: phone,
            nationality: country,
            gender: gender,
            genderPreference: genderPreference
        }
        const token = await getTokenSilently();
        const response = await fetch(`https://localhost:3000/private/edit-profile`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
              }, 
            method: 'put', 
            body: JSON.stringify(data)
        });
        window.location.reload();
      }
      catch (err) {
          console.log(err);
      }
  }

  /**ON RENDER */
  useEffect( ()=> {
    if (user) getProfile();
  }, [user] )
  console.log(username);
  console.log(email);
  console.log(firstName);
  console.log(lastName);
  console.log(phone);
  console.log(dob);
  console.log(country);
  console.log(gender);
  console.log(genderPreference);

  /**INPUT HANDLE FUNCTIONS */
  function handleNationalityChange(e) {
      setCountry(e.target.value);
      setChange(true);
  }
  function handleGenderChange(e) {
      setGender(e.target.value);
      setChange(true);
  }
  function handleGenderPreferenceChange(e) {
      setGenderPreference(e.target.value);
      setChange(true);
  }
  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
    setChange(true);
  }
  function handleLastNameChange(e) {
    setLastName(e.target.value);
    setChange(true);
  }
  function handlePhoneChange(e) {
    setPhone(e.target.value);
    setChange(true);
  }
  function handleDobChange(e) {
    setDob(e.target.value);
    setChange(true);
  }

  /**RETURN */
  return (  
    <div className={classes.root}> 
        <Paper square className={classes.paper}>
            <div className='name'>Profile</div>
        <List>
          {/**USERNAME */}
          <TextField
          disabled
          id="username"
          label="Username"
          value={username||''}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AccountCircle />
              </InputAdornment>
            ),
            endAdornment: (
                <InputAdornment position="start">
                  <LockIcon />
                </InputAdornment>
              ),
          }}
            />
        {/**EMAIL */}
            <TextField
          disabled
          id="email"
          label="Email"
          value={email||''}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AccountCircle />
              </InputAdornment>
            ),
            endAdornment: (
                <InputAdornment position="start">
                  <LockIcon />
                </InputAdornment>
              ),
          }}
            />
            {/**NAME */}
            <TextField
          id="firstName"
          label="First Name"
          value={firstName || ''}
          onChange={handleFirstNameChange}
            />
            <TextField
          id="lastName"
          label="Last Name"
          value={lastName ||''}
          onChange={handleLastNameChange}
            />
            {/**PHONE */}
            <TextField
          id="phone"
          label="Phone Number"
          value={phone||''}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PhoneIcon />
              </InputAdornment>
            ),
          }}
          onChange={handlePhoneChange}
            />
            {/**DOB */}
            <TextField
        id="dob"
        label="Date of Birth"
        type="date"
        value={dob||''}
        className={classes.textField}
        InputLabelProps={{
          shrink: true,
        }}
        onChange={handleDobChange}
        
      />
      {/**GENDER */}
      <TextField
          id="gender"
          select
          label="Gender"
          value={gender||''}
          onChange={handleGenderChange}
          helperText='Please select gender'
            >{
                genderOptions.map((option) => (
                    <MenuItem key={option.value} value={option.label}>
                        {option.label}
                    </MenuItem>
                ))
            }</TextField>
        {/**GENDER  PREFERENCE*/}
      <TextField
          id="genderPreference"
          select
          label="Roommate Gender Preference"
          value={genderPreference||''}
          onChange={handleGenderPreferenceChange}
          helperText='Please select gender'
            >{
                genderPreferenceOptions.map((option) => (
                    <MenuItem key={option.value} value={option.label}>
                        {option.label}
                    </MenuItem>
                ))
            }</TextField>
        {/**NATIONALITY */}
            <TextField
          id="nationality"
          select
          label="Nationality"
          value={country||''}
          onChange={handleNationalityChange}
          helperText='Please select a country'
            >{
                countryOptions.map((option) => (
                    <MenuItem key={option.value} value={option.label}>
                        {option.label}
                    </MenuItem>
                ))
            }</TextField>

          <Button
            disabled={!change}
            variant="contained"
            color='primary'
            className={classes.button}
            startIcon={<SaveIcon/>}
            size="small"
            component={Link} to={`/${user.nickname}/edit`}
            onClick={updateProfile}
            >Save
            </Button>
            
        </List>
        </Paper>
        
    </div>
      
  );
};

