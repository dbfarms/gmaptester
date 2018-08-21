import React, { Component } from 'react';
import MapContainer from './mapcontainertest';
import MapMaker from './components/MapMaker';
import MapUser from './components/MapUser';
import Player from './components/Player';
import ReactPlayer from 'react-player' //'react-player/lib/players/FilePlayer'; //'react-player' NOT SURE IF THIS WORKS FOR MOBILE YET
import './App.css';

require('dotenv').config({path: __dirname + '/.env'})

class App extends Component {
  constructor(){
    super()

    this.state = {
      name: '',
      userOrMaker: 'maker'
      //geoLoc: [latitude, longitude]
    }

    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords
      const geoLoc = [latitude, longitude]
      //debugger 
      this.setState({
        geoLoc: geoLoc
      })
      console.log(geoLoc)
    });

  }

  handleOptionChange = (changeEvent) => {
    console.log(changeEvent)
    this.setState({
      userOrMaker: changeEvent.target.value
    })
  }

  render() {
    //debugger 
    console.log(this.state)

    //<ReactPlayer file="../../getLostJams/06-chilax.mp3" attributes="controls" playing controls/> 
    return (
      <div className="App">
        <p>map maker / map user</p>
          <div>
            <label>
              <input 
                type="radio"
                value="maker"
                onChange={this.handleOptionChange}
                checked={this.state.userOrMaker==='maker'}
              />
              Make a Map
            </label>
            <label>
              <input
                type="radio"
                value="user"
                onChange={this.handleOptionChange}
                checked={this.state.userOrMaker==='user'}
              />
              Use a Map
            </label>
            <div className='player-wrapper'>
              <Player />
            </div>
            
          </div>
          {this.state.userOrMaker === 'maker' &&
            <MapMaker />

          }
          {this.state.userOrMaker === 'user' && 
            <MapUser />
          }
        
        <MapContainer geoLoc={this.state.geoLoc} name={this.state.name}/>
      </div>
    );
  }
}

export default App;
