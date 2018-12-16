import React, { Component } from 'react';
import './App.css';

class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
      trains: []
    }
  }

  componentDidMount() {
    //Get API info
    fetch("https://api.wmata.com/TrainPositions/TrainPositions?contentType=json&api_key=fbf1849afc1f413687e96bab810f9843")
    .then(results => {
      return results.json();//Convert to JSON
    }).then(data => {
      let trains = data['TrainPositions'].map((train) => {//Isolate the array of train information
        let classString = "trainInfo " + train.LineCode;
        return (
          <ol key={train.TrainId} class={classString}>
            <li>ID: {train.TrainId}</li>
            <li>Train Number: {train.TrainNumber}</li>
            <li>Cars: {train.CarCount}</li>
            <li>Service Type: {train.ServiceType}</li>
            <li>Line: {train.LineCode}</li>
          </ol>
        )
      })
      this.setState({trains: trains});
      console.log("The state:" + this.state.trains);
    }) 
  }

  render() {
    return (
      <div class="trainDiv">
        <ul class="trainList">
          {this.state.trains}
        </ul>
      </div>
    )
  }
}

export default Board;
