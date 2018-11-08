import idb from "idb";

export const dbPromise = idb.open("coffee-shop-db", 1, upgradeDB => {
  let venues_store = upgradeDB.createObjectStore("venues", { keyPath: "id" });
  venues_store.createIndex("id", "id");
});
export const getVenues = () => {
  return dbPromise.then(db => {
    return db
      .transaction("venues")
      .objectStore("venues")
      .getAll();
  });
};
export const storeVenues = venues => {
  return dbPromise.then(db => {
    const tx = db.transaction("venues", "readwrite");
    let store = tx.objectStore("venues");
    venues.forEach(venue => {
      store.put(venue);
    });
    return tx.complete;
  });
};
export const load_google_maps = () => {
  return new Promise((resolve, reject) => {
    window.resolveGoogleMapsPromise = () => {
      resolve(window.google);
      delete window.resolveGoogleMapsPromise;
    };

    const script = document.createElement("script");
    const API_KEY = "AIzaSyDxMMAyYaUd8hA2KIY5YjzDwX-H7bNtehI";
    script.src = `https://maps.googleapis.com/maps/api/js?libraries=places&key=${API_KEY}&callback=resolveGoogleMapsPromise`;
    script.async = true;
    document.body.appendChild(script);
  });
};

export const load_places = () => {
  return new Promise((resolve, reject) => {
    getVenues().then(venues => {
      if (venues.length > 0) {
        console.log("returning venues from idb");
        return resolve(venues);
      }
      console.log("fetching venues...");
      let city = "Fremont, CA";
      let query = "coffee";
      var apiURL = `https://api.foursquare.com/v2/venues/search?client_id=N1IAMKZUIK1AUHKRFGFBKPQ2YKDSBAKS4NTER5SYZN5CROR1&client_secret=4MKLXVLU2FGZQVRMAEDC15P0TFJGSCY3ZUYUZ0KHQQQLQ5R3&client_secret=1YGUIYW5OFI5ULNZYYIUAXZMBGJCRW4KMIF2NU1ULNKD2SNN&v=20130815%20&limit=50&near=${city}&query=${query}`;
      return fetch(apiURL)
        .then(resp => resp.json())
        .then(json => {
          let { venues } = json.response;
          console.log("storing venues...");
          storeVenues(venues)
            .then(res => {
              console.log("stored venues");
              return resolve(venues);
            })
            .catch(error => {
              reject(error);
            });
        })
        .catch(error => {
          reject(error);
        });
    });
  });
};

export const getGoogleImage = venue => {
  const API_KEY = "AIzaSyDxMMAyYaUd8hA2KIY5YjzDwX-H7bNtehI";
  return `https://maps.googleapis.com/maps/api/streetview?size=150x150&location=
  ${venue.location.lat},${venue.location.lng}
  &heading=151.78&pitch=-0.76&key=${API_KEY}`;
};
