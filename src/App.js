import React, { Component } from "react";
import "./App.css";
import Sidebar from "./components/Sidebar";
import { load_google_maps, load_places } from "./utils";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: ""
    };
  }
  componentDidMount() {
    let googleMapsPromise = load_google_maps();
    let placesPromise = load_places();

    Promise.all([googleMapsPromise, placesPromise]).then(values => {
      let google = values[0];
      this.venues = values[1].response.venues;

      this.google = google;
      this.markers = [];
      this.infowindow = new google.maps.InfoWindow();

      this.map = new google.maps.Map(document.getElementById("map"), {
        zoom: 9,
        scrollwheel: true,
        center: {
          lat: this.venues[0].location.lat,
          lng: this.venues[0].location.lng
        }
      });

      this.venues.forEach(venue => {
        let marker = new google.maps.Marker({
          position: { lat: venue.location.lat, lng: venue.location.lng },
          map: this.map,
          venue: venue,
          id: venue.id,
          name: venue.name,
          animation: google.maps.Animation.DROP
        });

        marker.addListener("click", () => {
          if (marker.getAnimation() !== null) {
            marker.setAnimation(null);
          } else {
            marker.setAnimation(google.maps.Animation.BOUNCE);
          }
          setTimeout(() => {
            marker.setAnimation(null);
          }, 1500);
        });

        google.maps.event.addListener(marker, "click", () => {
          this.infowindow.setContent(marker.name);
          this.map.setCenter(marker.position);
          this.infowindow.open(this.map, marker);
        });

        this.markers.push(marker);
      });
      this.setState({ filteredVenues: this.venues });
    });
  }
  listItemClick = venue => {
    let marker = this.markers.filter(m => m.id === venue.id)[0];
    this.infowindow.setContent(marker.name);
    this.map.setCenter(marker.position);
    this.infowindow.open(this.map, marker);
    this.map.panBy(0, -125);
  };
  filterVenues(query) {
    let f = this.venues.filter(venue =>
      venue.name.toLowerCase().includes(query.toLowerCase())
    );
    this.markers.forEach(marker => {
      marker.name.toLowerCase().includes(query.toLowerCase()) === true
        ? marker.setVisible(true)
        : marker.setVisible(false);
    });
    this.setState({ filteredVenues: f, query });
  }

  render() {
    return (
      <div className="app">
        <div id="map" />
        <Sidebar
          filterVenues={this.filterVenues}
          filteredVenues={this.state.filteredVenues}
          listItemClick={this.listItemClick}
        />
      </div>
    );
  }
}

export default App;
