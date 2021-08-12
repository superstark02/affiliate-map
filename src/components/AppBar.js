import React, { Component } from 'react';
import "../App.css"

class AppBar extends Component {
    render() {
        return (
            <div className="app-bar" >
                <div>
                    Affinty Map
                </div>
                <div className="btn"  >
                    Pan & Zoom
                </div>
            </div>
        );
    }
}

export default AppBar;