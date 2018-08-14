import React, {Component} from 'react';
import {Polygon} from 'google-maps-react';

class BayPolygon extends Component {
    constructor(props){
        super(props)

        this.state = {
            google: this.props.google
        }
    }
    componentDidUpdate() {
        debugger 
        this.state.google.maps.event.addListener(
            this.ref.getPath(),
            'set_at',
            position => this.props.onchangeSet(this.onChange(position))
        );
    }

    componentDidMount() {
        debugger 
        this.state.google.maps.event.addListener(
            this.ref.getPath(),
            'set_at',
            position => this.props.onchangeSet(this.onChange(position))
        );
    }

    onChange = position => ({
        coordinate: {
            lat: this.ref.getPath().b[position].lat(),
            lng: this.ref.getPath().b[position].lng(),
        },
        id: this.props.id,
        position,
    });

    bindRef = ref => this.ref = ref;

    render() {
        return <Polygon 
            ref={this.bindRef}
            path={this.props.path}
            defaultOptions={{
                editable: true
            }}
            onMouseDown={event => this.props.getIntialPos(this.onChange, event.vertex)}
        />
    }
}

export default BayPolygon;