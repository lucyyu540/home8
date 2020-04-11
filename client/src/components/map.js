import 'ol/ol.css';
import React, { Component } from "react";
import OlMap from "ol/Map";
import OlView from "ol/View";
import OlLayerTile from "ol/layer/Tile";
import OlSourceOSM from "ol/source/OSM";
import {toLonLat, fromLonLat, transform} from 'ol/proj';



class Map extends Component {
  constructor(props) {
    super(props);
    
    this.state = { center: [0,0], zoom: 1 };
    //getting location
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
      let center = fromLonLat([long,lat]);
      let zoom = 14;
      this.setState({center,zoom});
    })
    .catch((err) => {
      alert(err);
    })
    this.olmap = new OlMap({
      target: null,
      layers: [
        new OlLayerTile({
          source: new OlSourceOSM()
        })
      ],
      view: new OlView({
        center: this.state.center,
        zoom: this.state.zoom
      })
    });

    
  }
/**
 * 0: -8242276.281937191
1: 4970792.388188603
 */

  updateMap() {
    this.olmap.getView().setCenter(this.state.center);
    this.olmap.getView().setZoom(this.state.zoom);
  } 


  componentDidMount() {
    this.olmap.setTarget("map");

    // Listen to map changes
    this.olmap.on("moveend", () => {
      console.log('moved')
      let center = this.olmap.getView().getCenter();
      let zoom = this.olmap.getView().getZoom();
      this.setState({ center, zoom });
      this.props.mapUpdateRange(this.olmap.getView().calculateExtent(this.olmap.getSize()))

    });
    console.log('component did mount:',this.props.searchCoordinates)
  }

  componentDidUpdate(nextProps, prevState) {
    console.log('component did update',this.props.searchCoordinates);
    if (this.props.searchCoordinates !== nextProps.searchCoordinates) {
      console.log('changed')
      this.setState(
        {center: fromLonLat([this.props.searchCoordinates.longitude,this.props.searchCoordinates.latitude]), 
          zoom : 14}
      )
      this.props.mapUpdatedChange(false);
      this.props.mapUpdateRange(this.olmap.getView().calculateExtent(this.olmap.getSize()))
    }
  }
  
  //everytime state/prop change
  shouldComponentUpdate(nextProps, nextState) {
    console.log('needToChange', this.props.needToChange)
    if (this.props.needToChange) return true;
    let center = this.olmap.getView().getCenter();
    let zoom = this.olmap.getView().getZoom();
    if (center === nextState.center && zoom === nextState.zoom) return false;
    return true;
  }
  //<button onClick={e => this.userAction()}>setState on click</button>
  userAction() {
    this.setState({ center: fromLonLat([-74.0415546, 40.7177029]), zoom: 14 });
  }
  

  render() {
    this.updateMap();
    return (
      <div id="map" style={{ height: "100vh", 'padding-bottom': '50'}}>
      </div>
    );
  }
}

export default Map;

