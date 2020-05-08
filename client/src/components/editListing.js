import React, { useEffect }  from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useAuth0, user } from "../react-auth0-spa";
import { Link } from "react-router-dom";
import Box from '@material-ui/core/Box';
import Snackbar from '@material-ui/core/Snackbar';
import Paper from '@material-ui/core/Paper';


/**LIST */
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import ListItemIcon from '@material-ui/core/ListItemIcon';

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
  body: {
    padding: theme.spacing(5,5,0,5),
  },
  box: {
    margin: theme.spacing(1),
    padding: theme.spacing(0,1),
  },
  room: {
    margin: theme.spacing(3),
    padding: theme.spacing(2)
  },
  header: {
    padding: theme.spacing(5)
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
  const [count, setCount] = React.useState(props.listing.count);
  const [building, setBuilding] = React.useState(props.listing.building);
  const [doorman, setDoorman] = React.useState('');
  const [laundry, setLaundry] = React.useState(props.listing.laundry);
  const [bed, setBed] = React.useState(props.listing.bed);
  const [bath, setBath] = React.useState(props.listing.bath);
  const [active, setActive] = React.useState(1);
  const[mates, setMates] = React.useState([]);
  /**IF ROOMS ARE UP FOR SALE */
  const [fromDate , setFromDate] = React.useState([]);
  const [toDate , setToDate] = React.useState([]);
  const [price, setPrice] = React.useState([]);
  const [priceError, setPriceError] = React.useState(false);
  const [roomType, setRoomType] = React.useState([]);
  const [rooming, setRooming] = React.useState([]);

  const [disabled, setDisabled] = React.useState(true);  
  const [check, setCheck] = React.useState(false);

  /**LOAD PROPS****************************************** */
  useEffect(()=> {
    setAddress(props.listing.address);
    setAddressError(false);
    setLongitude(props.listing.longitude);
    setLatitude(props.listing.latitude);
    setDescription(props.listing.description);

    if (props.listing.fromDate) setFromDate(props.listing.fromDate.slice(0, props.listing.fromDate.length));
    else setFromDate([]);
    if (props.listing.toDate) setToDate(props.listing.toDate.slice(0, props.listing.toDate.length));
    else setFromDate([]);
    if (props.listing.roomType) setRoomType(props.listing.roomType.slice(0, props.listing.roomType.length));
    else setRoomType([]);
    if (props.listing.rooming) setRooming(props.listing.rooming.slice(0, props.listing.rooming.length));
    else setRooming([]);
    if (props.listing.price) setPrice(props.listing.price.slice(0, props.listing.price.length));
    else setPrice([]);
    setPriceError(false);
    setCount(props.listing.count);
    setBuilding(props.listing.building);
    if (props.listing.doorman) setDoorman(props.listing.doorman);
    else setDoorman('');
    setLaundry(props.listing.laundry);
    setBed(props.listing.bed);
    setBath(props.listing.bath);
    
    setDisabled(true);
    setActive(props.listing.active);
    if (props.listing.mates != null && props.listing.mates != '') setMates(props.listing.mates.slice(0,props.listing.mates.length))
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
    for (var i = 0 ; i < price.length; i ++) {
      if (fromDate[i] == "" || fromDate == null) return setDisabled(true);
      else if (toDate[i] == "" || toDate == null ) return setDisabled(true);
      else if (price[i] == "" || price == null) return setDisabled(true);
      else if (roomType[i] == "" || roomType == null) return setDisabled(true);
      else if (rooming[i] == ""|| rooming == null ) return setDisabled(true);
    }
    if (address == "") setDisabled(true);
    else if (count == "" || count == null) setDisabled(true);
    else if (building == ""|| building == null ) setDisabled(true);
    else if (doorman != 0 && doorman != 1) setDisabled(true);
    else if (laundry == "" || laundry == null) setDisabled(true);
    else if (bed == "" || bed == null) setDisabled(true);
    else if (bath == ""|| bath == null ) setDisabled(true);
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

  function changeActive(e) {
    if (e.target.checked)setActive(1);
    else setActive(0);
    setCheck(true);
  }
  /**EDIT ROOM **************************************/
  function changeRoomType(index, e) {
    var temp = roomType;
    temp[index] = e.target.value;
    setRoomType(temp);
    setCheck(true);
  }
  function changeRooming(index, e) {
    var temp = rooming;
    temp[index] = e.target.value;
    setRooming(temp);
    setCheck(true);
  }
  function changeFromDate(index, e) {
    var temp = fromDate;
    temp[index] = e.target.value;
    setFromDate(temp);
    setCheck(true);
  }
  function changeToDate(index, e) {
    var temp = toDate;
    temp[index] = e.target.value;
    setToDate(temp);
    setCheck(true);
  }
  function changePrice(index, e) {
    console.log(e.target.value);
    if (isNaN(e.target.value)) {//non numerical
       setPriceError(true);
    }
    else {//numerical
      const temp = e.target.value.split(".");
      const arr = price;
      if (temp.length == 1) {//no decimal
        arr[index] = e.target.value;
        setPrice(arr); 
      }
      else if (temp[1].length <= 2) {//no more than 2 dec places
        arr[index] = e.target.value;
        setPrice(arr); 
      }
      
      if (e.target.value == "" || e.target.value == null) setPriceError(true);
      else setPriceError(false);
    }
    setCheck(true);
  }
  function addRoom() {
    var temp = price; temp.push('');
    setPrice(temp);
    temp = fromDate; temp.push('');
    setFromDate(temp);
    temp = toDate; temp.push('');
    setToDate(temp);
    temp = rooming; temp.push('');
    setRooming(temp);
    temp = roomType; temp.push('');
    setRoomType(temp);
    setCheck(true);
  }
  function deleteRoom(index) {
    var temp = price; temp.splice(index,1);
    setPrice(temp);
    temp = fromDate; temp.splice(index,1);
    setFromDate(temp);
    temp = toDate; temp.splice(index,1);
    setToDate(temp);
    temp = rooming; temp.splice(index,1);
    setRooming(temp);
    temp = roomType; temp.splice(index,1);
    setRoomType(temp);
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
  const editRoom = (index) => (
    <React.Fragment key={index}>
      <Paper className={classes.room}>
        <ListItem>
        {/**room type */}
        <TextField
          id="roomType"
          select
          label="Type of Rooming"
          variant="outlined"
          value={rooming[index] ||''}
          helperText='Please select'
          className={classes.smallTextField}
          onChange={(e) => changeRooming(index, e)}
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
          value={roomType[index] || ''}
          variant="outlined"
          helperText='Please select'
          className={classes.smallTextField}
          onChange={(e) => changeRoomType(index, e)}
          required
            >{roomFacilityOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
        </TextField>
        </ListItem>
        <ListItem>
        {/**From date */}
            <TextField
        id="fromDate"
        label="Available from"
        type="date"
        variant="outlined"
        value={fromDate[index]|| ''}
        className={classes.textField}
        InputLabelProps={{
          shrink: true,
        }}
        className={classes.smallTextField}
        onChange={(e) => changeFromDate(index, e)}
        required
      />
       {/**To date */}
       <TextField
        id="toDate"
        label="to"
        type="date"
        variant="outlined"
        value={toDate[index]||''}
        className={classes.textField}
        InputLabelProps={{
          shrink: true,
        }}
        className={classes.smallTextField}
        onChange={(e) => changeToDate(index, e)}
        required
      />
        </ListItem>   
        <ListItem>
           {/**Price */}
           <TextField
          error={priceError}
          label="Price"
          variant="outlined"
          value={price[index] ||''}
          className={classes.bigTextField}
          onChange={(e) => changePrice(index, e)}
          required
            />
        </ListItem>
        <ListItem button
        onClick={() => deleteRoom(index)}>
          <ListItemText className={classes.center}>
            <Typography color='primary'>Delete</Typography>
          </ListItemText>
        </ListItem>
        </Paper>
    </React.Fragment>
  )
  return (
    <div className={classes.root}>
      {/**SAVE CHANGES ******************* */}
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        key={`${vertical},${horizontal}`}
        open={snackbar.open}
        onClose={closeSnackbar}
        message="Please save changes!"
      />
    <Submap coordinates={[longitude,latitude]} />
    <List className={classes.body}>
    <Typography variant="body2"color='textSecondary' >
       id: {props.listing.lid}
    </Typography>
      <List className={classes.right}>
        {/**ACTIVE ********************************************** */}
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
          <Button color='primary' component={Link} to={`/user/${mates[index][1]}`} key={'Profile'}>{mates[index][1]}</Button>
          <IconButton onClick={() => deleteMate(index)}><HighlightOffIcon color='primary'/></IconButton>
          </Box>
        ))
        }

      </ListItem>
      <Divider/>
      <ListItem className={classes.header}>
      <Typography variant="h5"color='textPrimary' >
        Basic Information
      </Typography>
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
        <Divider/>
{/**ROOMS UP FOR SALE ******************************************/}
      <ListItem className={classes.header}>
      <Typography variant="h5"color='textPrimary' >
        Listing for Home Mates
      </Typography>
      </ListItem>
      {price.map( (key, index) => (
          editRoom(index)
      ))}
      <ListItem>
      <Button color='primary'
          onClick={addRoom}
          startIcon={<AddCircleOutlineIcon />}
          >Add availability</Button>
      </ListItem>
      <Divider/>

{/**BUILDING DETAILS ************************************************** */}
    <ListItem className={classes.header}>
      <Typography variant="h5"color='textPrimary' >
        Building Amenities
      </Typography>
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
          value={doorman}
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
