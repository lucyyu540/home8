import React, { useEffect }  from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useAuth0, user } from "../react-auth0-spa";
import { Link } from "react-router-dom";
import Box from '@material-ui/core/Box';
import Snackbar from '@material-ui/core/Snackbar';


/**LIST */
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
/**FORM */
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import MenuItem from '@material-ui/core/MenuItem';

/**DIALOG */
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

/**ICONS */
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import CheckIcon from '@material-ui/icons/Check';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import { Button } from '@material-ui/core';
/**MAP */
import Geocode from "react-geocode";
import {toLonLat, fromLonLat, transform} from 'ol/proj';
/**MY MODULES */
import Submap from './submap';
import '../App.css'
import config from "../auth_config.json";
import { add } from 'ol/coordinate';

/**SEARCH BY ADDRESS */
Geocode.setApiKey(config.GOOGLE_API_KEY);
Geocode.setLanguage("en");
Geocode.enableDebug();


const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow:1,
        overflow:'auto',
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
        },
        height: '92vh',
    },
    bigTextField: {
        width: '50ch',
    },
    smallTextField: {
        width: '20ch',
    },
    numberTextField: {
      width: '10ch'
    },
  button: {
    padding: theme.spacing(4),
  },
  center: {
    textAlign: 'center'
  },
  right: {
    float:'right',
  },
  left:{
    float:'left'
  },
  textPadding: {
    padding: theme.spacing(2)
  },
  form: {
    padding: theme.spacing(5, 5, 0,5),
  },
  box: {
    margin: theme.spacing(1),
    padding: theme.spacing(0,1),
  }
}));
//SELECT OPTIONS
const doormanOptions = [
    {value: 1, label: 'Yes'},
    {value: 0, label:'No'}
]
const buildingOptions = [
    {value: 'Elevator', label: 'Elevator'},
    {value: 'House', label: 'House'},
    {value: 'Townhouse', label: 'Townhouse'},
    {value: 'Walk up', label: 'Walk up'},
];
const roomTypeOptions = [
    {value: 'Single', label: 'Single'},
    {value: 'Double', label: 'Double'},
    {value: 'Triple', label: 'Triple'},
    {value: 'Quadruple', label: 'Quadruple'},
]
const roomFacilityOptions = [
    {value: 'Bedroom', label: 'Bedroom'},
    {value: 'Studio', label: 'Studio'},
    {value: 'Flex', label: 'Flex'},
]
const countOptions = [
    {value: '2', label: '2'},
    {value: '3', label: '3'},
    {value: '4', label: '4'},
    {value: '5', label: '5'},
    {value: '6', label: '6'},
]
const laundryOptions = [
    {value: 'In building', label: 'In building'},
    {value: 'In house', label: 'In house'},
    {value: 'In neighborhood', label: 'In neighborhood'},
]
const bedOptions = [
    {value: '1', label: '1'},
    {value: '2', label: '2'},
    {value: '3', label: '3'},
    {value: '4', label: '4'},
    {value: '5', label: '5'},
    {value: '6', label: '6'},
]
const bathOptions = [
    {value: '1', label: '1'},
    {value: '2', label: '2'},
    {value: '3', label: '3'},
    {value: '4', label: '4'},
    {value: '5', label: '5'},
    {value: '6', label: '6'},
]

export default function Listing(props) {
  const classes = useStyles();
  const { getTokenSilently, user } = useAuth0();
  const [address, setAddress] = React.useState(props.listing.address);
  const [addressError, setAddressError] = React.useState(false);
  const [longitude, setLongitude] = React.useState(0);
  const [latitude, setLatitude] = React.useState(0);
  const [description, setDescription] = React.useState(props.listing.description);
  const [fromDate , setFromDate] = React.useState();
  const [toDate , setToDate] = React.useState();
  const [price, setPrice] = React.useState(props.listing.price);
  const [priceError, setPriceError] = React.useState(false);
  const [count, setCount] = React.useState(props.listing.count);
  const [building, setBuilding] = React.useState(props.listing.building);
  const [doorman, setDoorman] = React.useState(props.listing.doorman);
  const [laundry, setLaundry] = React.useState(props.listing.laundry);
  const [bed, setBed] = React.useState(props.listing.bed);
  const [bath, setBath] = React.useState(props.listing.bath);
  const [roomType, setRoomType] = React.useState(props.listing.roomType);
  const [rooming, setRooming] = React.useState(props.listing.rooming);
  const [disabled, setDisabled] = React.useState(true);
  const[mates, setMates] = React.useState([]);
  const [active, setActive] = React.useState(1);
  const [check, setCheck] = React.useState(false);

  useEffect(()=> {
    setAddress(props.listing.address);
    setAddressError(false);
    setLongitude(props.listing.longitude);
    setLatitude(props.listing.latitude);
    setDescription(props.listing.description);
    if (props.listing.fromDate) setFromDate(props.listing.fromDate.substring(0,props.listing.fromDate.indexOf('T')));
    else setFromDate('');
    if (props.listing.toDate) setToDate(props.listing.toDate.substring(0,props.listing.toDate.indexOf('T')));
    else setToDate('');
    setPrice(props.listing.price);
    setPriceError(false);
    setCount(props.listing.count);
    setBuilding(props.listing.building);
    setDoorman(props.listing.doorman);
    setLaundry(props.listing.laundry);
    setBed(props.listing.bed);
    setBath(props.listing.bath);
    setRoomType(props.listing.roomType);
    setRooming(props.listing.rooming);
    setDisabled(true);
    setActive(props.listing.active);
    if (props.listing.mates != null) setMates(props.listing.mates.slice(0,props.listing.mates.length))
    else setMates([]);
    setCheck(false);
  }, [props.listing]);

  useEffect(() => {
    if(check) {
    console.log('useeffect called for change');
    checkChanges();
    setCheck(false);
    }
  }, [check])
  
  function checkChanges() {
    if (address == "") setDisabled(true);
    else if (fromDate == "" || fromDate == null) setDisabled(true);
    else if (toDate == "" || toDate == null ) setDisabled(true);
    else if (price == "" || price == null) setDisabled(true);
    else if (count == "" || count == null) setDisabled(true);
    else if (building == ""|| building == null ) setDisabled(true);
    else if (doorman != 0 && doorman != 1) setDisabled(true);
    else if (laundry == "" || laundry == null) setDisabled(true);
    else if (bed == "" || bed == null) setDisabled(true);
    else if (bath == ""|| bath == null ) setDisabled(true);
    else if (roomType == "" || roomType == null) setDisabled(true);
    else if (rooming == ""|| rooming == null ) setDisabled(true);
    else if (addressError || priceError) return setDisabled(true);
    else {
      setDisabled(false);
      openSnackbar();
    }
  }

  function changeAddress(e) {
    setAddress(e.target.value);
    if (e.target.value == "") setAddressError(true); 
    else {
    Geocode.fromAddress(e.target.value).then(
      response => {
        const { lat, lng } = response.results[0].geometry.location;
        const coord = fromLonLat([lng,lat]);
        setLongitude(coord[0]);
        setLatitude(coord[1]);
        console.log(longitude, latitude);
        setAddressError(false)
        setCheck(true);
      },
      error => {//invalid address
        console.error(error);
        setAddressError(true);
        setCheck(true);
      }
    );
    }
    setCheck(true);
  }
  function changeDescription(e) {
    setDescription(e.target.value);
    setCheck(true);
  }
  function changeFromDate(e) {
    setFromDate(e.target.value);
    setCheck(true);
  }
  function changeToDate(e) {
    setToDate(e.target.value);
    setCheck(true);
  }
  function changePrice(e) {
    console.log(e.target.value);
    if (isNaN(e.target.value)) {//non numerical
       setPriceError(true);
    }
    else {//numerical
      //format
      const temp = e.target.value.split(".");
      if (temp.length == 1) setPrice(e.target.value); //no decimal
      else if (temp[1].length <= 2) setPrice(e.target.value);//no more than 2 dec places
      if (e.target.value == "" || e.target.value == null) setPriceError(true);
      else setPriceError(false);
      checkChanges(e.target.value);
    }
    setCheck(true);
  }
  function changeCount(e) {
    setCount(e.target.value);
    setCheck(true);
  }
  function changeBuilding(e) {
    setBuilding(e.target.value);
    setCheck(true);
  }
  function changeDoorman(e) {
    setDoorman(e.target.value);
    setCheck(true);
  }
  function changeLaundry(e) {
    setLaundry(e.target.value);
    setCheck(true);
  }
  function changeBed(e) {
    setBed(e.target.value);
    setCheck(true);
  }
  function changeBath(e) {
    setBath(e.target.value);
    setCheck(true);
  }
  function changeRoomType(e) {
    setRoomType(e.target.value);
    setCheck(true);
  }
  function changeRooming(e) {
    setRooming(e.target.value);
    setCheck(true);
  }
  function changeActive(e) {
    if (e.target.checked)setActive(1);
    else setActive(0);
    setCheck(true);
  }
  /**EDIT MATES */
  function addMe() {
    var temp = mates;
    temp.unshift([user.sub, user.nickname]);
    setMates(temp);
    setCheck(true);
  }
  function deleteMate(m) {
    var temp = mates;
    temp.splice(m,1);
    setMates(temp);
    setCheck(true);
  }
  /**SNACKBAR */
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    vertical: 'bottom',
    horizontal: 'center',
  });
  const { vertical, horizontal, open } = snackbar;
  const openSnackbar = () => {
    setSnackbar({...snackbar, open: true });
  };

  const closeSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  /**API CALLS */
  async function submit() {
    console.log('save clicked');
    if (props.listing.lid) update();
    else create();
  }

  async function create() {
    try{
      const token = await getTokenSilently();
      const data = {
        address: address,
        longitude: longitude,
        latitude: latitude,
        description: description,
        fromDate: fromDate,
        toDate: toDate,
        price: price,
        count: count,
        building: building,
        doorman: doorman,
        laundry: laundry,
        bed: bed,
        bath: bath,
        roomType: roomType,
        rooming:rooming,
        active: active,
        mates: mates
      }
      const response = await fetch(`https://localhost:3000/private/create-listing`, {
          headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }, 
          method: 'put', 
          body: JSON.stringify(data)
      });
      props.getMyListings();
    }
    catch(err) {
      console.log(err);
    }

  }

  async function update() {
    try{
      const token = await getTokenSilently();
      const data = {
        lid: props.listing.lid,
        address: address,
        longitude: longitude,
        latitude: latitude,
        description: description,
        fromDate: fromDate,
        toDate: toDate,
        price: price,
        count: count,
        building: building,
        doorman: doorman,
        laundry: laundry,
        bed: bed,
        bath: bath,
        roomType: roomType,
        rooming:rooming,
        active: active,
        mates: mates
      }
      const response = await fetch(`https://localhost:3000/private/update-listing`, {
          headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }, 
          method: 'put', 
          body: JSON.stringify(data)
      });
      props.getMyListings();
    }
    catch(err) {
      console.log(err);
    }
  }

  return (
    <div className={classes.root}>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        key={`${vertical},${horizontal}`}
        open={snackbar.open}
        onClose={closeSnackbar}
        message="Please save changes!"
      />
    <Submap coordinates={[longitude,latitude]} />
    <List className={classes.form}>
    <Typography variant="body2"color='textSecondary' >
       id: {props.listing.lid}
    </Typography>
      <List className={classes.right}>
      <ListItem>
        <ListItemText className={classes.textPadding}>
        {active==1 && (<Typography color='secondary'> Active</Typography>)}
        {active==0 && (<Typography color='textSecondary'> Inactive</Typography>)} 
        </ListItemText>
        <FormControlLabel
          control={
          <Switch
            checked={active==1}
            onChange={changeActive}
            color="secondary"
          />
          }
        />
      </ListItem>
      </List>
      <List className={classes.left}>
      <ListItem>
        {/**Count */}
        <TextField
          id="count"
          label="People"
          variant="outlined"
          select
          value={count||''}
          className={classes.numberTextField}
          onChange={changeCount}
          required
            >{countOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                    {option.label}
                </MenuItem>
            ))}
        </TextField>
      </ListItem>
      </List>
      
      <ListItem>
        {mates.length < count && 
        !mates.find(owner => owner[0] == user.sub) &&
        (
          <Button color='primary'
          startIcon={<AddCircleOutlineIcon />}
          onClick={addMe}
          >Add me! I live here</Button>
        )}
        {mates.map( (key,index) => ( 
          <Box key={index} borderColor='text.secondary' border={1} borderRadius="borderRadius" className={classes.box}>
          <Button color='primary' component={Link} to={`/${mates[index][1]}`} key={'Profile'}>{mates[index][1]}</Button>
          <IconButton onClick={() => deleteMate(index)}><HighlightOffIcon color='primary'/></IconButton>
          </Box>
        ))
        }

      </ListItem>
      <Divider/>
      <ListItem>
        {/**Address */}
        <TextField
          error={addressError}
          id="address"
          label="Street Address"
          variant="outlined"
          value={address||''}
          className={classes.bigTextField}
          onChange={changeAddress}
          required
           />    
        </ListItem>
        <ListItem>
        {/**Description */}
        <TextField
          id="description"
          label="Description"
          rows={4}
          multiline
          variant="outlined"
          value={description || ''}
          className={classes.bigTextField}
          onChange={changeDescription}
            />
        </ListItem>
        <ListItem>
        {/**From date */}
            <TextField
        id="fromDate"
        label="Available from"
        type="date"
        variant="outlined"
        value={fromDate|| ''}
        className={classes.textField}
        InputLabelProps={{
          shrink: true,
        }}
        className={classes.smallTextField}
        onChange={changeFromDate}
        required
      />
       {/**To date */}
       <TextField
        id="toDate"
        label="to"
        type="date"
        variant="outlined"
        value={toDate||''}
        className={classes.textField}
        InputLabelProps={{
          shrink: true,
        }}
        className={classes.smallTextField}
        onChange={changeToDate}
        required
      />
        </ListItem>
          
        <ListItem>
        {/**Price */}
            <TextField
          error={priceError}
          id="price"
          label="Price"
          variant="outlined"
          value={price ||''}
          className={classes.bigTextField}
          onChange={changePrice}
          required
            />
        </ListItem>
       
    <ListItem>
    {/**building */}
        <TextField
          id="building"
          select
          label="Building"
          variant="outlined"
          value={building||''}
          helperText='Please select'
          className={classes.smallTextField}
          onChange={changeBuilding}
          required
            >{buildingOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
        </TextField>
         {/**doorman */}
         <TextField
          id="doorman"
          select
          label="Doorman"
          variant="outlined"
          value={doorman||0}
          helperText='Please select'
          className={classes.smallTextField}
          onChange={changeDoorman}
          required
            >{doormanOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                    {option.label}
                </MenuItem>
            ))}</TextField>
        </ListItem>
        <ListItem>
      {/**Laundry */}
      <TextField
          id="laundry"
          select
          label="Laundry"
          variant="outlined"
          value={laundry||''}
          helperText='Please select'
          className={classes.smallTextField}
          onChange={changeLaundry}
          required
            >{laundryOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                    {option.label}
                </MenuItem>
            ))}</TextField>
        </ListItem>
        <ListItem>
        {/**bed */}
        <TextField
          id="bed"
          select
          label="Bedrooms"
          variant="outlined"
          value={bed||''}
          helperText='Please select'
          className={classes.smallTextField}
          onChange={changeBed}
          required
            >{bedOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
        </TextField>
        {/**bath */}
        <TextField
          id="bath"
          select
          label="Bathrooms"
          variant="outlined"
          value={bath||''}
          helperText='Please select'
          className={classes.smallTextField}
          onChange={changeBath}
          required
            >{bathOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))
            }
        </TextField>
        </ListItem>
        <ListItem>
        {/**room type */}
        <TextField
          id="roomType"
          select
          label="Type of Rooming"
          variant="outlined"
          value={rooming ||''}
          helperText='Please select'
          className={classes.smallTextField}
          onChange={changeRooming}
          required
            >{roomTypeOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
        </TextField>
        {/**room facility type */}
        <TextField
          id="roomType"
          select
          label="Type of Room"
          value={roomType || ''}
          variant="outlined"
          helperText='Please select'
          className={classes.smallTextField}
          onChange={changeRoomType}
          required
            >{roomFacilityOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
        </TextField>
        </ListItem>
        </List>
        <List>
        <ListItem button
        disabled={disabled}
        className={classes.button}
        onClick={submit}
        >
            <ListItemText className={classes.center}>
                <Typography color='primary'>Save</Typography>
            </ListItemText>
            
        </ListItem>
            
        </List>

    </div>
  );
}
