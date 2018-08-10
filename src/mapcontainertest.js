/*
to do:
  -learn how to implement that polygon thing https://fullstackreact.github.io/polygons
  -radius?
  -infowindow - set things there, delete marker, etc
*/

import {Map, InfoWindow, Marker, GoogleApiWrapper, Polygon} from 'google-maps-react';
import React, { Component } from 'react'; 
import MakerWindow from './components/MakerWindow';
import MakerMarkerMenu from './components/MakerMarkerMenu';

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
      selectedMarker: {},      
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
    //also it creates the polygon here though it'll have to be done elsewhere soon
    if (nextProps.geoLoc) {
      //debugger 
      let markerListHere = []
      for (let i = 1; i<5; i++) {
        let markerObject = {position: [], polygonCoords: []};
        let newMarker = []
        let newPosition = i * .001
        newMarker[0] = nextProps.geoLoc[0] + newPosition;
        newMarker[1] = nextProps.geoLoc[1] + newPosition;
        markerObject.position = newMarker 
        let polygonCoordsSketch = [
          {lat: newMarker[0] + .0003, lng: newMarker[1] + .0003},
          {lat: newMarker[0] - .0003, lng: newMarker[1] - .0003},
          {lat: newMarker[0] - .0002, lng: newMarker[1] + .0002},
        ];
        markerObject.polygonCoords = polygonCoordsSketch
        markerListHere.push(markerObject)
      }

      this.setState ({
        markers: markerListHere
      })
    }
  }

  onMarkerClick = (props, marker, e) => {

    const selectedMarkerLatLng = [props.position.lat, props.position.lng]

    const selectedMarkerProps = this.state.markers.filter(marker => {
      if (marker.position[0] === selectedMarkerLatLng[0] && marker.position[1] === selectedMarkerLatLng[1]) {
        return marker //debugger
      }
    })

    console.log(selectedMarkerProps)

    const selectedMP = selectedMarkerProps[0]

    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true,
      selectedMarker: selectedMP,
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

    const newMarker = {position: [map.latLng.lat(), map.latLng.lng()], polygonCoords: []}
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
          onClick={this.onMarkerClick.bind(this)}
          key={key}
          position={{lat: marker.position[0], lng: marker.position[1]}}
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
      if (marker.position[0] === markerLatLng[0] && marker.position[1] === markerLatLng[1]) {
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

  setPolygonsNow = () => {
    /*
      notes: isn't reflecting updated state! *************************************************88888888
    */
    console.log("setting polygons now")
    console.log(this.state.markers)
    const polygonsDrawn = this.state.markers.map((marker, key) => {
      return (
        <Polygon
          key={key}
          paths={marker.polygonCoords}
          strokeColor="#0000FF"
          strokeOpacity={0.8}
          strokeWeight={2}
          fillColor="#0000FF"
          fillOpacity={0.35} 
        />
      )
    })

    return polygonsDrawn
  }

  polygonSketcher = (newMarkerPolygonSketch, key) => {

    const editingMarker = newMarkerPolygonSketch.position

    const thisMarker = this.state.markers.filter(marker => {
      return (marker.position[0] === editingMarker[0] && marker.position[1] === editingMarker[1])
    })

    const editedMarkerList = Object.assign([], this.state.markers)

    editedMarkerList.map(marker => {
      if (marker.position[0] === editingMarker[0] && marker.position[1] === editingMarker[1]) {
        marker = thisMarker
      }
    })

    //debugger 

    this.setState({
      markers: editedMarkerList
    })

  }

  render() {
    //debugger 
    const style = {
      width: '100vw',
      height: '100vh'
    }

    let markersList 
    let polygonList
    if (this.state.markers.length > 0) {
      markersList = this.setMarkersNow();
      polygonList = this.setPolygonsNow();
    }

    return (
      <div style={style}>
        <MakerMarkerMenu 
          marker={this.state.selectedPlace}
          showMenu={this.state.showingInfoWindow}
          deleteMarker={this.deleteMarker.bind(this)}
          selectedMarkerProps={this.state.selectedMarker}
          tempProps={this.polygonSketcher.bind(this)}
        />
        {this.state.geoLoc !== undefined && this.state.geoLoc.length > 1 &&
          <div>
            {this.state.markers.length > 0 && 
              <Map
                google={this.props.google} 
                zoom={16}
                initialCenter={{
                  lat: this.state.geoLoc[0],
                  lng: this.state.geoLoc[1]
                }}
                onReady={this.fetchPlaces}
                onClick={this.onMapClicked.bind(this)}
              >

                {polygonList}
              
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
