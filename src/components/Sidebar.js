import React, { Component } from "react";

class Sidebar extends Component {
  render() {
    return (
      <div className="app">
        <div id="sidebar">
          <input
            placeholder="Filter content"
            value={this.props.query}
            onChange={e => {
              this.props.filterVenues(e.target.value);
            }}
          />
          <br />
          <br />
          {this.props.filteredVenues &&
            this.props.filteredVenues.length > 0 &&
            this.props.filteredVenues.map((venue, index) => (
              <div
                className="venue-item"
                key={venue.id}
                onClick={() => {
                  this.props.listItemClick(venue);
                }}
              >
                {venue.name}
              </div>
            ))}
        </div>
      </div>
    );
  }
}

export default Sidebar;
