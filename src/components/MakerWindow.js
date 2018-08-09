import React, { Component } from 'react';

export default class MakerWindow extends Component {
    constructor(props) {
        super(props)

    }

    deleteMarker1 = (event) => {
        console.log("here")
        debugger 
      }

    render() {
        //debugger 

        const markereDelete = this.deleteMarker1.bind(this);
        console.log(this.deleteMarker1)
        return (
            <div className="MakerWindow">
                eventually more stuff here maybe
                
            </div>
        )
    }
}

