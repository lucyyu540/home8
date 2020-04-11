import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import config from "../auth_config.json";

const AnyReactComponent = ({ text }) => <div>{text}</div>;

class SimpleMap extends Component {
  constructor(props) {
    super(props);
    this.state = { center: [0,0], zoom: 1 };
    //getting location
  }

  componentDidMount() {
    new Promise((res,rej) => {
      var options = {
        enableHighAccuracy: true,
        timeout: 5000
      }
      navigator.geolocation.getCurrentPosition(res,rej, options);
    })
    .then((position) => {
      var long = position.coords.longitude;
      var lat = position.coords.latitude;
      let center = [long,lat]
      let zoom = 1;
      this.setState({center: center,zoom: zoom});
      console.log(this.state);
    })
    .catch((err) => {
      alert(err);
    })
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState !== this.state) {
      console.log('need to recenter');
    }
  }
  

  render() {
    return (
      // Important! Always set the container height explicitly
      <div style={{ height: '100vh', width: '100%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: config.GOOGLE_API_KEY }}
          center={this.state.center}
          zoom={this.state.zoom}
        >
          <AnyReactComponent
            lat={23.955413}
            lng={30.337844}
            text="My Marker"
          />
        </GoogleMapReact>
      </div>
    );
  }
}

export default SimpleMap;