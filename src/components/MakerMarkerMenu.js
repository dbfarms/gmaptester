/*
notes: need to pass the new state as it's being changed to the parent compoent mapcontainertest
-it shouldn't actually set state there though... so maybe there's a temp thing?


*/

import React, { Component } from 'react';

export default class MakerMarkerMenu extends Component {
    constructor(props) {
        super(props)

        this.state = {
            showingInfoWindow: props.showMenu,
            deleteMarker: props.deleteMarker,
            marker: props.marker,
            markerProps: props.selectedMarkerProps,
            tempProps: props.tempProps,
        }
    }

    componentWillReceiveProps(nextProps) {
        //debugger 
        this.setState({
            showingInfoWindow: nextProps.showMenu,
            markerProps: nextProps.selectedMarkerProps
        })
    }

    handleSubmit = event => {
        event.preventDefault();
        debugger 
        this.setState({
            name: event.name 
        })

    }

    handleInputChange =  event => {
        
        const {name, value } = event.target

        const nameBreakdown = name.split("-")
        const posOrKey = nameBreakdown[1].split(" ")
        const latOrLng = posOrKey[0]
        const key = Number(posOrKey[1])

        const newMarkerSketch = Object.assign({}, this.state.markerProps)

        newMarkerSketch.polygonCoords[key][latOrLng] = Number(value)

        this.state.tempProps(newMarkerSketch, key)

        this.setState({
            markerProps: newMarkerSketch
        })
    }

    pcoordsInputFormMaker = () => {
        
        return (
            <div className="pcoords">
                {this.state.markerProps.polygonCoords.map((pcoords, key) => {
                    //debugger 
                    return (
                        <span key={key}>
                            {key === 0 &&
                                <header>
                                    <div>
                                        <label>
                                            Latitude
                                        </label>
                                    </div>
                                    <div>
                                        <label>
                                            Longitude 
                                        </label>
                                    </div>
                                </header>
                            }

                            <div>
                                <input
                                    name={`pcoords-lat ${key}`}
                                    type="number"
                                    value={pcoords.lat}
                                    //key={key}
                                    onChange={this.handleInputChange.bind(this)}
                                />
                            </div>
                            <div>
                                <input
                                    name={`pcoords-lng ${key}`}
                                    type="number"
                                    value={pcoords.lng}
                                    //key={key}
                                    onChange={this.handleInputChange.bind(this)}
                                />
                            </div>
                        </span>
                    )
                })}
            </div>
        )
    }

    render() {
        //console.log(this.props)
        console.log(this.state.markerProps)

        let polygonInputs;

        if (this.state.markerProps.polygonCoords) {
            polygonInputs = this.pcoordsInputFormMaker();
            //console.log(polygonInputs)
        }


        return (
            <div className="menu">
                <h3>menu</h3>
                {this.state.showingInfoWindow &&
                <form>

                    <label>polygon</label>
                    {this.state.markerProps.polygonCoords &&
                        <div>
                           {polygonInputs} 
                        </div>

                    }
                
                    <button
                        onClick={this.props.deleteMarker}
                    >
                        <div>
                            remove marker
                        </div>
                    </button>
                </form>
                }
            </div>
        )
    }
}