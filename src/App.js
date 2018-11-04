import React, { Component } from "react";
import "./App.css";
import { load_google_maps, load_places } from "./utils";

class App extends Component {
  componentDidMount() {
    let googleMapsPromise = load_google_maps();
    let placesPromise = load_places();

    Promise.all([googleMapsPromise, placesPromise]).then(values => {
      let google = values[0];
      let venues = values[1].response.venues;

      this.google = google;
      this.markers = [];
      this.infowindow = new google.maps.InfoWindow();

      this.map = new google.maps.Map(document.getElementById("map"), {
        zoom: 9,
        scrollwheel: true,
        center: { lat: venues[0].location.lat, lng: venues[0].location.lng }
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
        this.markers.push(this.marker);
      });
    });
  }
  render() {
    return (
      <div className="app">
        <div id="map" />
        <div id="sidebar" />
      </div>
    );
  }
}

export default App;
