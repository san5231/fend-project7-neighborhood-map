import React, { Component } from "react";
import "./App.css";
import Map from "./components/Map";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import * as utils from "./utils";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: "",
      filteredVenues: null,
      sidebarOpen: false
    };
    this.filterVenues = this.filterVenues.bind(this);
    this.toggleSideBar = this.toggleSideBar.bind(this);
    this.listItemClick = this.listItemClick.bind(this);
  }

  toggleSideBar() {
    this.setState(state => ({ sidebarOpen: !state.sidebarOpen }));
  }
  componentDidMount() {
    let googleMapsPromise = utils.load_google_maps();
    let placesPromise = utils.load_places();

    Promise.all([googleMapsPromise, placesPromise])
      .then(values => {
        let google = values[0];
        let venues = values[1];

        this.google = google;
        this.venues = venues;
        this.markers = [];
        this.infowindow = new google.maps.InfoWindow();
        this.info_windows = [];

        this.map = new google.maps.Map(document.getElementById("map"), {
          zoom: 10,
          scrollwheel: true,
          center: {
            lat: 37.647743,
            lng: -122.268979
          }
        });

        venues.forEach(venue => {
          let marker = new google.maps.Marker({
            position: { lat: venue.location.lat, lng: venue.location.lng },
            map: this.map,
            venue: venue,
            id: venue.id,
            name: venue.name,
            animation: google.maps.Animation.DROP
          });
          let infoContent = `<div class="info-content">
            <h4>${venue.name}</h4>
            <p>${venue.location.formattedAddress[0]},</br>
            ${venue.location.formattedAddress[1]}</p>

            <img class="venue-img" alt="${venue.name}"
            src="${utils.getGoogleImage(venue)}"
         </div>`;

          google.maps.event.addListener(marker, "click", () => {
            this.handleClick(this.infowindow, this.map, marker, infoContent);
          });

          this.markers.push(marker);
          this.info_windows.push({
            id: venue.id,
            name: venue.name,
            contents: infoContent
          });
        });
        this.setState({ sidebarOpen: true, filteredVenues: this.venues });
      })
      .catch(error => {
        console.log(error);
        alert("Error loading page");
      });
  }
  handleClick(infowindow, map, marker, infoContent) {
    infowindow.setContent(infoContent);
    map.setCenter(marker.position);
    infowindow.open(map, marker);
    map.panBy(0, -125);
    if (marker.getAnimation() !== null) {
      marker.setAnimation(null);
    } else {
      marker.setAnimation(this.google.maps.Animation.BOUNCE);
    }
    setTimeout(() => {
      marker.setAnimation(null);
    }, 1500);
  }

  listItemClick(venue) {
    let marker = this.markers.filter(m => m.id === venue.id)[0];
    let info_obj = this.info_windows.filter(i => i.id === venue.id)[0];
    let infoContent = (info_obj && info_obj.contents) || "nothing...";
    this.handleClick(this.infowindow, this.map, marker, infoContent);
  }
  filterVenues(query) {
    let f = this.venues.filter(venue =>
      venue.name.toLowerCase().includes(query.toLowerCase())
    );
    this.markers.forEach(marker => {
      marker.name.toLowerCase().includes(query.toLowerCase()) === true
        ? marker.setVisible(true)
        : marker.setVisible(false);
    });
    this.setState({ filteredVenues: f, query: query });
  }

  render() {
    let displaySidebar = this.state.sidebarOpen ? "block" : "none";
    let menuText = this.state.sidebarOpen ? "Close" : "Open";
    return (
      <div className="app">
        <Navbar
          menuText={menuText}
          toggleSideBar={this.toggleSideBar}
          sidebarOpen={this.state.sidebarOpen}
        />
        <Sidebar
          menuText={menuText}
          displaySidebar={displaySidebar}
          sidebarOpen={this.state.sidebarOpen}
          toggleSideBar={this.toggleSideBar}
          query={this.state.query}
          filterVenues={this.filterVenues}
          filteredVenues={this.state.filteredVenues}
          listItemClick={this.listItemClick}
        />
        <Map />
      </div>
    );
  }
}

export default App;
