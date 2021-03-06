/*
to do:
  -learn how to implement that polygon thing https://fullstackreact.github.io/polygons
  -radius?
  -infowindow - set things there, delete marker, etc
*/

import {Map, InfoWindow, Marker, GoogleApiWrapper, Polygon, Polyline} from 'google-maps-react';
import React, { Component } from 'react'; 
import MakerWindow from './components/MakerWindow';
import MakerMarkerMenu from './components/MakerMarkerMenu';
//import { Polyline } from "react-google-maps";

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
      editPolygon: false,
      testPolyLine: []
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
        let markerObject = {position: [], polygonCoords: [], polygonObject: []}; 
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

      const geoLoc = nextProps.geoLoc
      //debugger 
      const testPolyLine = [
        {lat: geoLoc[0], lng: geoLoc[1] },
        {lat: geoLoc[0] + .001, lng: geoLoc[1] + .002},
        {lat: geoLoc[0] + .001, lng: geoLoc[1] + .002},
      ]
      console.log(testPolyLine)

      this.setState ({
        markers: markerListHere,
        testPolyLine: testPolyLine
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

  onPolygonClick = (props, polygon, e) => {
    //i think e is where i clicked, so probably can get rid of it
    
    const editingId = props.id; 
    const editedPolygon = this.state.markers[editingId]
    console.log(editingId)
    console.log(props)
    console.log(polygon)
    console.log(e)

    function getPaths(polygon){
      var coordinates = (polygon.getPath().getArray());
      console.log(coordinates);
    }

    getPaths(polygon)

    const newCoords = []
    const polygonDetails = [this, editingId, newCoords]

    //this seems to work but i don't know why
    // - this.state.markers[at the position selected].polygonObject at whatever position is reflecting the correct
    //value for some reason 
    //eventually i'll need to do more than set state and post info to server... at which point i'll revisit this
    console.log(editedPolygon)
    for (let i=0; i<editedPolygon.polygonCoords.length; i++) {
      //debugger 
      console.log(editedPolygon.polygonObject.polygon.getPath()["b"][i].lat())
      console.log(editedPolygon.polygonObject.polygon.getPath()["b"][i].lng())
      editedPolygon.polygonObject.props.paths[i].lat = editedPolygon.polygonObject.polygon.getPath()["b"][i].lat()
      editedPolygon.polygonObject.props.paths[i].lng = editedPolygon.polygonObject.polygon.getPath()["b"][i].lng()
    }

    debugger 

    const updatedPolygon = editedPolygon.polygonObject.polygon.getPath()["b"].forEach(latLng => {
      
      debugger 
      
      return latLng 
      /*
      console.log(latLng.lat())
      console.log(latLng.lng())
      console.log(this.state.markers[0].polygonCoords)
      console.log(this)

      const polygonHere = this[0]
      const idOfPolygon = this[1] 

      ///how to get latLng.lat() and latLng.lng() to the right places in the state.markers... 

      const newLat = latLng.lat()
      const newLng = latLng.lng()
      const newLatLng = [newLat, newLng]
      debugger 
      this[2].push(newLatLng)


      //debugger 

      return this 
      */

    }, polygonDetails)

    //console.log(this.ref.props.paths)
    //console.log(this.state.markers[0].polygonCoords)
    //debugger 

    const markersWithNewPolygonCoords = Object.assign([], this.state.markers)
    //markersWithNewPolygonCoords[editingId].polygonObject = updatedPolygon 

    //debugger 


    this.setState({
      editPolygon: !this.state.editPolygon
      
    })
    console.log(this.state.editPolygon)
  }

  onDragEnd = () => {
    debugger 
  }

  //bindRef = ref => this.ref = ref; 
  
  bindRef = (ref) => {

    //debugger 

    this.ref = ref
    const addedPolygonMarkers = Object.assign([], this.state.markers)

    
    console.log(ref)
    if (ref != null) {
      //debugger 
      for (let i=0; i < addedPolygonMarkers.length; i++) {
        if (i === ref.props.id) {
          addedPolygonMarkers[i].polygonObject = ref 

          if (this.state.markers[i] !== addedPolygonMarkers[i]) {
            this.setState({
              markers: addedPolygonMarkers
            })
          }
        }
      }
    }

    //debugger 
  }

  setPolygonsNow = () => {
    const polygonsDrawn = this.state.markers.map((polygon, key) => {

      const newRef = this.bindRef.bind(this) 

      const newPolygon = <Polygon
        key={key}
        id={key}
        ref={this.bindRef.bind(this)}
        //ref={key}
        paths={polygon.polygonCoords}
        strokeColor="#0000FF"
        strokeOpacity={0.8}
        strokeWeight={2}
        fillColor="#0000FF"
        fillOpacity={0.35} 
        onClick={this.onPolygonClick.bind(this)}
        onMouseDown={event => console.log(event)}
        options={{
          editable: true, // this.state.editPolygon ? true : false, //this doesn't work and i don't know why 
          draggable: true 
        }}
      />

      return (
        newPolygon
      )
    })

    console.log("this")
    console.log(this.ref)

    //debugger 

    //this.refs = polygonsDrawn

    return polygonsDrawn
  }

  polygonSketcher = (newMarkerPolygonSketch, key, latOrLng) => {

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

    
    this.ref.polygon.setPaths(newMarkerPolygonSketch.polygonCoords)
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

    //debugger 

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

                <Polyline
                  path={this.state.testPolyLine}
                  strokeColor="#0000FF"
                  strokeOpacity={0.8}
                  strokeWeight={2} 
                />
              

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
