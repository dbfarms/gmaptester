
import React, { Component } from 'react'; 

export default class MapMaker extends Component {
    constructor(props) {
        super(props)


    }


    handleSubmit = event => {
        event.preventDefault();
        debugger 
        this.setState({
            name: event.name 
        })

    }

    handleChange = event => {

        const {name, value } = event.target
        debugger 
    
      }

    render() {
        let name;
        return (
            <form onSubmit={this.handleSubmit.bind(this)}> 
            <div>
                <input 
                type="text"
                onChange={this.handleChange.bind(this)}
                name="name"
                value={name}
                />
            </div>

            </form>
        )
    }
}