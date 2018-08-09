/*
to do:
  -learn how to implement that polygon thing https://fullstackreact.github.io/polygons
  -radius?
  -infowindow - set things there, delete marker, etc
*/

import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
import React, { Component } from 'react'; 
import MakerWindow from './components/MakerWindow';

export class MapContainer extends Component {
  constructor(props) {
    super(props) 

    this.state ={
      name: this.props.name,
      geoLoc: this.props.geoLoc,
      showingInfoWindow: false,
      showingMakerWindow: false,
      activeMarker: {},
      selectedPlace: {},
      markers: [],
    }

  }

  componentWillMount(){
    console.log(this.props)
    console.log(this.state)
  }

  componentWillReceiveProps(nextProps){
    console.log(this.props)
    console.log(nextProps)
    this.setState({
      geoLoc: nextProps.geoLoc
    })

    //eventually this will load from the server from saved maps, or will not exist for new maps **********************888
    //right now it just sets to state predetermined positions based on location
    if (nextProps.geoLoc) {
      //debugger 
      let markerListHere = []
      for (let i = 1; i<5; i++) {
        let newMarker = []
        let newPosition = i * .001
        newMarker[0] = nextProps.geoLoc[0] + newPosition;
        newMarker[1] = nextProps.geoLoc[1] + newPosition;
        markerListHere.push(newMarker)
      }

    this.setState ({
      markers: markerListHere
    })

    }
  
  }

  onMarkerClick = (props, marker, e) => {
    //debugger 
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
      //showingMakerWindow: true
    });
  }
 
  onMapClicked = (e, mapProps, map) => {
    //debugger 
    console.log(mapProps)
    const {google} = mapProps;
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      })
    }

    const newMarker = [map.latLng.lat(), map.latLng.lng()]
    const newMarkersList = this.state.markers 
    newMarkersList.push(newMarker)

    this.setState({
      markers: newMarkersList
    })

  };

  fetchPlaces(mapProps, map) {
    console.log(mapProps)
    const {google} = mapProps;
    const service = new google.maps.places.PlacesService(map);
    console.log(service)
    // see componentwillreceiveprops note for when this will pull data from server ... **************************************888888
  }

  windowHasOpened(){
    // 
    
  }

  windowHasClosed() {
    this.setState({
      showingInfoWindow: false,
      activeMarker: null
    })
  }

  setMarkersNow = () => {
    const markers = this.state.markers.map((marker, key)=> {
      return (
        <Marker 
          onClick={this.onMarkerClick}
          key={key}
          position={{lat: marker[0], lng: marker[1]}}
        />
      )
    })
    return markers 
  }

  deleteMarker = (event) => {
    console.log("here")
    //debugger 
    const markerLatLng = [this.state.selectedPlace.position.lat, this.state.selectedPlace.position.lng]


    const newMarkersState = Object.assign([], this.state.markers);
    let indexOfMarkerToDelete;

    console.log(markerLatLng)
    this.state.markers.map((marker, i) => {
      console.log(marker)
      if (marker[0] === markerLatLng[0] && marker[1] === markerLatLng[1]) {
        return indexOfMarkerToDelete = i //debugger 
      }
    })
    
    
    if (indexOfMarkerToDelete > -1) {
      newMarkersState.splice(indexOfMarkerToDelete, 1)
    }

    this.setState({
      markers: newMarkersState,
      showingInfoWindow: false,
      activeMarker: null
    })
  }

  render() {
    //debugger 
    const style = {
      width: '100vw',
      height: '100vh'
    }

    let markersList 
    if (this.state.markers.length > 0) {
      markersList = this.setMarkersNow()
    }

    return (
      <div style={style}>
        <div className="menu">
          {this.state.showingInfoWindow &&
            <div>
              <h3>menu</h3>
              <button
                onClick={this.deleteMarker.bind(this)}
              >
                      <div>
                        remove marker
                      </div>
            </button>
            </div>
          }
        </div>
        {this.state.geoLoc !== undefined && this.state.geoLoc.length > 1 &&
          <div>
            {this.state.markers.length > 0 && 
              <Map
                google={this.props.google} 
                zoom={14}
                initialCenter={{
                  lat: this.state.geoLoc[0],
                  lng: this.state.geoLoc[1]
                }}
                onReady={this.fetchPlaces}
                onClick={this.onMapClicked.bind(this)}
              >
              
                {markersList.map((marker, key) => {
                  return marker
                })}

                <InfoWindow 
                  marker={this.state.activeMarker}
                  onOpen={this.windowHasOpened.bind(this)}
                  onClose={this.windowHasClosed.bind(this)}
                  visible={this.state.showingInfoWindow}
                >
                    <div>
                      <h1>{this.state.selectedPlace.name}</h1>
                      <MakerWindow />
                    </div>
                </InfoWindow>
              </Map>
            }
          </div>
        }
      </div>
    );
  }
}
 
export default GoogleApiWrapper({
  apiKey: process.env.REACT_APP_API_URL
})(MapContainer)
