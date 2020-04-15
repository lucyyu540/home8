import 'ol/ol.css';
import React, { Component } from "react";
import OlMap from "ol/Map";
import OlView from "ol/View";
import OlLayerTile from "ol/layer/Tile";
import OlSourceOSM from "ol/source/OSM";
import OlFeature from 'ol/Feature';
import OlGeometryPoint from 'ol/geom/Point';
import OlSourceVector from 'ol/source/Vector';
import OlLayerVector from 'ol/layer/Vector';
import olStyleStyle from 'ol/style/Style';
import olStyleIcon from 'ol/style/Icon'
import {toLonLat, fromLonLat, transform} from 'ol/proj';
import { red } from '@material-ui/core/colors';


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
        })//base map layer
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
    //handle searched area view
    console.log('component did update',this.props.searchCoordinates);
    if (this.props.searchCoordinates !== nextProps.searchCoordinates) {
      console.log('changed')
      this.setState(
        {center: fromLonLat([this.props.searchCoordinates.longitude,this.props.searchCoordinates.latitude]), 
          zoom : 14}
      )
      //get map view range
      this.props.mapUpdateRange(this.olmap.getView().calculateExtent(this.olmap.getSize()))
    }
    //adding marker to map
    if (this.props.listings && this.props.listings !== nextProps.listings){
      console.log(this.props.listings);
      console.log(nextProps.listings);
      var iconStyle = new olStyleStyle({
        image: new olStyleIcon(/** @type {olx.style.IconOptions} */ ({
          anchor: [0.5, 0.5],
          anchorXUnits: 'fraction',
          anchorYUnits: 'pixels',
          opacity: 0.75,
          scale: 0.13,
          src:'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Map_marker_font_awesome.svg/200px-Map_marker_font_awesome.svg.png',
        }))
      });
      var vectorSource = new OlSourceVector({features:[]});
      for (var i = 0; i < this.props.listings.length ; i ++) {
        const coordinates = [this.props.listings[i].longitude, this.props.listings[i].latitude];
        const id = this.props.listings[i].lid;
        const marker = new OlFeature({
          geometry:new OlGeometryPoint(coordinates),
        })
        marker.setId(id);
        marker.setStyle(iconStyle)
        vectorSource.addFeature(marker);
      }
      var markerVectorLayer = new OlLayerVector({
        title: 'markers',
        source: vectorSource,
        style: iconStyle
      });
      this.olmap.addLayer(markerVectorLayer);
    } 
    //hovered
    if (this.props.hovered) {
      console.log('hovering', this.props.hovered)
      this.olmap.getLayers().forEach(layer => {
        if (layer.get('title') == 'markers') {
          var iconStyle = new olStyleStyle({
            image: new olStyleIcon(/** @type {olx.style.IconOptions} */ ({
              anchor: [0.5, 0.5],
              anchorXUnits: 'fraction',
              anchorYUnits: 'pixels',
              opacity: 0.75,
              scale: 0.2,
              src:'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Map_marker_font_awesome.svg/200px-Map_marker_font_awesome.svg.png',
            }))
          });
          const source = layer.getSource();
          const feature = source.getFeatureById(this.props.hovered);
          feature.setStyle(iconStyle);
        }
      });
    }
    else if (nextProps.hovered) {
      console.log('need to unhover this', nextProps.hovered);
      this.olmap.getLayers().forEach(layer => {
        if (layer.get('title') == 'markers') {
          var iconStyle = new olStyleStyle({
            image: new olStyleIcon(/** @type {olx.style.IconOptions} */ ({
              anchor: [0.5, 0.5],
              anchorXUnits: 'fraction',
              anchorYUnits: 'pixels',
              opacity: 0.75,
              scale: 0.13,
              src:'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Map_marker_font_awesome.svg/200px-Map_marker_font_awesome.svg.png',
            }))
          });
          const source = layer.getSource();
          const feature = source.getFeatureById(nextProps.hovered);
          feature.setStyle(iconStyle);
        }
      });
    }   
  }
  
  //everytime state/prop change
  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.searchCoordinates !== nextProps.searchCoordinates) return true;
    if (this.props.listings !== nextProps.listings) return true;
    if (this.props.hovered !== nextProps.hovered) return true;
    if(this.props.selected !== nextProps.selected) return true;
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
      <div id="map" style={{ height: "100vh", paddingBottom: '50'}}>
      </div>
    );
  }
}

export default Map;

