import React, { Component } from "react";

class Sidebar extends Component {
  render() {
    let displaySidebar = this.props.sidebarOpen ? "block" : "none";
    return (
      <div tabIndex="0" id="sidebar" style={{ display: displaySidebar }}>
        <input
          role="searchbox"
          aria-label="filter Coffee Shops"
          id="filter"
          placeholder="Filter Coffee Shops"
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
              tabIndex="0"
              className="venue-item"
              key={venue.id}
              onClick={() => {
                this.props.listItemClick(venue);
              }}
              onKeyPress={() => {
                this.props.listItemClick(venue);
              }}
            >
              {venue.name}
            </div>
          ))}
      </div>
    );
  }
}

export default Sidebar;
