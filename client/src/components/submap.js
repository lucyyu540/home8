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

class Map extends Component {
  constructor(props) {
    super(props);

    
    this.state = {center: this.props.coordinates ,zoom: 14};
     var iconStyle = new olStyleStyle({
        image: new olStyleIcon( ({
          anchor: [0.5, 0.5],
          anchorXUnits: 'fraction',
          anchorYUnits: 'pixels',
          opacity: 0.75,
          scale: 0.13,
          src:'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Map_marker_font_awesome.svg/200px-Map_marker_font_awesome.svg.png',
        }))
      });
    var vectorSource = new OlSourceVector();
    const feature = new OlFeature({
        geometry:new OlGeometryPoint(this.props.coordinates),
    })
    feature.setStyle(iconStyle)
    vectorSource.addFeature(feature);

    this.map = new OlMap({
      target: null,
      layers: [
        new OlLayerTile({
          source: new OlSourceOSM()
        }),
        new OlLayerVector({
            source: vectorSource,
        })//base map layer
      ],
      view: new OlView({
        center: this.state.center,
        zoom: this.state.zoom
      })
    });

    
  }

  updateMap() {
    this.map.getView().setCenter(this.state.center);
    this.map.getView().setZoom(this.state.zoom);
  } 


  componentDidMount() {
    this.map.setTarget("submap");
    // Listen to map changes
    this.map.on("moveend", () => {
      let center = this.map.getView().getCenter();
      let zoom = this.map.getView().getZoom();
      this.setState({ center, zoom });
    });
  }
  
  //everytime state/prop change
  shouldComponentUpdate(nextProps, nextState) {
    let center = this.map.getView().getCenter();
    let zoom = this.map.getView().getZoom();
    if (center === nextState.center && zoom === nextState.zoom) return false;
    return true;
  }
  

  render() {
    this.updateMap();
    return (
      <div id="submap" style={{ height: "30vh"}}></div>
    );
  }
}

export default Map;

