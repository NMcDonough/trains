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

  //Runs the method which pings the API and paints the train information onscreen
  componentDidMount() {
    this.getTrains();
  }
  //Pings the API and paints the train information onscreen
  getTrains() {
    var interval = 5000;//Interval for the setInterval() method
    //Get API info
    setInterval(() => {
      fetch("https://api.wmata.com/TrainPositions/TrainPositions?contentType=json&api_key=fbf1849afc1f413687e96bab810f9843")
      .then(results => {
        return results.json();//Convert to JSON
      }).then(data => {
          this.setState({trains: data['TrainPositions']});//Sends generated content to the state
      })
    }, interval)
  }

  convertTrains() {
    let nodeTrains = this.filterTrains(this.state.trains);
    let filteredTrains = [];
    for(let train of nodeTrains) {
      filteredTrains.push(this.trainBox(train));
    }
    
    return filteredTrains;
  }

  //Filters incoming array of train data according to filter set in the state
  filterTrains(trains) {
    var keys = Object.keys(this.state.filter);//Gets keys from 'filter' key in state
    var filtered = trains.filter(train => {
      if(train["LineCode"] == null){//Changes null value to a string for evaluation
        train["LineCode"] = "None";
      }
      for(let index in keys){//Runs through all keys in the filter and checks them against the same key in the train object
        if(this.state.filter[keys[index]] != "All" && this.state.filter[keys[index]] != train[keys[index]]){
          //Returns false if and only if the filter isn't set to "All" and the key values for the filter and train don't match
          return false;
        }
      }
      return true;
    })
    return filtered;//Sends filtered array back to getTrains()
  }

  trainBox(train) {
    let classString = "trainInfo " + train.LineCode;//classString is used to assign CSS properties based on train info

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
  }

  render() {//Render

    //Render method contains HTML selections for filtering based on "LineCode", "ServiceType", and "CarCount"
    //Each select tag will trigger an update to the filter when a new selection is made
    return (
      <>
      <div class="header">
          <h1>
              Filter by:
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
          {this.convertTrains()}
        </ul>
      </div>
      </>
    )
  }
  
  //This method updates the filter to be applied the next time the API returns data
  updateFilter = (e) => {
    let newFilter = this.state.filter;

    switch(e.target.id){
      case "ServiceType": {
        newFilter["ServiceType"] = e.target.value;
        break;
      }
      case "LineCode": {
        newFilter["LineCode"] = e.target.value;
        break;
      }
      case "CarCount": {
        newFilter["CarCount"] = e.target.value;
        break;
      }
    }
    this.setState({filter: newFilter})
  }
}

export default Board;
