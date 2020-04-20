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
    var markerLayer = new OlLayerVector({
      title: 'markers',
      source: vectorSource,
    });

    this.map = new OlMap({
      target: null,
      layers: [
        new OlLayerTile({
          source: new OlSourceOSM()
        }),
        markerLayer
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
  componentDidUpdate(nextProps, prevState) {
    this.map.getLayers().forEach(layer => {
      if (layer.get('title') == 'markers') {
        const source = layer.getSource();
        const feature = source.getFeatures()[0].setGeometry(new OlGeometryPoint(this.props.coordinates));
      }
    });
    if (this.props.coordinates != nextProps.coordinates) {
      const center = this.props.coordinates
      this.setState({ center: center, zoom: 14 });
    }
  }
  
  //everytime state/prop change
  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.coordinates !== nextProps.coordinates) return true;
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

