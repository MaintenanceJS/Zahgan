import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';

const AnyReactComponent = ({ text }) => <div>{text}</div>;

class MapForCreator extends Component {
    static defaultProps = {
        center: {
            lat:  31.010192,
            lng: 36.435863,

        },
        zoom: 5
    };
    constructor(props){
        super(props)

    }


    handleClickedMap = (e) => {
        console.log(e)
        let latitude = e.lat
        let longtitude = e.lng
        console.log(latitude, longtitude)
    }

    render() {

        //console.log('gooo',this.props.item.eventLocation[0].longtitude,this.props.item.eventLocation[0].latitude)
        return (
            // Important! Always set the container height explicitly
            <div style={{ height: '100vh', width: '100%' }}>
                <GoogleMapReact onClick={this.handleClickedMap}
                    bootstrapURLKeys={{ key: "AIzaSyD2IjGONmJ7Si4cNEZtNPNgPy5pVEt-_14" }}
                    defaultCenter={this.props.center}
                    defaultIcon={this.props.Marker}
                    defaultZoom={this.props.zoom}
                >
                    <AnyReactComponent
                        lat={ 31.010192}
                        lng={36.435863}
                        text='YAHYA'
                    />
                </GoogleMapReact>
            </div>
        );
    }
}

export default MapForCreator