import React, { Component } from 'react';
import './App.css';

class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
      trains: [],
      filter: {
        "CarCount" : "All",
        "ServiceType": "All",
        "LineCode" : "All"
      }
    }
  }

  componentDidMount() {
    this.getTrains();
  }

  getTrains() {
    var interval = 1000;
    //Get API info
    setInterval(() => {
      fetch("https://api.wmata.com/TrainPositions/TrainPositions?contentType=json&api_key=fbf1849afc1f413687e96bab810f9843")
      .then(results => {
        return results.json();//Convert to JSON
      }).then(data => {
          data = this.filterTrains(data['TrainPositions']);
          let trains = data.map((train) => {//Isolate the array of train information
            let classString = "trainInfo " + train.LineCode;
            return (
              <ol key={train.TrainId} class={classString}>
                <li>ID: {train.TrainId}</li>
                <li>Train Number: {train.TrainNumber}</li>
                <li>Cars: {train.CarCount}</li>
                <li>Service Type: {train.ServiceType}</li>
                <li>Line Code: {train.LineCode}</li>
                <li>Destination: {train.DestinationStationCode}</li>
                <li>Stopped for {train.SecondsAtLocation}s</li>
              </ol>
            )
          })
          this.setState({trains: trains});
      })
    }, interval)
  }

  filterTrains(trains) {
    var keys = Object.keys(this.state.filter);
    var filtered = trains.filter(train => {
      if(train["LineCode"] == null){
        train["LineCode"] = "None";
      }
      for(let index in keys){
        if(this.state.filter[keys[index]] != "All" && this.state.filter[keys[index]] != train[keys[index]]){
          return false;
        }
      }
      return true;
    })
    return filtered;
  }

  render() {
    return (
      <>
      <div class="header">
          <h1>
              Organize by:
          </h1>

          <ul class="filterList">
              <li>Line<br></br>
                  <select id="LineCode" onChange={this.updateFilter}>
                      <option>All</option>
                      <option value="BL">Blue</option>
                      <option value="GR">Green</option>
                      <option value="OR">Orange</option>
                      <option value="RD">Red</option>
                      <option value="SV">Silver</option>
                      <option value="YL">Yellow</option>
                      <option value="None">N/A</option>
                  </select>
              </li>
              <li>Service Type<br></br>
                  <select id="ServiceType" onChange={this.updateFilter}>
                      <option>All</option>
                      <option>Normal</option>
                      <option value="NoPassengers">No Passengers</option>
                      <option>Unknown</option>
                  </select>
              </li>
              <li>Car Count <br></br>
                  <select id="CarCount" onChange={this.updateFilter}>
                      <option value={undefined}>All</option>
                      <option>0</option>
                      <option>2</option>
                      <option>6</option>
                      <option>8</option>
                  </select>
              </li>
          </ul>
      </div>
      <div class="trainDiv">
        <ul class="trainList">
          {this.state.trains}
        </ul>
      </div>
      </>
    )
  }

  updateFilter = () => {
    var carCount = document.getElementById("CarCount");
    let carCountValue = carCount.options[carCount.selectedIndex].value;

    let newFilter = {
      "LineCode": document.getElementById('LineCode').value,
      "ServiceType": document.getElementById("ServiceType").value,
      "CarCount": carCountValue
    }
    console.log("Value is " + (carCountValue * 2));

    this.setState({filter: newFilter})
  }
}

export default Board;
