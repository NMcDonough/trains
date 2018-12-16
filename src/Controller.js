import React, { Component } from 'react';
import './Controller.css';

class Controller extends React.Component {
    render () {
        return (
            <div>
                <h1>
                    Filter by:
                </h1>

                <ul class="filterList">
                    <li>
                        <button>Color</button>
                    </li>
                    <li>
                        <button>Service Type</button>
                    </li>
                    <li>
                        <button>Car Count</button>
                    </li>
                </ul>
            </div>
        )
    }
}

export default Controller;