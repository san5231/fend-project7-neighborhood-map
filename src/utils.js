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
  let city = "San Francisco, CA";
  let query = "Hotpot";
  var apiURL = `https://api.foursquare.com/v2/venues/search?client_id=N1IAMKZUIK1AUHKRFGFBKPQ2YKDSBAKS4NTER5SYZN5CROR1&client_secret=4MKLXVLU2FGZQVRMAEDC15P0TFJGSCY3ZUYUZ0KHQQQLQ5R3&v=20130815%20&limit=50&near=${city}&query=${query}`;
  return fetch(apiURL).then(resp => resp.json());
};
