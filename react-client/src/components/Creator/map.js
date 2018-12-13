import React, { Component } from "react";
import { Map, InfoWindow, Marker, GoogleApiWrapper } from "google-maps-react";

export class SimpleMap extends Component {
  constructor(props) {
    super(props);
  }
  handleClickedMap = e => {
    console.log(e);
    let latitude = e.initialCenter.lat;
    let longtitude = e.initialCenter.lng;
    console.log("yyy", latitude, longtitude);
  };

  mapClicked(mapProps, map, clickEvent) {
    console.log("bala", mapProps);
    console.log("map", map);
    console.log("mapprops", mapProps);
  }

  render() {
    console.log("hhh", this.props.item);
    return (
      <Map
        onClick={this.mapClicked}
        google={this.props.google}
        initialCenter={{
          lat: this.props.item.eventLocation[0].latitude,
          lng: this.props.item.eventLocation[0].longtitude
        }}
        zoom={4}
      >
        <Marker name={"Current location"} />

        <InfoWindow onClose={this.onInfoWindowClose} />
      </Map>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyD2IjGONmJ7Si4cNEZtNPNgPy5pVEt-_14"
})(SimpleMap);
